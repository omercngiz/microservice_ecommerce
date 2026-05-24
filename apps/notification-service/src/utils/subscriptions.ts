import { consumer } from "./kafka.js";
import { sendMail } from "./mailer.js";
import { orderCreatedTemplate } from "../templates/order.created.js";
import { paymentSuccessTemplate } from "../templates/payment.success.js";
import { paymentFailedTemplate } from "../templates/payment.failed.js";
import { orderShippedTemplate } from "../templates/order.shipped.js";
import { authRegisterTemplate } from "../templates/auth.register.js";
import { customLogger } from "@digitalocean/logger";

type Lang = "tr" | "en";

const DEFAULT_LANG: Lang = (process.env.DEFAULT_LANG as Lang) ?? "tr";

export const runKafkaSubscriptions = async () => {
    // Sipariş oluşturuldu
    consumer.subscribe("order.created", async (message: {
        value: {
            userEmail?: string;
            firstName?: string;
            orderId?: string;
            totalPrice?: number;
            products?: { name: string; quantity: number; price: number }[];
            lang?: Lang;
        };
    }) => {
        const { userEmail, lang = DEFAULT_LANG, ...rest } = message.value;
        if (!userEmail) return;
        try {
            const { subject, html } = orderCreatedTemplate(lang, { userEmail, ...rest });
            await sendMail({ to: userEmail, subject, html });
            customLogger.info({ userEmail }, "Notification: order.created mail sent");
        } catch (err) {
            customLogger.error({ err, userEmail }, "Notification: failed to send order.created mail");
        }
    });

    // Ödeme başarılı
    consumer.subscribe("payment.successful", async (message: {
        value: {
            userEmail?: string;
            firstName?: string;
            totalPrice?: number;
            lang?: Lang;
        };
    }) => {
        const { userEmail, lang = DEFAULT_LANG, ...rest } = message.value;
        if (!userEmail) return;
        try {
            const { subject, html } = paymentSuccessTemplate(lang, { userEmail, ...rest });
            await sendMail({ to: userEmail, subject, html });
            customLogger.info({ userEmail }, "Notification: payment.successful mail sent");
        } catch (err) {
            customLogger.error({ err, userEmail }, "Notification: failed to send payment.successful mail");
        }
    });

    // Ödeme başarısız
    consumer.subscribe("payment.failed", async (message: {
        value: {
            userEmail?: string;
            firstName?: string;
            lang?: Lang;
        };
    }) => {
        const { userEmail, lang = DEFAULT_LANG, ...rest } = message.value;
        if (!userEmail) return;
        try {
            const { subject, html } = paymentFailedTemplate(lang, { userEmail, ...rest });
            await sendMail({ to: userEmail, subject, html });
            customLogger.info({ userEmail }, "Notification: payment.failed mail sent");
        } catch (err) {
            customLogger.error({ err, userEmail }, "Notification: failed to send payment.failed mail");
        }
    });

    // Kargo bildirimi
    consumer.subscribe("order.shipped", async (message: {
        value: {
            userEmail?: string;
            firstName?: string;
            trackingNumber?: string;
            carrier?: string;
            lang?: Lang;
        };
    }) => {
        const { userEmail, lang = DEFAULT_LANG, ...rest } = message.value;
        if (!userEmail) return;
        try {
            const { subject, html } = orderShippedTemplate(lang, { userEmail, ...rest });
            await sendMail({ to: userEmail, subject, html });
            customLogger.info({ userEmail }, "Notification: order.shipped mail sent");
        } catch (err) {
            customLogger.error({ err, userEmail }, "Notification: failed to send order.shipped mail");
        }
    });

    // Hoşgeldin maili
    consumer.subscribe("auth.register", async (message: {
        value: {
            userEmail?: string;
            firstName?: string;
            lang?: Lang;
        };
    }) => {
        const { userEmail, lang = DEFAULT_LANG, ...rest } = message.value;
        if (!userEmail) return;
        try {
            const { subject, html } = authRegisterTemplate(lang, { userEmail, ...rest });
            await sendMail({ to: userEmail, subject, html });
            customLogger.info({ userEmail }, "Notification: auth.register mail sent");
        } catch (err) {
            customLogger.error({ err, userEmail }, "Notification: failed to send auth.register mail");
        }
    });

    await consumer.run();
};
