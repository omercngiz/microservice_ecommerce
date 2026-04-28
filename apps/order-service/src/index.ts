import { clerkPlugin } from "@clerk/fastify";
import Fastify from "fastify";
import { shouldBeUser } from "./middleware/auth";
import { connectOrderDB } from "@digitalocean/order-db";
import { orderRoutes } from "./routes/order.route";
import { producer, consumer } from "./utils/kafka";

const fastify = Fastify({
  logger: true,
});

fastify.register(clerkPlugin);

fastify.get("/health", async (request, reply) => {
  return reply.status(200).send({
    status: "success",
    uptime: process.uptime(),
    timeStamp: new Date().toISOString(),
  });
});

fastify.get("/test", { preHandler: shouldBeUser }, async (request, reply) => {
  return reply.send({ message: "Authenticated!", userId: request.userId });
});

fastify.register(orderRoutes);

const start = async () => {
  try {
    await Promise.all([connectOrderDB(), producer.connect(), consumer.connect()]);
  
    await fastify.listen({ port: 8001 });
    console.log("Order service is running on port 8001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
