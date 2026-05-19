import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Erişim reddedildi. Token bulunamadı veya format hatalı." });
  }

  const token = authHeader.split(' ')[1]!;

  try {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error('JWT_ACCESS_SECRET is not defined');
    const decoded = jwt.verify(token, secret) as unknown as { id: string, role: string };

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    return res.status(403).json({ error: "Geçersiz veya süresi dolmuş token." });
  }
};