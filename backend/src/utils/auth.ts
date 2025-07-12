import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 권한 정의
export const PERMISSIONS = {
    // 사용자 관리
    USERS_READ: 'users:read',
    USERS_WRITE: 'users:write',
    USERS_UPDATE: 'users:update',
    USERS_DELETE: 'users:delete',

    // 카테고리 관리
    CATEGORIES_READ: 'categories:read',
    CATEGORIES_WRITE: 'categories:write',
    CATEGORIES_UPDATE: 'categories:update',
    CATEGORIES_DELETE: 'categories:delete',

    // 게시물 관리
    POSTS_READ: 'posts:read',
    POSTS_WRITE: 'posts:write',
    POSTS_UPDATE: 'posts:update',
    POSTS_DELETE: 'posts:delete',

    // 문의 관리
    INQUIRIES_READ: 'inquiries:read',
    INQUIRIES_WRITE: 'inquiries:write',
    INQUIRIES_UPDATE: 'inquiries:update',
    INQUIRIES_DELETE: 'inquiries:delete',

    // 요금제 관리
    PRICING_READ: 'pricing:read',
    PRICING_WRITE: 'pricing:write',
    PRICING_UPDATE: 'pricing:update',
    PRICING_DELETE: 'pricing:delete',
};

// 역할별 권한 매핑
export const ROLE_PERMISSIONS = {
    super_admin: [
        // 모든 권한
        ...Object.values(PERMISSIONS)
    ],
    admin: [
        // 게시물 관리 - 조회, 글쓰기
        PERMISSIONS.POSTS_READ,
        PERMISSIONS.POSTS_WRITE,
        // 문의 관리 - 조회
        PERMISSIONS.INQUIRIES_READ,
    ],
    moderator: [
        // 기본 조회 권한만
        PERMISSIONS.POSTS_READ,
        PERMISSIONS.CATEGORIES_READ,
    ],
};

// JWT 토큰에서 사용자 정보 추출
export const getUserFromToken = (req: NextApiRequest) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        return decoded;
    } catch (error) {
        return null;
    }
};

// 권한 체크 미들웨어
export const requireAuth = (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const user = getUserFromToken(req);

        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // 사용자 정보를 요청 객체에 추가
        (req as any).user = user;

        return handler(req, res);
    };
};

// 특정 권한이 필요한 미들웨어
export const requirePermission = (permission: string) => {
    return (handler: Function) => {
        return async (req: NextApiRequest, res: NextApiResponse) => {
            const user = getUserFromToken(req);

            if (!user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            // 사용자 정보를 요청 객체에 추가
            (req as any).user = user;

            // 권한 체크
            const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

            if (!userPermissions.includes(permission)) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            return handler(req, res);
        };
    };
};

// 여러 권한 중 하나라도 있으면 허용하는 미들웨어
export const requireAnyPermission = (permissions: string[]) => {
    return (handler: Function) => {
        return async (req: NextApiRequest, res: NextApiResponse) => {
            const user = getUserFromToken(req);

            if (!user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            // 사용자 정보를 요청 객체에 추가
            (req as any).user = user;

            // 권한 체크
            const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

            const hasPermission = permissions.some(permission =>
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            return handler(req, res);
        };
    };
};

// 모든 권한이 있어야 하는 미들웨어
export const requireAllPermissions = (permissions: string[]) => {
    return (handler: Function) => {
        return async (req: NextApiRequest, res: NextApiResponse) => {
            const user = getUserFromToken(req);

            if (!user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            // 사용자 정보를 요청 객체에 추가
            (req as any).user = user;

            // 권한 체크
            const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

            const hasAllPermissions = permissions.every(permission =>
                userPermissions.includes(permission)
            );

            if (!hasAllPermissions) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            return handler(req, res);
        };
    };
};

// 현재 사용자의 권한 목록 반환
export const getUserPermissions = (role: string): string[] => {
    return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
};

// 권한 확인 헬퍼 함수
export const hasPermission = (role: string, permission: string): boolean => {
    const permissions = getUserPermissions(role);
    return permissions.includes(permission);
}; 