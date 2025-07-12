// 프론트엔드 보안 헬퍼 함수들

// XSS 방지를 위한 텍스트 정제
export const sanitizeText = (text: string): string => {
    if (typeof text !== 'string') return '';

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// URL 검증
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// 입력값 검증
export const validateInput = (input: string, type: 'email' | 'username' | 'password' | 'nickname'): boolean => {
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        username: /^[a-zA-Z0-9_]{3,20}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        nickname: /^[가-힣a-zA-Z0-9\s]{2,10}$/,
    };

    return patterns[type].test(input);
};

// 민감한 정보 마스킹
export const maskSensitiveData = (data: string, type: 'email' | 'phone' | 'username'): string => {
    switch (type) {
        case 'email':
            const [local, domain] = data.split('@');
            return `${local.substring(0, 2)}***@${domain}`;
        case 'phone':
            return data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        case 'username':
            return data.length > 2 ? `${data.substring(0, 2)}***` : '***';
        default:
            return data;
    }
};

// 세션 타임아웃 체크
export const checkSessionTimeout = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch {
        return true;
    }
};

// 자동 로그아웃 설정
export const setupAutoLogout = (timeoutMinutes: number = 30) => {
    const timeoutMs = timeoutMinutes * 60 * 1000;

    let logoutTimer: NodeJS.Timeout;

    const resetTimer = () => {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }, timeoutMs);
    };

    // 사용자 활동 감지
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, resetTimer, true);
    });

    // 초기 타이머 시작
    resetTimer();

    return () => {
        clearTimeout(logoutTimer);
        events.forEach(event => {
            document.removeEventListener(event, resetTimer, true);
        });
    };
};

// 개발자 도구 감지
export const detectDevTools = (): void => {
    const devtools = {
        open: false,
        orientation: null as string | null,
    };

    const threshold = 160;

    const emitEvent = (isOpen: boolean, orientation?: string) => {
        window.dispatchEvent(new CustomEvent('devtoolschange', {
            detail: {
                isOpen,
                orientation,
            },
        }));
    };

    setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';

        if (
            !(heightThreshold && widthThreshold) &&
            ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
        ) {
            if ((!devtools.open) || devtools.orientation !== orientation) {
                emitEvent(true, orientation);
            }

            devtools.open = true;
            devtools.orientation = orientation;
        } else {
            if (devtools.open) {
                emitEvent(false, undefined);
            }

            devtools.open = false;
            devtools.orientation = null;
        }
    }, 500);

    // 개발자 도구 감지 시 경고
    window.addEventListener('devtoolschange', (e: any) => {
        if (e.detail.isOpen) {
            console.warn('개발자 도구가 감지되었습니다. 보안상 권장하지 않습니다.');
        }
    });
};

// 클립보드 보안
export const secureCopyToClipboard = async (text: string): Promise<boolean> => {
    try {
        // 민감한 정보가 포함된 경우 경고
        const sensitivePatterns = [
            /password/i,
            /token/i,
            /secret/i,
            /key/i,
            /api[_-]?key/i,
        ];

        const isSensitive = sensitivePatterns.some(pattern => pattern.test(text));

        if (isSensitive) {
            const confirmed = confirm('민감한 정보를 클립보드에 복사하시겠습니까?');
            if (!confirmed) return false;
        }

        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('클립보드 복사 실패:', error);
        return false;
    }
};

// 페이지 가시성 변경 감지
export const setupVisibilityChangeHandler = () => {
    const handleVisibilityChange = () => {
        if (document.hidden) {
            // 페이지가 숨겨졌을 때 (탭 변경, 최소화 등)
            console.log('페이지가 숨겨졌습니다.');
        } else {
            // 페이지가 다시 보일 때
            console.log('페이지가 다시 보입니다.');

            // 세션 타임아웃 체크
            if (checkSessionTimeout()) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}; 