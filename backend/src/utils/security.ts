import { NextApiRequest, NextApiResponse } from 'next';

// Rate Limiting 구현
const requests = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15분
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export const rateLimitMiddleware = (req: NextApiRequest, res: NextApiResponse) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const requestData = requests.get(ip as string);

    if (requestData && now < requestData.resetTime) {
        if (requestData.count >= MAX_REQUESTS) {
            return res.status(429).json({
                error: 'Too many requests from this IP, please try again later.',
            });
        }
        requestData.count++;
    } else {
        requests.set(ip as string, {
            count: 1,
            resetTime: now + WINDOW_MS
        });
    }

    // 오래된 기록 정리
    requests.forEach((value, key) => {
        if (now > value.resetTime) {
            requests.delete(key);
        }
    });
};

// CORS 설정
export const corsMiddleware = (req: NextApiRequest, res: NextApiResponse) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
        'http://localhost:5173',
        'https://piano-book-project.github.io'
    ];

    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
};

// 보안 헤더 설정
export const securityHeaders = (req: NextApiRequest, res: NextApiResponse) => {
    // 기본 보안 헤더
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // 캐시 제어
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // HSTS (HTTPS 강제)
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
};

// 봇 차단
export const blockBots = (req: NextApiRequest, res: NextApiResponse) => {
    const userAgent = req.headers['user-agent'] || '';
    const botPatterns = [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /curl/i,
        /wget/i,
        /python/i,
        /java/i,
        /perl/i,
        /ruby/i,
    ];

    if (botPatterns.some(pattern => pattern.test(userAgent))) {
        return res.status(403).json({ error: 'Access denied' });
    }
};

// 관리자 전용 접근 제어
export const adminOnly = (req: NextApiRequest, res: NextApiResponse) => {
    const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (process.env.NODE_ENV === 'production' && allowedIPs.length > 0) {
        if (!allowedIPs.includes(clientIP as string)) {
            return res.status(403).json({ error: 'Access denied' });
        }
    }
};

// 요청 로깅
export const requestLogger = (req: NextApiRequest, res: NextApiResponse, next?: () => void) => {
    const start = Date.now();
    const { method, url } = req;
    const userAgent = req.headers['user-agent'] || '';
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(`[${new Date().toISOString()}] ${method} ${url} - IP: ${clientIP} - UA: ${userAgent}`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
    });

    if (next) next();
};

// 에러 핸들링
export const errorHandler = (err: any, req: NextApiRequest, res: NextApiResponse) => {
    console.error('Error:', err);

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Request entity too large' });
    }

    res.status(500).json({ error: 'Internal server error' });
};

// 미들웨어 조합
export const applySecurityMiddleware = (handler: any) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            // CORS 처리
            corsMiddleware(req, res);

            // Rate Limiting
            rateLimitMiddleware(req, res);

            // 보안 헤더 적용
            securityHeaders(req, res);

            // 봇 차단
            blockBots(req, res);

            // 관리자 전용 접근 제어
            adminOnly(req, res);

            // 요청 로깅
            requestLogger(req, res);

            // 원본 핸들러 실행
            return await handler(req, res);
        } catch (error) {
            errorHandler(error, req, res);
        }
    };
}; 