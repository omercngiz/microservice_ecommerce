import { Router } from "express";
import { createCheckoutSession, getCheckoutSession } from "../controllers/session.controller.js";

const sessionRoute: ReturnType<typeof Router> = Router();

sessionRoute.post("/create-checkout-session", createCheckoutSession);
sessionRoute.get("/:session_id", getCheckoutSession);

export { sessionRoute };