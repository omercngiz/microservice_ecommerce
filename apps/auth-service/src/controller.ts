import type { Request, Response } from 'express';
import { registerSchema } from './schemas';
import * as argon2 from 'argon2';
import { prisma } from '@digitalocean/auth-db'; 
import jwt from 'jsonwebtoken';
import { loginSchema } from './schemas';

export const registerController = async (req: Request, res: Response) => {
  try {
    // 1. Gelen veriyi Zod ile doğrula
    const parsedData = registerSchema.safeParse(req.body);
    
    if (!parsedData.success) {
      // Veri hatalıysa direkt frontend'e hata dön
      return res.status(400).json({ 
        errors: parsedData.error.format() 
      });
    }

    const { firstName, lastName, email, password, phone, role } = parsedData.data;

    // 2. Veritabanında bu kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: "Bu e-posta adresi zaten kullanılıyor." });
    }

    // 3. Şifreyi Hash'le (Asla düz metin kaydetme!)
    const hashedPassword = await argon2.hash(password);

    // 4. Veritabanına yeni kullanıcıyı kaydet
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        phone,
        role
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true
      }
    });

    return res.status(201).json({ 
      message: "Kullanıcı başarıyla oluşturuldu.",
      user: newUser 
    });

  } catch (error) {
    console.error("Kayıt hatası:", error);
    return res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    // 1. Gelen veriyi doğrula
    const parsedData = loginSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.format() });
    }

    const { email, password } = parsedData.data;

    // 2. Kullanıcıyı veritabanında bul
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: "E-posta veya şifre hatalı." });
    }

    // 3. Şifreyi doğrula
    const isPasswordValid = await argon2.verify(user.passwordHash!, password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "E-posta veya şifre hatalı." });
    }

    // 4. Token'ları üret (İçine sadece user id'sini ve rolünü koyuyoruz, şifre asla konmaz!)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' } // 15 dakika geçerli
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' } // 7 gün geçerli
    );

    // 5. Refresh Token'ı güvenli (HttpOnly) Cookie olarak gönder
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // CSRF koruması
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
    });

    // 6. Access Token'ı ve kullanıcı bilgilerini JSON olarak dön
    return res.status(200).json({
      message: "Giriş başarılı.",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login hatası:", error);
    return res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    // 1. Tarayıcıdan/İstemciden gelen Cookie'ler arasından refreshToken'ı bul
    // (Bunu yapabilmemiz için cookie-parser'ı daha önce eklemiştik)
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token bulunamadı. Lütfen tekrar giriş yapın." });
    }

    // 2. Refresh Token'ı doğrula
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    } catch (err) {
      return res.status(403).json({ error: "Geçersiz veya süresi dolmuş refresh token. Lütfen tekrar giriş yapın." });
    }

    // 3. Güvenlik Kontrolü: Bu kullanıcı hala veritabanında var mı? (Belki hesabı silindi veya banlandı)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    // 4. Kullanıcı geçerli. Yeni bir Access Token üret!
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' }
    );

    // 5. Yeni token'ı ve kullanıcı bilgilerini frontend'e teslim et
    return res.status(200).json({ 
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Refresh token hatası:", error);
    return res.status(500).json({ error: "Sunucu hatası." });
  }
};

export const logoutController = (req: Request, res: Response) => {
  // res.clearCookie ile çerezi siliyoruz. 
  // ÖNEMLİ: Çerezi silerken, oluştururken kullandığımız güvenlik parametrelerinin aynısını vermeliyiz.
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return res.status(200).json({ message: "Başarıyla çıkış yapıldı." });
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    // req.user, az önce yazdığımız middleware'den geliyor!
    const userId = req.user?.id;

    // Kullanıcının güncel bilgilerini veritabanından çekiyoruz (Şifreyi hariç tutarak)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("GetMe hatası:", error);
    return res.status(500).json({ error: "Sunucu hatası." });
  }
};