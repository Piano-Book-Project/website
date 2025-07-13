/** @type {import('next').NextConfig} */
const nextConfig = {
    // 프로덕션 최적화
    poweredByHeader: false,
    compress: true,
    generateEtags: false,

    // 보안 헤더
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ];
    },

    // 환경 변수
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },

    // 이미지 최적화
    images: {
        domains: [],
        formats: ['image/webp', 'image/avif'],
    },

    // 실험적 기능
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    },

    // 웹팩 설정
    webpack: (config, { dev, isServer }) => {
        // 프로덕션 최적화
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            };
        }

        return config;
    },
};

module.exports = nextConfig; 