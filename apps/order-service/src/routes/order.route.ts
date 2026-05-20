import type { FastifyInstance } from "fastify";
import { getUserOrders, getAllOrders } from "../controller/order.controller";

export const orderRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/user-orders', getUserOrders);
    fastify.get('/orders', getAllOrders);
};