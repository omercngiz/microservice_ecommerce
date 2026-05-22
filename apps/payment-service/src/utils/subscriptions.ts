import { consumer } from "./kafka.js";
import { createStripeProduct, deleteStripeProduct } from "../stripe/utils/stripeProduct";
import { signInternalRequest } from "@digitalocean/hmac-middleware";

export const runKafkaSubscribtions = async () => {
    consumer.subscribe("product.created", async (message) => {
        const product = message.value;
        console.log("Received product.created event:", product);

        const stripeProduct = await createStripeProduct(product);
        if (!stripeProduct || typeof (stripeProduct as any).id !== 'string') {
            console.error("createStripeProduct failed, skipping update.", stripeProduct);
            return;
        }

        const hmacHeaders = signInternalRequest();
        const updateRes = await fetch(`${process.env.PRODUCT_SERVICE_URL}/products/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...hmacHeaders },
            body: JSON.stringify({ stripeProductId: (stripeProduct as any).id })
        });
        if (!updateRes.ok) {
            console.error(`Failed to update stripeProductId for product ${product.id}:`, await updateRes.text());
        } else {
            console.log(`stripeProductId set for product ${product.id}: ${(stripeProduct as any).id}`);
        }
    });

    consumer.subscribe("product.deleted", async (message) => {
        const productId = message.value;
        console.log("Received product.deleted event:", productId);

        await deleteStripeProduct(productId);
    });

    await consumer.run();
}