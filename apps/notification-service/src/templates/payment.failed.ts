type Lang = "tr" | "en";

type PaymentFailedData = {
    userEmail: string;
    firstName?: string;
};

const content = {
    tr: {
        subject: "Ödeme Başarısız ❌",
        greeting: (name?: string) => `Merhaba${name ? ` ${name}` : ""},`,
        body: "Ödemeniz gerçekleştirilemedi. Lütfen kart bilgilerinizi kontrol edip tekrar deneyin.",
        footer: "Sorun devam ederse müşteri hizmetlerimizle iletişime geçin.",
    },
    en: {
        subject: "Payment Failed ❌",
        greeting: (name?: string) => `Hello${name ? ` ${name}` : ""},`,
        body: "Your payment could not be processed. Please check your card details and try again.",
        footer: "If the issue persists, please contact our customer support.",
    },
};

export const paymentFailedTemplate = (lang: Lang = "tr", data: PaymentFailedData) => {
    const t = content[lang];
    const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#dc2626;">${t.subject}</h2>
        <p>${t.greeting(data.firstName)}</p>
        <p>${t.body}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#666;font-size:13px;">${t.footer}</p>
    </div>`;
    return { subject: t.subject, html };
};
