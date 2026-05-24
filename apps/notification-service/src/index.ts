import express from "express";
import dotenv from "dotenv";
import { consumer } from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";
import { customLogger } from "@digitalocean/logger";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "success",
        uptime: process.uptime(),
        timeStamp: new Date().toISOString(),
    });
});

const start = async () => {
    try {
        await consumer.connect();
        runKafkaSubscriptions();

        const port = Number(process.env.PORT) || 8006;
        app.listen(port, () => {
            customLogger.info(`Notification service is running on port ${port}`);
        });
    } catch (err) {
        customLogger.error({ err }, "Error starting notification service");
        process.exit(1);
    }
};

start();

