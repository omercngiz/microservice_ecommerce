import { Hono } from "hono";
import { createCheckoutSession, getCheckoutSession } from "../controllers/session.controller.js";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", createCheckoutSession);
sessionRoute.get("/:session_id", getCheckoutSession);

export { sessionRoute };