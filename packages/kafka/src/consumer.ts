import { type Consumer, Kafka } from "kafkajs";

export const createKafkaConsumer = ( kafka: Kafka, groupId: string ) => {
    const consumer: Consumer = kafka.consumer({ groupId });
    const handlers: Map<string, (message: any) => Promise<void>> = new Map();

    const connect = async () => {
        await consumer.connect();
        console.log("Kafka consumer connected" + groupId);
    }

    const subscribe = async ( topic: string, handler: (message: any) => Promise<void> ) => {
        handlers.set(topic, handler);

        await consumer.subscribe({ 
            topic: topic, 
            fromBeginning: true 
        });
    }

    const run = async () => {
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                try {
                    const handler = handlers.get(topic);
                    const value = message.value?.toString();
                    
                    if (value && handler) {
                        await handler(JSON.parse(value));
                    }
                }
                catch (err) {
                    console.error("Error processing message: ", err);
                }
            }
        });
    }

    const disconnect = async () => {
        await consumer.disconnect();
    }

    return {
        connect,
        subscribe,
        run,
        disconnect
    };
}