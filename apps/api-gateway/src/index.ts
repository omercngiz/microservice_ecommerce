import Fastify from 'fastify';
import cors from '@fastify/cors';
import httpProxy from '@fastify/http-proxy';
import dotenv from 'dotenv';
import { createHmac } from 'crypto';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { customLogger } from '@digitalocean/logger';
import { verifyAuth } from './hooks/auth.hook.js';

dotenv.config();

const server = Fastify({ 
    logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        colorize: true
      }
    }
  } 
});

/**
 * API Gateway'den downstream servislere iletilen isteklere HMAC imzası ekler.
 * Kullanıcı bilgisi mevcutsa (JWT doğrulandıysa) HMAC payload'una eklenir.
 */
const signGatewayRequest = (req: { user?: { id: string; role: string } }): Record<string, string> => {
  const timestamp = Date.now().toString();
  const userId = req.user?.id ?? '';
  const role = req.user?.role ?? '';
  const secret = process.env.HMAC_INTERNAL_SECRET_KEY as string;

  const payload = `${userId}:${role}:${timestamp}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');

  return {
    'x-user-id': userId,
    'x-user-role': role,
    'x-timestamp': timestamp,
    'x-internal-signature': signature,
  };
};

// CORS Ayarları (Sadece Frontend'e izin veriyoruz)
server.register(cors, {
    origin: 'http://localhost:3001', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

// Auth servisi: /login, /register, /refresh public; /logout ve /me JWT gerektirir
server.register(httpProxy, {
    upstream: process.env.AUTH_SERVICE_URL as string,
    prefix: '/auth',
    preHandler: async (req: FastifyRequest, reply: FastifyReply) => {
        const url = req.url ?? '';
        if (url.includes('/logout') || url.includes('/me')) {
            await verifyAuth(req, reply);
        }
    },
    replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => ({
            ...headers,
            ...signGatewayRequest(originalReq),
        })
    }
});

// Ürün servisi: GET istekleri herkese açık, yazma işlemleri JWT gerektirir
server.register(httpProxy, {
    upstream: process.env.PRODUCT_SERVICE_URL as string,
    prefix: '/product',
    preHandler: async (req: FastifyRequest, reply: FastifyReply) => {
        if (req.method !== 'GET') {
            await verifyAuth(req, reply);
        }
    },
    replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => ({
            ...headers,
            ...signGatewayRequest(originalReq),
        })
    }
});

// Sipariş servisi: Tüm route'lar JWT gerektirir
server.register(httpProxy, {
    upstream: process.env.ORDER_SERVICE_URL as string,
    prefix: '/order',
    preHandler: verifyAuth,
    replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => ({
            ...headers,
            ...signGatewayRequest(originalReq),
        })
    }
});

// Ödeme servisi: Webhook'lar hariç JWT gerektirir
server.register(httpProxy, {
    upstream: process.env.PAYMENT_SERVICE_URL as string,
    prefix: '/payment',
    preHandler: async (req: FastifyRequest, reply: FastifyReply) => {
        const url = req.url ?? '';
        // Stripe webhook'ları JWT gerektirmez
        // Session durum sorgulama (GET /stripe/session/:id) JWT gerektirmez (ödeme dönüş sayfası için)
        // Diğer tüm işlemler (checkout session oluşturma dahil) JWT gerektirir
        const isWebhook = url.includes('/webhooks');
        const isSessionStatusGet = req.method === 'GET' && /\/session\/[^/]+$/.test(url);
        if (!isWebhook && !isSessionStatusGet) {
            await verifyAuth(req, reply);
        }
    },
    replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => ({
            ...headers,
            ...signGatewayRequest(originalReq),
        })
    }
});

// Sepet servisi: Tüm route'lar JWT gerektirir
server.register(httpProxy, {
    upstream: process.env.CART_SERVICE_URL as string,
    prefix: '/cart',
    preHandler: verifyAuth,
    replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => ({
            ...headers,
            ...signGatewayRequest(originalReq),
        })
    }
});

// Envanter servisi: GET stok sorgulama herkese açık, yazma işlemleri JWT gerektirir
server.register(httpProxy, {
    upstream: process.env.INVENTORY_SERVICE_URL as string,
    prefix: '/inventory',
    preHandler: async (req: FastifyRequest, reply: FastifyReply) => {
        if (req.method !== 'GET') {
            await verifyAuth(req, reply);
        }
    },
    replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => ({
            ...headers,
            ...signGatewayRequest(originalReq),
        })
    }
});

// Sunucuyu Ayağa Kaldır
const start = async () => {
    try {
        const port = Number(process.env.PORT);
        await server.listen({ port, host: '0.0.0.0' });
        customLogger.info(`🚀 API Gateway ${port} portunda güvenle çalışıyor...`);
    } catch (err) {
        customLogger.error(err);
        process.exit(1);
    }
};

start();
