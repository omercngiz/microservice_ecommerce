import Fastify from 'fastify';
import cors from '@fastify/cors';
import httpProxy from '@fastify/http-proxy';
import dotenv from 'dotenv';

dotenv.config();

const server = Fastify({ logger: true });

// 2. CORS Ayarları (Sadece Frontend'e izin veriyoruz)
server.register(cors, {
    origin: 'http://localhost:3001', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

server.register(httpProxy, {
    upstream: process.env.AUTH_SERVICE_URL as string,
    prefix: '/auth',
    replyOptions: {
        // Bu kısım arkadaki servisten gelen hataları olduğu gibi frontend'e iletir
        rewriteRequestHeaders: (originalReq, headers) => headers
  }
});

server.register(httpProxy, {
    upstream: process.env.PRODUCT_SERVICE_URL as string,
    prefix: '/product',
    replyOptions: {
    rewriteRequestHeaders: (originalReq, headers) => headers,
  }
});

server.register(httpProxy, {
    upstream: process.env.ORDER_SERVICE_URL as string,
    prefix: '/order',
    replyOptions: {
    rewriteRequestHeaders: (originalReq, headers) => headers,
  }
});

server.register(httpProxy, {
    upstream: process.env.PAYMENT_SERVICE_URL as string,
    prefix: '/payment',
    replyOptions: {
    rewriteRequestHeaders: (originalReq, headers) => headers,
  }
});


// 4. Sunucuyu Ayağa Kaldır
const start = async () => {
    try {
        const port = Number(process.env.PORT) || 8080;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 API Gateway ${port} portunda güvenle çalışıyor...`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();