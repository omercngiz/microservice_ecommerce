import type { Product } from "@digitalocean/product-db";

export type CartItemType = {
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

export type CartItemsType = CartItemType[];