import { z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır."),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
  phone: z.string().optional().refine((val) => {
    if (!val) return true; // Telefon numarası opsiyonel, boş olabilir
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 formatında telefon numarası doğrulaması
    return phoneRegex.test(val);
  }, "Geçerli bir telefon numarası giriniz (örneğin: +905555555555)."),
  role: z.enum(['CUSTOMER', 'ADMIN']).default('CUSTOMER')
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(1, "Şifre alanı boş bırakılamaz.")
});