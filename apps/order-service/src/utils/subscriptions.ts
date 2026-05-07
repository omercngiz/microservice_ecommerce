import { consumer } from "./kafka";
import { createOrder } from "./order";

export const runKafkaSubscribtions = async () => {
    consumer.subscribe("payment.successful", async (message) => {
        console.log("Received payment.successful event:", message);

        const order = message.value;
        await createOrder(order);
    });

    await consumer.run();
}