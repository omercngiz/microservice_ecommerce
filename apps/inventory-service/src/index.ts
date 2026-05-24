import express from "express";
import dotenv from "dotenv";
import { producer, consumer } from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";
import { startReservationScheduler } from "./utils/scheduler.js";
import { inventoryRouter } from "./routes/inventory.route.js";
import { customLogger } from "@digitalocean/logger";
import type { NextFunction, Request, Response } from "express";

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

app.use("/", inventoryRouter);

// Global JSON hata yakalayıcı
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const status = (err as NodeJS.ErrnoException & { status?: number }).status ?? 500;
    res.status(status).json({ error: err.message ?? "Internal server error" });
});

const start = async () => {
    try {
        await Promise.all([producer.connect(), consumer.connect()]);
        await runKafkaSubscriptions();
        startReservationScheduler();

        const port = Number(process.env.PORT) || 8005;
        app.listen(port, () => {
            customLogger.info(`Inventory service is running on port ${port}`);
        });
    } catch (err) {
        customLogger.error({ err }, "Error starting inventory service");
        process.exit(1);
    }
};

start();


