type Lang = "tr" | "en";

type PaymentSuccessData = {
    userEmail: string;
    firstName?: string;
    totalPrice?: number;
};

const content = {
    tr: {
        subject: "Ödemeniz Onaylandı ✅",
        greeting: (name?: string) => `Merhaba${name ? ` ${name}` : ""},`,
        body: "Ödemeniz başarıyla gerçekleşti. Siparişiniz en kısa sürede hazırlanacak.",
        totalLabel: "Ödenen Tutar",
        footer: "Teşekkür ederiz!",
    },
    en: {
        subject: "Payment Confirmed ✅",
        greeting: (name?: string) => `Hello${name ? ` ${name}` : ""},`,
        body: "Your payment was successful. Your order will be prepared shortly.",
        totalLabel: "Amount Paid",
        footer: "Thank you!",
    },
};

export const paymentSuccessTemplate = (lang: Lang = "tr", data: PaymentSuccessData) => {
    const t = content[lang];
    const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#16a34a;">${t.subject}</h2>
        <p>${t.greeting(data.firstName)}</p>
        <p>${t.body}</p>
        ${data.totalPrice != null ? `<p><strong>${t.totalLabel}:</strong> ₺${(data.totalPrice / 100).toFixed(2)}</p>` : ""}
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#666;font-size:13px;">${t.footer}</p>
    </div>`;
    return { subject: t.subject, html };
};
