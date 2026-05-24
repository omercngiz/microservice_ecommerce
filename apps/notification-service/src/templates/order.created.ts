type Lang = "tr" | "en";

type OrderCreatedData = {
    userEmail: string;
    firstName?: string;
    orderId?: string;
    totalPrice?: number;
    products?: { name: string; quantity: number; price: number }[];
};

const content = {
    tr: {
        subject: "Siparişiniz Alındı 🎉",
        greeting: (name?: string) => `Merhaba${name ? ` ${name}` : ""},`,
        body: "Siparişiniz başarıyla alındı. Teşekkür ederiz!",
        orderIdLabel: "Sipariş No",
        totalLabel: "Toplam",
        footer: "Sorularınız için bize ulaşabilirsiniz.",
    },
    en: {
        subject: "Your Order Has Been Received 🎉",
        greeting: (name?: string) => `Hello${name ? ` ${name}` : ""},`,
        body: "Your order has been successfully placed. Thank you!",
        orderIdLabel: "Order ID",
        totalLabel: "Total",
        footer: "Feel free to contact us if you have any questions.",
    },
};

export const orderCreatedTemplate = (lang: Lang = "tr", data: OrderCreatedData) => {
    const t = content[lang];
    const productsHtml =
        data.products
            ?.map(
                (p) =>
                    `<tr>
                        <td style="padding:6px 0;">${p.name}</td>
                        <td style="padding:6px 0;text-align:center;">${p.quantity}</td>
                        <td style="padding:6px 0;text-align:right;">₺${(p.price / 100).toFixed(2)}</td>
                    </tr>`
            )
            .join("") ?? "";

    const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#1a1a1a;">${t.subject}</h2>
        <p>${t.greeting(data.firstName)}</p>
        <p>${t.body}</p>
        ${data.orderId ? `<p><strong>${t.orderIdLabel}:</strong> ${data.orderId}</p>` : ""}
        ${
            data.products && data.products.length > 0
                ? `<table style="width:100%;border-collapse:collapse;margin:16px 0;">
                    <thead>
                        <tr style="border-bottom:2px solid #eee;">
                            <th style="text-align:left;">Ürün</th>
                            <th style="text-align:center;">Adet</th>
                            <th style="text-align:right;">Fiyat</th>
                        </tr>
                    </thead>
                    <tbody>${productsHtml}</tbody>
                   </table>`
                : ""
        }
        ${data.totalPrice != null ? `<p><strong>${t.totalLabel}:</strong> ₺${(data.totalPrice / 100).toFixed(2)}</p>` : ""}
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#666;font-size:13px;">${t.footer}</p>
    </div>`;

    return { subject: t.subject, html };
};
