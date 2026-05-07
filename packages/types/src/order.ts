import { OrderSchemaType } from "@digitalocean/order-db";

export type OrderType = OrderSchemaType & {
    _id: string;
};