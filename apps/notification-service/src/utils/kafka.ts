import { createKafkaClient, createKafkaConsumer } from "@digitalocean/kafka";

const kafkaClient = createKafkaClient("notification-service");
export const consumer = createKafkaConsumer(kafkaClient, "notification-group");
