import { Hono } from "hono";
import { handleStripeWebhook } from "../controllers/webhook.controller.js";

const webhooksRoute = new Hono();

webhooksRoute.post("/stripe", handleStripeWebhook);

export { webhooksRoute };