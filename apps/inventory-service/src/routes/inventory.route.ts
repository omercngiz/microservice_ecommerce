import { Router } from "express";
import { verifyHmac } from "@digitalocean/hmac-middleware";
import { getStock, setStock, reserve } from "../controllers/inventory.controller.js";

const inventoryRouter: ReturnType<typeof Router> = Router();

// Public — stok sorgula
inventoryRouter.get("/stock/:productId", getStock);

// HMAC korumalı (iç servisler + admin)
inventoryRouter.post("/stock", verifyHmac, setStock);
inventoryRouter.post("/reserve", verifyHmac, reserve);

export { inventoryRouter };
