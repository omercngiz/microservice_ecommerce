import { createKafkaClient, createKafkaConsumer, createKafkaProducer } from "@digitalocean/kafka";

const kafkaClient = createKafkaClient("inventory-service");
export const producer = createKafkaProducer(kafkaClient);
export const consumer = createKafkaConsumer(kafkaClient, "inventory-group");
