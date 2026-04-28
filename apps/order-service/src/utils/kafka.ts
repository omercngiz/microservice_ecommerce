import { createKafkaClient, createKafkaConsumer, createKafkaProducer } from "@digitalocean/kafka";

const kafkaClient = createKafkaClient("order-service");
export const producer = createKafkaProducer(kafkaClient);
export const consumer = createKafkaConsumer(kafkaClient, "order-group");