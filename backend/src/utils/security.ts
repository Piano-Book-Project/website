import { NextApiRequest, NextApiResponse } from 'next';

// 보안 헤더 설정 미들웨어
export const securityHeaders = (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // 기본 보안 헤더 설정
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        // Content Security Policy 설정
        res.setHeader(
            'Content-Security-Policy',
            [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "font-src 'self' https://fonts.gstatic.com",
                "img-src 'self' data: https:",
                "connect-src 'self'",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'"
            ].join('; ')
        );

        // HSTS 헤더 (HTTPS 환경에서만)
        if (process.env.NODE_ENV === 'production') {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // 캐시 제어 (관리자 페이지는 캐시하지 않음)
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');

        return handler(req, res);
    };
};

// API 요청 제한 미들웨어
export const rateLimit = (handler: Function) => {
    const requests = new Map<string, { count: number; resetTime: number }>();
    const WINDOW_MS = 15 * 60 * 1000; // 15분
    const MAX_REQUESTS = 100; // 15분당 최대 100회

    return async (req: NextApiRequest, res: NextApiResponse) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const now = Date.now();

        // 기존 요청 기록 확인
        const requestData = requests.get(ip as string);

        if (requestData && now < requestData.resetTime) {
            if (requestData.count >= MAX_REQUESTS) {
                return res.status(429).json({
                    error: 'Too many requests',
                    message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
                });
            }
            requestData.count++;
        } else {
            // 새로운 윈도우 시작
            requests.set(ip as string, {
                count: 1,
                resetTime: now + WINDOW_MS
            });
        }

        // 오래된 기록 정리
        for (const [key, value] of requests.entries()) {
            if (now > value.resetTime) {
                requests.delete(key);
            }
        }

        return handler(req, res);
    };
};

// 관리자 페이지 접근 제한 미들웨어
export const adminOnly = (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // User-Agent 체크 (봇 차단)
        const userAgent = req.headers['user-agent'] || '';
        const botPatterns = [
            /bot/i, /crawler/i, /spider/i, /scraper/i, /crawling/i,
            /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
            /baiduspider/i, /yandexbot/i, /facebookexternalhit/i,
            /twitterbot/i, /rogerbot/i, /linkedinbot/i, /embedly/i,
            /quora link preview/i, /showyoubot/i, /outbrain/i,
            /pinterest/i, /slackbot/i, /vkShare/i, /W3C_Validator/i
        ];

        const isBot = botPatterns.some(pattern => pattern.test(userAgent));
        if (isBot) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // 특정 경로에 대한 추가 보안 체크
        const path = req.url || '';
        if (path.includes('/admin') || path.includes('/api/admin')) {
            // 추가 보안 검증 로직
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'Authentication required' });
            }
        }

        return handler(req, res);
    };
};

// CORS 설정
export const corsMiddleware = (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // CORS 헤더 설정
        res.setHeader('Access-Control-Allow-Origin', process.env.ADMIN_URL || 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // OPTIONS 요청 처리
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        return handler(req, res);
    };
}; 