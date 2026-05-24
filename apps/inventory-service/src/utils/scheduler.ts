import { expireStaleReservations } from "../controllers/inventory.controller.js";
import { customLogger } from "@digitalocean/logger";

// Her 60 saniyede süresi dolmuş rezervasyonları temizle
export const startReservationScheduler = () => {
    setInterval(async () => {
        try {
            await expireStaleReservations();
        } catch (err) {
            customLogger.error({ err }, "Scheduler: failed to expire reservations");
        }
    }, 60_000);

    customLogger.info("Reservation scheduler started (60s interval)");
};
