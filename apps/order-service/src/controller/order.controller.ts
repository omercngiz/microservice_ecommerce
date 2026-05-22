import type { Request, Response } from "express";
import { Order } from "@digitalocean/order-db";

export const getUserOrders = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Kullanıcı kimliği doğrulanamadı." });
    }

    const orders = await Order.find({ userId });
    res.json({ orders });
};

export const getAllOrders = async (req: Request, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: "Bu işleme yalnızca admin erişebilir." });
    }

    const orders = await Order.find();
    res.json({ orders });
};