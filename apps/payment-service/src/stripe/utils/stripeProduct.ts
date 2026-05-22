import stripe from "./stripe.js";
import type { StripeProductType } from "@digitalocean/types";

export const createStripeProduct = async (item: StripeProductType) => {
    try {
        const product = await stripe.products.create({
            name: item.name,
            metadata: {
                slug: item.slug,
            },
            description: item.description,
            default_price_data: {
                currency: "usd",
                unit_amount: Math.round(item.price * 100),
            },
        });
        return product;
    }catch (error) {
        console.log(error);
        return error;
    }
}

export const getStripeProductPrice = async (productId: string) => {
    try {
        const res = await stripe.prices.list({
            product: productId,
        });
        return res.data[0]?.unit_amount;
    }catch (error) {
        console.log(error);
        return error;
    }
}

export const createStripeProducts = async (items: StripeProductType[]) => {
    try {
        const products = await Promise.all(items.map((item) => createStripeProduct(item)));
        return products;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const deleteStripeProduct = async (productId: string) => {
    try {
        await stripe.products.update(productId, { default_price: '' });

        const prices = await stripe.prices.list({
            product: productId,
            active: true
        });

        await Promise.all(
            prices.data.map((price) => stripe.prices.update(price.id, { active: false }))
        );

        const deletedProduct = await stripe.products.del(productId);
        return deletedProduct;
    }catch (error) {
        console.log(error);
        return error;
    }
}

export const listStripeProducts = async () => {
    try {
        const products = await stripe.products.list();
        return products;
    }catch (error) {
        console.log(error);
        return error;
    }
}