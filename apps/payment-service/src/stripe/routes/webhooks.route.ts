import { Router } from "express";
import { handleStripeWebhook } from "../controllers/webhook.controller.js";

const webhooksRoute: ReturnType<typeof Router> = Router();

webhooksRoute.post("/stripe", handleStripeWebhook);

export { webhooksRoute };