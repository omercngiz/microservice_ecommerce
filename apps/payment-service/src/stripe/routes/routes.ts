import { Hono } from "hono";
import { sessionRoute } from "./session.route";
import { webhooksRoute } from "./webhooks.route";


const stripeRoute = new Hono();

stripeRoute.route("/session", sessionRoute);
stripeRoute.route("/webhooks", webhooksRoute);

export { stripeRoute };