type Lang = "tr" | "en";

type AuthRegisterData = {
    userEmail: string;
    firstName?: string;
};

const content = {
    tr: {
        subject: "Hoş Geldiniz! 👋",
        greeting: (name?: string) => `Merhaba${name ? ` ${name}` : ""},`,
        body: "Hesabınız başarıyla oluşturuldu. Sizi aramızda görmekten mutluluk duyuyoruz!",
        footer: "Herhangi bir sorunuz olursa bize ulaşmaktan çekinmeyin.",
    },
    en: {
        subject: "Welcome! 👋",
        greeting: (name?: string) => `Hello${name ? ` ${name}` : ""},`,
        body: "Your account has been successfully created. We are happy to have you!",
        footer: "Don't hesitate to reach out if you have any questions.",
    },
};

export const authRegisterTemplate = (lang: Lang = "tr", data: AuthRegisterData) => {
    const t = content[lang];
    const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#1a1a1a;">${t.subject}</h2>
        <p>${t.greeting(data.firstName)}</p>
        <p>${t.body}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#666;font-size:13px;">${t.footer}</p>
    </div>`;
    return { subject: t.subject, html };
};
