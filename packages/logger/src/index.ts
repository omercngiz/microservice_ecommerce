import pino from 'pino';

// Ortama göre varsayılan log seviyesini belirliyoruz.
// .env dosyasında LOG_LEVEL belirtilmişse öncelik her zaman onundur.
const defaultLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const transport =
    process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
        : undefined;


export const customLogger = pino({
    level: process.env.LOG_LEVEL || defaultLevel,
    base: {
        env: process.env.NODE_ENV || 'development',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
        paths: ['password', 'token', 'accessToken', 'refreshToken', '*.authorization'],
        censor: '[REDACTED]',
    },
    serializers: {
        req: (req) => ({ method: req.method, url: req.url, id: req.id }),
        res: (res) => ({ statusCode: res.statusCode }),
        err: pino.stdSerializers.err
    },
    transport
});

interface LogContext {
  correlationId: string;
  serviceName: string;
  userId?: string;
  traceId?: string;
  [key: string]: unknown; // ek alanlar için esnek
}

/**
 * Mikroservislerde istekleri (requests) takip edebilmek için "Child Logger" oluşturur.
 * Tüm loglara otomatik olarak o isteğe ait bir kimlik (correlationId) ekler.
 * @param ctx Log bağlamı (context) bilgilerini içeren nesne
 */
export const getContextLogger = (ctx: LogContext) => {
    return customLogger.child(ctx);
};