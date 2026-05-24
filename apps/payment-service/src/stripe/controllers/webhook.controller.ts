import type { Request, Response } from "express";
import stripe from "../utils/stripe.js";
import Stripe from "stripe";
import { producer } from "../../utils/kafka.js";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const body = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(400).send("Webhook Error: " + message);
        return;
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            producer.send("payment.successful", {
                value: {
                    userId: session.client_reference_id,
                    userEmail: session.customer_details?.email,
                    totalPrice: session.amount_total,
                    status: session.payment_status === "paid" ? "paid" : "pending",
                    quantity: lineItems.data.reduce((total, item) => total + (item.quantity ?? 0), 0),
                    products: lineItems.data.map((item) => ({
                        name: item.description,
                        quantity: item.quantity,
                        price: item.price?.unit_amount,
                    })),
                },
            });
            break;
        }

        case "checkout.session.expired":
        case "payment_intent.payment_failed": {
            const obj = event.data.object as Stripe.Checkout.Session | Stripe.PaymentIntent;
            const userId =
                "client_reference_id" in obj
                    ? obj.client_reference_id
                    : null;
            const userEmail =
                "customer_details" in obj && obj.customer_details
                    ? obj.customer_details.email
                    : null;

            producer.send("payment.failed", {
                value: { userId, userEmail },
            });
            break;
        }

        default:
            break;
    }

    res.json({ received: true });
};
