import type { OrderType } from "@digitalocean/types";
import { Order } from "@digitalocean/order-db";
import { producer } from "./kafka.js";

export const createOrder = async (order: OrderType) => {
    const newOrder = new Order(order);

    try {
        const savedOrder = await newOrder.save();

        producer.send("order.created", {
            value: {
                orderId: String(savedOrder._id),
                userId: savedOrder.userId,
                userEmail: savedOrder.userEmail,
                totalPrice: savedOrder.totalPrice,
                products: savedOrder.products,
                status: savedOrder.status,
            },
        });

        return savedOrder;
    } catch (error) {
        console.log(error);
        return error;
    }
}