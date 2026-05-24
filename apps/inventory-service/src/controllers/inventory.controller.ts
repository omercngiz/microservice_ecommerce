import type { Request, Response } from "express";
import { prisma } from "@digitalocean/inventory-db";

// GET /stock/:productId — stok bilgisi sorgula (public)
export const getStock = async (req: Request, res: Response) => {
    const productId = req.params.productId as string;

    const item = await prisma.inventoryItem.findUnique({ where: { productId } });

    if (!item) {
        return res.status(404).json({ error: "Bu ürün için stok kaydı bulunamadı." });
    }

    return res.status(200).json({
        productId: item.productId,
        availableStock: item.availableStock,
        totalStock: item.totalStock,
        reservedStock: item.reservedStock,
    });
};

// POST /stock — stok oluştur veya güncelle (admin only)
export const setStock = async (req: Request, res: Response) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ error: "Bu işleme yalnızca admin erişebilir." });
    }

    const { productId, totalStock } = req.body as { productId: string; totalStock: number };

    if (!productId || totalStock == null || totalStock < 0) {
        return res.status(400).json({ error: "productId ve totalStock (>= 0) zorunludur." });
    }

    const item = await prisma.inventoryItem.upsert({
        where: { productId },
        update: { totalStock, availableStock: totalStock },
        create: { productId, totalStock, availableStock: totalStock, reservedStock: 0 },
    });

    return res.status(200).json(item);
};

// POST /reserve — geçici rezervasyon (cart-service çağırır)
// body: { items: [{ productId, quantity }] }
export const reserve = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: "Kullanıcı kimliği doğrulanamadı." });
    }

    const { items } = req.body as { items: { productId: string; quantity: number }[] };

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "items dizisi zorunludur." });
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika

    // Race condition'a karşı tüm işlemi transaction içinde yap
    const reservationIds = await prisma.$transaction(async (tx) => {
        const ids: string[] = [];

        for (const { productId, quantity } of items) {
            const item = await tx.inventoryItem.findUnique({ where: { productId } });

            if (!item) {
                throw Object.assign(new Error(`Ürün stok kaydı bulunamadı: ${productId}`), { status: 404 });
            }

            if (item.availableStock < quantity) {
                throw Object.assign(
                    new Error(`Yetersiz stok: ${productId} (mevcut: ${item.availableStock}, istenen: ${quantity})`),
                    { status: 409 }
                );
            }

            await tx.inventoryItem.update({
                where: { productId },
                data: {
                    availableStock: { decrement: quantity },
                    reservedStock: { increment: quantity },
                },
            });

            const reservation = await tx.reservation.create({
                data: { userId, productId, quantity, expiresAt },
            });

            ids.push(reservation.id);
        }

        return ids;
    });

    return res.status(201).json({ reservationIds });
};

// POST /confirm — rezervasyonu onayla
// body: { userId } — ödeme başarılıysa çağrılır
export const confirmByUser = async (userId: string) => {
    const pendingReservations = await prisma.reservation.findMany({
        where: { userId, status: "PENDING" },
    });

    if (pendingReservations.length === 0) return;

    await prisma.$transaction(
        pendingReservations.map((r) =>
            prisma.reservation.update({
                where: { id: r.id },
                data: { status: "CONFIRMED" },
            })
        )
    );

    // reservedStock'u düşür (artık satıldı, ne reserved ne available)
    for (const r of pendingReservations) {
        await prisma.inventoryItem.update({
            where: { productId: r.productId },
            data: {
                reservedStock: { decrement: r.quantity },
                totalStock: { decrement: r.quantity },
            },
        });
    }
};

// POST /release — rezervasyonu iptal et
// body: { userId } — ödeme başarısızsa çağrılır
export const releaseByUser = async (userId: string) => {
    const pendingReservations = await prisma.reservation.findMany({
        where: { userId, status: "PENDING" },
    });

    if (pendingReservations.length === 0) return;

    await prisma.$transaction(
        pendingReservations.map((r) =>
            prisma.reservation.update({
                where: { id: r.id },
                data: { status: "CANCELLED" },
            })
        )
    );

    // Stoku geri yükle
    for (const r of pendingReservations) {
        await prisma.inventoryItem.update({
            where: { productId: r.productId },
            data: {
                availableStock: { increment: r.quantity },
                reservedStock: { decrement: r.quantity },
            },
        });
    }
};

// Cron tarafından çağrılır — süresi dolmuş PENDING rezervasyonları serbest bırak
export const expireStaleReservations = async () => {
    const expired = await prisma.reservation.findMany({
        where: { status: "PENDING", expiresAt: { lt: new Date() } },
    });

    if (expired.length === 0) return;

    await prisma.$transaction(
        expired.map((r) =>
            prisma.reservation.update({
                where: { id: r.id },
                data: { status: "EXPIRED" },
            })
        )
    );

    for (const r of expired) {
        await prisma.inventoryItem.update({
            where: { productId: r.productId },
            data: {
                availableStock: { increment: r.quantity },
                reservedStock: { decrement: r.quantity },
            },
        });
    }
};

// product.created Kafka event'inden gelen yeni ürün için stok kaydı oluştur (stok=0)
export const seedInventoryItem = async (productId: string) => {
    await prisma.inventoryItem.upsert({
        where: { productId },
        update: {},
        create: { productId, totalStock: 0, availableStock: 0, reservedStock: 0 },
    });
};
