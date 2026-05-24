import express from "express";
import { connectOrderDB } from "@digitalocean/order-db";
import { orderRouter } from "./routes/order.route";
import { producer, consumer } from "./utils/kafka";
import { runKafkaSubscribtions } from "./utils/subscriptions";
import { customLogger } from "@digitalocean/logger";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    uptime: process.uptime(),
    timeStamp: new Date().toISOString(),
  });
});

app.use("/", orderRouter);

const start = async () => {
  try {
    await Promise.all([connectOrderDB(), producer.connect(), consumer.connect()]);
    runKafkaSubscribtions();

    const port = Number(process.env.PORT);
    app.listen(port, () => {
      customLogger.info(`Order service is running on port ${port}`);
    });
  } catch (err) {
    customLogger.error({ err }, "Error starting order service");
    process.exit(1);
  }
};
start();
