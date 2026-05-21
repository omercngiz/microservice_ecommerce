import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { producer, consumer } from "./utils/kafka.js";
import { runKafkaSubscribtions } from "./utils/subscriptions.js";
import { customLogger } from "@digitalocean/logger";
import { stripeRoute } from "./stripe/routes/routes.js";
//import { iyzicoRoute } from "./iyzico/routes/routes.js";

const app = new Hono();

app.route("/stripe", stripeRoute);
//app.route("/iyzico", iyzicoRoute);

app.get("/health", (c) => {
  return c.json({
    status: "success",
    uptime: process.uptime(),
    timeStamp: new Date().toISOString(),
  });
});

const start = async () => {
  try {
    await Promise.all([consumer.connect(), producer.connect()]);
    await runKafkaSubscribtions();

    serve(
      {
        fetch: app.fetch,
        port: process.env.PORT! as unknown as number,
      },
      (info) => {
        customLogger.info(
          `Payment service is running on http://localhost:${info.port}`,
        );
      },
    );
  } catch (error) {
    customLogger.error("Error starting the server:", error);
    process.exit(1);
  }
};
start();
