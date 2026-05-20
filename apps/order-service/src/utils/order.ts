import type { OrderType } from "@digitalocean/types";
import { Order } from "@digitalocean/order-db";

export const createOrder = async (order: OrderType) => {
    const newOrder = new Order(order);

    try {
        const savedOrder = await newOrder.save();
        return savedOrder;
    } catch (error) {
        console.log(error);
        return error;
    }
}