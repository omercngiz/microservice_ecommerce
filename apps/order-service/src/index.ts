import Fastify from "fastify";
import { connectOrderDB } from "@digitalocean/order-db";
import { orderRoutes } from "./routes/order.route";
import { producer, consumer } from "./utils/kafka";
import { runKafkaSubscribtions } from "./utils/subscriptions";

const fastify = Fastify({
  logger: true,
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

    await fastify.listen({ port: 8001 });
    console.log("Order service is running on port 8001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

