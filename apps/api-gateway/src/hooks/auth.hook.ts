import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export const verifyAuth = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Yetkisiz erişim. Token bulunamadı.' });
    }

    const token = authHeader.split(' ')[1];

    // Token'ı kendi .env dosyasındaki ortak sır ile çözüyoruz
    const decoded = jwt.verify(
      token!, 
      process.env.JWT_ACCESS_SECRET as string
    ) as unknown as { id: string, role: string };

    // Başarılıysa, bilgiyi Request nesnesine yapıştırıyoruz ki proxy aşamasında okuyabilelim
    req.user = decoded;

  } catch (error) {
    // Fastify logger'ı ile yakalayalım
    req.log.warn('Geçersiz token denemesi');
    return reply.code(403).send({ error: 'Geçersiz veya süresi dolmuş token.' });
  }
};