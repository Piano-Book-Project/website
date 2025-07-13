import axios from 'axios';

// 환경별 API 기본 URL 설정
const getBaseURL = () => {
    // 1. 환경변수 우선
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    if (window.location.hostname.endsWith('github.io')) {
        // gh-pages 환경: 실제 백엔드 서버 주소로
        return 'https://your-backend-domain.com/api';
    }
    if (process.env.NODE_ENV === 'production') {
        // 프로덕션 환경에서는 실제 백엔드 서버 주소 사용
        return 'https://your-backend-domain.com/api';
    }
    // 개발 환경에서는 Vite 프록시 사용
    return '/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    // retry, retryDelay 옵션 제거 (axios 기본 옵션 아님)
});

// JWT 토큰 자동 첨부
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('API Request:', config.url, 'Token:', token ? 'exists' : 'none');
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// axios 에러 응답 UX 개선
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.data) {
            // code/message 구조면 message만 추출
            const { code, message } = error.response.data;
            if (message) {
                error.message = message;
            }
        }
        return Promise.reject(error);
    }
);

export default api; 