import type { FastifyRequest, FastifyReply } from "fastify";
import { Order } from "@digitalocean/order-db";

export const getUserOrders = async (request: FastifyRequest, reply: FastifyReply) => {
    console.log("User ID from request:", request.userId);
    const orders = await Order.find({ userId: request.userId });
    return reply.send({ message: "userID", userId: request.userId, orders });
};

export const getAllOrders = async (request: FastifyRequest, reply: FastifyReply) => {
    const orders = await Order.find();
    return reply.send(orders);
};