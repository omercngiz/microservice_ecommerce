import { consumer } from "./kafka.js";
import { createStripeProduct, deleteStripeProduct } from "../stripe/utils/stripeProduct";

export const runKafkaSubscribtions = async () => {
    consumer.subscribe("product.created", async (message) => {
        const products = message.value;
        console.log("Received product.created event:", products);

        await createStripeProduct(products);
    });

    consumer.subscribe("product.deleted", async (message) => {
        const productId = message.value;
        console.log("Received product.deleted event:", productId);

        await deleteStripeProduct(productId);
    });

    await consumer.run();
}