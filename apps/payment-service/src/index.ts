import express from "express";
import type { NextFunction, Request, Response } from "express";
import { producer, consumer } from "./utils/kafka.js";
import { runKafkaSubscribtions } from "./utils/subscriptions.js";
import { customLogger } from "@digitalocean/logger";
import { stripeRoute } from "./stripe/routes/routes.js";
//import { iyzicoRoute } from "./iyzico/routes/routes.js";

const app = express();

// Stripe webhook raw body için önce bu route tanımlanmalı (express.json()'dan önce)
app.use("/stripe/webhooks", express.raw({ type: "application/json" }));

// Diğer route'lar için JSON parser
app.use(express.json());

app.use("/stripe", stripeRoute);
//app.use("/iyzico", iyzicoRoute);

app.get("/health", (req, res) => {
  res.json({
    status: "success",
    uptime: process.uptime(),
    timeStamp: new Date().toISOString(),
  });
});

// Global JSON hata yöneticisi — tüm controller hataları JSON olarak döner
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  customLogger.error({ err }, "Unhandled error in payment-service");
  const status = (err as NodeJS.ErrnoException & { status?: number }).status ?? 500;
  res.status(status).json({ error: err.message ?? "Internal server error" });
});

const start = async () => {
  try {
    await Promise.all([consumer.connect(), producer.connect()]);
    await runKafkaSubscribtions();

    const port = Number(process.env.PORT);
    app.listen(port, () => {
      customLogger.info(`Payment service is running on http://localhost:${port}`);
    });
  } catch (error) {
    customLogger.error({ err: error }, "Error starting the server");
    process.exit(1);
  }
};
start();

