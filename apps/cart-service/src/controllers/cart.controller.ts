import type { Request, Response } from "express";
import { signInternalRequest } from "@digitalocean/hmac-middleware";
import { getCart, setCart, clearCart, type CartItem } from "../utils/redis.js";

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL as string;
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL as string;

// GET / — kullanıcının sepetini getir
export const getCartController = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Kullanıcı kimliği doğrulanamadı." });

    const items = await getCart(userId);
    return res.status(200).json({ items });
};

// POST /items — sepete ürün ekle veya miktarı artır
export const addItemController = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Kullanıcı kimliği doğrulanamadı." });

    const { productId, quantity = 1, name, price, slug, images } = req.body as CartItem & { quantity?: number };

    if (!productId || !name || price == null) {
        return res.status(400).json({ error: "productId, name ve price zorunludur." });
    }

    const items = await getCart(userId);
    const existing = items.find((i) => i.productId === productId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        items.push({ productId, quantity, name, price, slug, images });
    }

    await setCart(userId, items);
    return res.status(200).json({ items });
};

// PUT /items/:productId — ürün miktarını güncelle
export const updateItemController = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Kullanıcı kimliği doğrulanamadı." });

    const productId = req.params.productId as string;
    const { quantity } = req.body as { quantity: number };

    if (quantity == null || quantity < 0) {
        return res.status(400).json({ error: "Geçerli bir quantity değeri giriniz." });
    }

    const items = await getCart(userId);
    const updated =
        quantity === 0
            ? items.filter((i) => i.productId !== productId)
            : items.map((i) => (i.productId === productId ? { ...i, quantity } : i));

    await setCart(userId, updated);
    return res.status(200).json({ items: updated });
};

// DELETE /items/:productId — sepetten ürün çıkar
export const removeItemController = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Kullanıcı kimliği doğrulanamadı." });

    const productId = req.params.productId as string;
    const items = await getCart(userId);
    const updated = items.filter((i) => i.productId !== productId);

    await setCart(userId, updated);
    return res.status(200).json({ items: updated });
};

// DELETE / — sepeti temizle
export const clearCartController = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Kullanıcı kimliği doğrulanamadı." });

    await clearCart(userId);
    return res.status(200).json({ message: "Sepet temizlendi." });
};

// POST /checkout — envanter rezerve et + ödeme oturumu başlat
// İki mod:
//   1) Lazy mode: client body'de { items } gönderir (localStorage cart)
//   2) Server mode: body boşsa Redis'ten alır
export const checkoutController = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Kullanıcı kimliği doğrulanamadı." });

    // Lazy mode: client cart'ı body'de gönderir; yoksa Redis'ten al
    let items: CartItem[] = req.body.items as CartItem[];
    if (!items || items.length === 0) {
        items = await getCart(userId);
    }

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "Sepet boş." });
    }

    // 1. Envanter rezervasyonu
    const hmacHeaders = signInternalRequest(userId, req.user?.role);
    const reserveRes = await fetch(`${INVENTORY_SERVICE_URL}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...hmacHeaders },
        body: JSON.stringify({
            items: items.map(({ productId, quantity }) => ({ productId, quantity })),
        }),
    });

    if (!reserveRes.ok) {
        const body = await reserveRes.json() as { error?: string };
        return res.status(reserveRes.status).json({
            error: body.error ?? "Stok rezervasyonu başarısız.",
        });
    }

    // 2. Ödeme oturumu oluştur (payment-service'i iç çağrıyla çağır)
    const paymentHmac = signInternalRequest(userId, req.user?.role);
    const paymentRes = await fetch(`${PAYMENT_SERVICE_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...paymentHmac },
        body: JSON.stringify({
            cart: items.map(({ productId, name, quantity }) => ({
                id: productId,
                name,
                quantity,
            })),
        }),
    });

    if (!paymentRes.ok) {
        const body = await paymentRes.json() as { error?: string };
        return res.status(paymentRes.status).json({
            error: body.error ?? "Ödeme oturumu oluşturulamadı.",
        });
    }

    const { clientSecret } = await paymentRes.json() as { clientSecret: string };
    return res.status(200).json({ clientSecret });
};
