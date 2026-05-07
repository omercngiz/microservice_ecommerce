import { Hono } from "hono";
import stripe from "../utils/stripe.js";
import { shouldBeUser } from "../middleware/auth";
import { getStripeProductPrice } from "../utils/stripeProduct.js";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
    console.log("[DEBUG] [session/create-checkout-session] Endpoint hit");
    
    const { cart } = await c.req.json();
    console.log("Received cart: ", cart);
    const userId = c.get("userId") as string;

    const lineItems = await Promise.all(
        cart.map(async (item: { id: string; name: string; quantity: number }) => {
            const unitAmount =  await getStripeProductPrice(item.id);
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: unitAmount as number,
                    },
                quantity: item.quantity,
            }
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
    return c.json({ clientSecret: session.client_secret});
});

sessionRoute.get("/:session_id", async (c) => {
    console.log("[DEBUG] [session/:session_id] Endpoint hit");

    const { session_id } = c.req.param();
    const session = await stripe.checkout.sessions.retrieve(
        session_id as string,
        {
            expand: ["line_items"],
        }
    );
    return c.json({
        status: session.status,
        paymentStatus: session.payment_status,
    });
});

export { sessionRoute };