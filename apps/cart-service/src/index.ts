import express from "express";
import dotenv from "dotenv";
import { cartRouter } from "./routes/cart.route.js";
import { customLogger } from "@digitalocean/logger";
import redis from "./utils/redis.js";
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

app.use("/", cartRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const status = (err as NodeJS.ErrnoException & { status?: number }).status ?? 500;
    res.status(status).json({ error: err.message ?? "Internal server error" });
});

const start = async () => {
    try {
        await redis.connect();
        customLogger.info("Connected to Redis");

        const port = Number(process.env.PORT) || 8004;
        app.listen(port, () => {
            customLogger.info(`Cart service is running on port ${port}`);
        });
    } catch (err) {
        customLogger.error({ err }, "Error starting cart service");
        process.exit(1);
    }
};

start();
