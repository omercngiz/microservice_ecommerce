import { Router } from "express";
import { getUserOrders, getAllOrders } from "../controller/order.controller";
import { verifyHmac } from "@digitalocean/hmac-middleware";

export const orderRouter: ReturnType<typeof Router> = Router();

orderRouter.get('/user-orders', verifyHmac, getUserOrders);
orderRouter.get('/orders', verifyHmac, getAllOrders);