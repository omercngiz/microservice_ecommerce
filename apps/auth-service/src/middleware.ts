import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. TypeScript'e Express'in Request nesnesine 'user' eklediğimizi söylüyoruz
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // 1. Frontend token'ı "Authorization" başlığında "Bearer <token>" formatında gönderir. Onu alıyoruz.
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Erişim reddedildi. Token bulunamadı veya format hatalı." });
  }

  // "Bearer " kısmını atıp sadece token'ı alıyoruz
  // 'Bearer ' ile başladığını zaten kontrol ettik, bu yüzden [1] kesinlikle mevcuttur
  const token = authHeader.split(' ')[1]!;

  try {
    // 2. Token'ı doğrula (Geçerlilik süresi dolmuş mu? Secret key doğru mu? Değiştirilmiş mi?)
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error('JWT_ACCESS_SECRET is not defined');
    const decoded = jwt.verify(token, secret) as unknown as { id: string, role: string };

    // 3. Doğrulanmış kullanıcı bilgilerini Request nesnesine ekle
    req.user = decoded;

    // 4. Her şey yolunda, bir sonraki aşamaya (Controller'a) geçmesine izin ver
    next();
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    return res.status(403).json({ error: "Geçersiz veya süresi dolmuş token." });
  }
};