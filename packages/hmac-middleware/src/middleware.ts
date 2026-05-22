import { createHmac, timingSafeEqual } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

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

/**
 * Verifies the HMAC signature on incoming requests from the API Gateway
 * or other internal services.
 * Expected headers: x-user-id, x-user-role, x-timestamp, x-internal-signature
 */
export const verifyHmac = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string | undefined;
  const role = req.headers['x-user-role'] as string | undefined;
  const timestamp = req.headers['x-timestamp'] as string | undefined;
  const signature = req.headers['x-internal-signature'] as string | undefined;

  if (!timestamp || !signature) {
    return res.status(401).json({ error: 'Eksik kimlik doğrulama başlıkları.' });
  }

  // Replay saldırısı önlemi: 5 dakikadan eski istekleri reddet
  const requestTime = parseInt(timestamp, 10);
  if (isNaN(requestTime) || Date.now() - requestTime > 5 * 60 * 1000) {
    return res.status(401).json({ error: 'İstek zaman damgası geçersiz veya süresi dolmuş.' });
  }

  const secret = process.env.HMAC_INTERNAL_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: 'Sunucu yapılandırma hatası.' });
  }

  const payload = `${userId ?? ''}:${role ?? ''}:${timestamp}`;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');

  let sigBuffer: Buffer;
  let expectedBuffer: Buffer;
  try {
    sigBuffer = Buffer.from(signature, 'hex');
    expectedBuffer = Buffer.from(expected, 'hex');
  } catch {
    return res.status(403).json({ error: 'Geçersiz imza formatı.' });
  }

  if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
    return res.status(403).json({ error: 'Geçersiz iç imza.' });
  }

  // Kullanıcı bilgisini request'e ekle
  if (userId) {
    req.user = { id: userId, role: role ?? '' };
  }

  next();
};