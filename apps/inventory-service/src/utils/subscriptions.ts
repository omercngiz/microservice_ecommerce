import { consumer } from "./kafka.js";
import { confirmByUser, releaseByUser, seedInventoryItem } from "../controllers/inventory.controller.js";
import { customLogger } from "@digitalocean/logger";

export const runKafkaSubscriptions = async () => {
    // Ödeme başarılı → rezervasyonları onayla
    await consumer.subscribe("payment.successful", async (message: { value: { userId?: string } }) => {
        const userId = message.value?.userId;
        if (!userId) return;
        try {
            await confirmByUser(userId);
            customLogger.info({ userId }, "Inventory: reservations confirmed");
        } catch (err) {
            customLogger.error({ err, userId }, "Inventory: failed to confirm reservations");
        }
    });

    // Ödeme başarısız → rezervasyonları serbest bırak
    await consumer.subscribe("payment.failed", async (message: { value: { userId?: string } }) => {
        const userId = message.value?.userId;
        if (!userId) return;
        try {
            await releaseByUser(userId);
            customLogger.info({ userId }, "Inventory: reservations released");
        } catch (err) {
            customLogger.error({ err, userId }, "Inventory: failed to release reservations");
        }
    });

    // Yeni ürün oluşturuldu → stok kaydı aç (stok=0)
    await consumer.subscribe("product.created", async (message: { value: { id?: string } }) => {
        const productId = message.value?.id;
        if (!productId) return;
        try {
            await seedInventoryItem(productId);
            customLogger.info({ productId }, "Inventory: new item seeded");
        } catch (err) {
            customLogger.error({ err, productId }, "Inventory: failed to seed item");
        }
    });

    await consumer.run();
};
