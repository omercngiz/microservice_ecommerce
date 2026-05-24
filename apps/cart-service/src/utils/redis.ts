import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
    lazyConnect: true,
});

export default redis;

const CART_TTL = 60 * 60 * 24 * 7; // 7 gün

const cartKey = (userId: string) => `cart:${userId}`;

export type CartItem = {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    slug: string;
    images: string[];
};

export const getCart = async (userId: string): Promise<CartItem[]> => {
    const data = await redis.get(cartKey(userId));
    if (!data) return [];
    return JSON.parse(data) as CartItem[];
};

export const setCart = async (userId: string, items: CartItem[]): Promise<void> => {
    await redis.set(cartKey(userId), JSON.stringify(items), "EX", CART_TTL);
};

export const clearCart = async (userId: string): Promise<void> => {
    await redis.del(cartKey(userId));
};
