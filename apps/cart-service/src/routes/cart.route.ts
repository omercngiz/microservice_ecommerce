import { Router } from "express";
import { verifyHmac } from "@digitalocean/hmac-middleware";
import {
    getCartController,
    addItemController,
    updateItemController,
    removeItemController,
    clearCartController,
    checkoutController,
} from "../controllers/cart.controller.js";

const cartRouter: ReturnType<typeof Router> = Router();

cartRouter.get("/", verifyHmac, getCartController);
cartRouter.post("/items", verifyHmac, addItemController);
cartRouter.put("/items/:productId", verifyHmac, updateItemController);
cartRouter.delete("/items/:productId", verifyHmac, removeItemController);
cartRouter.delete("/", verifyHmac, clearCartController);
cartRouter.post("/checkout", verifyHmac, checkoutController);

export { cartRouter };
