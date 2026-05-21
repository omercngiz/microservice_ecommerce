import { Router } from "express";
import { sessionRoute } from "./session.route.js";
import { webhooksRoute } from "./webhooks.route.js";

const stripeRoute: ReturnType<typeof Router> = Router();

stripeRoute.use("/session", sessionRoute);
stripeRoute.use("/webhooks", webhooksRoute);

export { stripeRoute };