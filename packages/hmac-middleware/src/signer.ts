import { createHmac } from 'crypto';

/**
 * Servis-servis arası iç çağrılar için HMAC imzalı header'lar üretir.
 * API Gateway olmadan doğrudan servislere çağrı yapılırken kullanılır.
 */
export const signInternalRequest = (userId?: string, role?: string): Record<string, string> => {
  const secret = process.env.HMAC_INTERNAL_SECRET_KEY;
  if (!secret) {
    throw new Error('HMAC_INTERNAL_SECRET_KEY ortam değişkeni tanımlı değil.');
  }

  const timestamp = Date.now().toString();
  const payload = `${userId ?? ''}:${role ?? ''}:${timestamp}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');

  return {
    'x-user-id': userId ?? '',
    'x-user-role': role ?? '',
    'x-timestamp': timestamp,
    'x-internal-signature': signature,
  };
};
