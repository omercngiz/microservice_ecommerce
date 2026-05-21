import type { Request, Response } from "express";
import stripe from "../utils/stripe.js";
import Stripe from "stripe";
import { producer } from "../../utils/kafka.js";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const handleStripeWebhook = async (req: Request, res: Response) => {
    console.log("[DEBUG] [webhooks/stripe] Endpoint hit");

    const body = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.log("[ERROR] [webhooks/stripe] Webhook signature verification failed.", message);
        res.status(400).send("Webhook Error: " + message);
        return;
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            console.log("[DEBUG] [webhooks/stripe] checkout.session.completed Session: ", session);
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
            console.log("[DEBUG] [webhooks/stripe] WEBHOOK RECEIVED: ", session, lineItems);
            break;
        }
        default:
            break;
    }

    res.json({ received: true });
};
