import mongoose from "mongoose";

export enum OrderStatus {
    PENDING = 'pending',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    PAID = 'paid',
}

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    products: { type: [{ 
        name: String, 
        quantity: Number, 
        price: Number }], 
        required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
}, { timestamps: true });

export type OrderSchemaType = mongoose.InferSchemaType<typeof orderSchema>;
export const Order = mongoose.model<OrderSchemaType>('Order', orderSchema);
   