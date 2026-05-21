import Fastify from "fastify";
import { connectOrderDB } from "@digitalocean/order-db";
import { orderRoutes } from "./routes/order.route";
import { producer, consumer } from "./utils/kafka";
import { runKafkaSubscribtions } from "./utils/subscriptions";
import { customLogger } from "@digitalocean/logger";

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z', // Human-readable timestamps
        ignore: 'pid,hostname',      // Remove noisy fields
        colorize: true                // Add colors
      }
    }
  } 
});

fastify.get("/health", async (request, reply) => {
  return reply.status(200).send({
    status: "success",
    uptime: process.uptime(),
    timeStamp: new Date().toISOString(),
  });
});

fastify.register(orderRoutes);

const start = async () => {
  try {
    await Promise.all([connectOrderDB(), producer.connect(), consumer.connect()]);
    //await Promise.all([producer.connect(), consumer.connect()]);
    runKafkaSubscribtions();

    await fastify.listen({ port: process.env.PORT! as unknown as number });
    customLogger.info(`Order service is running on port ${process.env.PORT}`);
  } catch (err) {
    customLogger.error(err);
    process.exit(1);
  }
};
start();

