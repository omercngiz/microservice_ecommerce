import type { Request, Response } from "express";
import stripe from "../utils/stripe.js";
import { getStripeProductPrice } from "../utils/stripeProduct.js";
import { signInternalRequest } from "@digitalocean/hmac-middleware";

export const createCheckoutSession = async (req: Request, res: Response) => {
    const { cart } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
        return res.status(401).json({ error: "Kullanıcı kimliği doğrulanamadı." });
    }

    const lineItems = await Promise.all(
        cart.map(async (item: { id: string; name: string; quantity: number }) => {
            const hmacHeaders = signInternalRequest(userId, userRole);
            const productRes = await fetch(`${process.env.PRODUCT_SERVICE_URL}/products/${item.id}`, {
                headers: hmacHeaders,
            });
            if (!productRes.ok) {
                throw new Error(`Product not found: ${item.id}`);
            }
            const product = await productRes.json() as { stripeProductId?: string };

            if (!product.stripeProductId) {
                throw new Error(`stripeProductId missing for product: ${item.id}`);
            }

            const unitAmount = await getStripeProductPrice(product.stripeProductId);
            if (!unitAmount) {
                throw new Error(`Could not get price for Stripe product: ${product.stripeProductId}`);
            }
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
