import type { Request, Response } from "express";
import stripe from "../utils/stripe.js";
import { getStripeProductPrice } from "../utils/stripeProduct.js";

export const createCheckoutSession = async (req: Request, res: Response) => {
    const { cart } = req.body;
    console.log("Received cart: ", cart);
    const userId = req.headers['x-user-id'] as string;

    const lineItems = await Promise.all(
        cart.map(async (item: { id: string; name: string; quantity: number }) => {
            const unitAmount = await getStripeProductPrice(item.id);
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: unitAmount as number,
                },
                quantity: item.quantity,
            };
        })
    );

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        client_reference_id: userId,
        mode: 'payment',
        ui_mode: 'embedded_page',
        return_url: `${process.env.STRIPE_RETURN_URL}?session_id={CHECKOUT_SESSION_ID}`,
    });
    console.log(lineItems);
    res.json({ clientSecret: session.client_secret });
};

export const getCheckoutSession = async (req: Request, res: Response) => {
    console.log("[DEBUG] [session/:session_id] Endpoint hit");

    const { session_id } = req.params;
    const session = await stripe.checkout.sessions.retrieve(
        session_id as string,
        {
            expand: ["line_items"],
        }
    );
    res.json({
        status: session.status,
        paymentStatus: session.payment_status,
    });
};
