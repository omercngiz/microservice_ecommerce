type Lang = "tr" | "en";

type OrderShippedData = {
    userEmail: string;
    firstName?: string;
    trackingNumber?: string;
    carrier?: string;
};

const content = {
    tr: {
        subject: "Siparişiniz Kargoya Verildi 🚚",
        greeting: (name?: string) => `Merhaba${name ? ` ${name}` : ""},`,
        body: "Siparişiniz kargoya verildi ve yolda!",
        trackingLabel: "Takip No",
        carrierLabel: "Kargo Firması",
        footer: "Kargo takibinizi yapabilirsiniz.",
    },
    en: {
        subject: "Your Order Has Been Shipped 🚚",
        greeting: (name?: string) => `Hello${name ? ` ${name}` : ""},`,
        body: "Your order has been shipped and is on its way!",
        trackingLabel: "Tracking Number",
        carrierLabel: "Carrier",
        footer: "You can track your shipment online.",
    },
};

export const orderShippedTemplate = (lang: Lang = "tr", data: OrderShippedData) => {
    const t = content[lang];
    const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#1a1a1a;">${t.subject}</h2>
        <p>${t.greeting(data.firstName)}</p>
        <p>${t.body}</p>
        ${data.carrier ? `<p><strong>${t.carrierLabel}:</strong> ${data.carrier}</p>` : ""}
        ${data.trackingNumber ? `<p><strong>${t.trackingLabel}:</strong> ${data.trackingNumber}</p>` : ""}
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#666;font-size:13px;">${t.footer}</p>
    </div>`;
    return { subject: t.subject, html };
};
