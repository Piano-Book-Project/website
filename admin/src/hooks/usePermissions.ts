import { useAuth } from './useAuth';

// 권한 정의 (백엔드와 동일)
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

// 역할별 권한 매핑 (백엔드와 동일)
export const ROLE_PERMISSIONS = {
    super_admin: [
        // 모든 권한
        ...Object.values(PERMISSIONS)
    ],
    sysadmin: [
        // 슈퍼 관리자와 동일한 권한
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

export const usePermissions = () => {
    const { user } = useAuth();

    // 현재 사용자의 권한 목록 반환
    const getUserPermissions = (): string[] => {
        if (!user?.role) return [];
        return ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
    };

    // 특정 권한이 있는지 확인
    const hasPermission = (permission: string): boolean => {
        const permissions = getUserPermissions();
        return permissions.includes(permission);
    };

    // 여러 권한 중 하나라도 있는지 확인
    const hasAnyPermission = (permissions: string[]): boolean => {
        const userPermissions = getUserPermissions();
        return permissions.some(permission => userPermissions.includes(permission));
    };

    // 모든 권한이 있는지 확인
    const hasAllPermissions = (permissions: string[]): boolean => {
        const userPermissions = getUserPermissions();
        return permissions.every(permission => userPermissions.includes(permission));
    };

    // 특정 메뉴에 대한 권한 확인
    const canAccessMenu = (menuPath: string): boolean => {
        switch (menuPath) {
            case '/users':
                return hasPermission(PERMISSIONS.USERS_READ);
            case '/categories':
                return hasPermission(PERMISSIONS.CATEGORIES_READ);
            case '/posts':
                return hasPermission(PERMISSIONS.POSTS_READ);
            case '/inquiries':
                return hasPermission(PERMISSIONS.INQUIRIES_READ);
            case '/pricing':
                return hasPermission(PERMISSIONS.PRICING_READ);
            default:
                return false;
        }
    };

    // 특정 액션에 대한 권한 확인
    const canPerformAction = (action: string, resource: string): boolean => {
        const permission = `${resource}:${action}`;
        return hasPermission(permission);
    };

    return {
        user,
        getUserPermissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAccessMenu,
        canPerformAction,
        PERMISSIONS,
    };
}; 