import { consumer } from "./kafka.js";
import { createStripeProducts, deleteStripeProduct } from "./stripeProduct.js";

export const runKafkaSubscribtions = async () => {
    consumer.subscribe("product.created", async (message) => {
        const products = message.value;
        console.log("Received product.created event:", products);

        await createStripeProducts(products);
    });

    consumer.subscribe("product.deleted", async (message) => {
        const productId = message.value;
        console.log("Received product.deleted event:", productId);

        await deleteStripeProduct(productId);
    });
}