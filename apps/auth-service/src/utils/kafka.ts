import { createKafkaClient, createKafkaProducer } from "@digitalocean/kafka";

const kafkaClient = createKafkaClient("auth-service");
export const producer = createKafkaProducer(kafkaClient);
