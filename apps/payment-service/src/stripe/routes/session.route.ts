import { Router } from "express";
import { createCheckoutSession, getCheckoutSession } from "../controllers/session.controller.js";
import { verifyHmac } from "@digitalocean/hmac-middleware";

const sessionRoute: ReturnType<typeof Router> = Router();

sessionRoute.post("/create-checkout-session", verifyHmac, createCheckoutSession);
sessionRoute.get("/:session_id", getCheckoutSession);

export { sessionRoute };