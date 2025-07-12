import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5173/api', // 명시적으로 프론트엔드 서버 주소 사용
    headers: {
        'Content-Type': 'application/json',
    },
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

// 에러 핸들링 (필요시 확장)
api.interceptors.response.use(
    (res) => {
        console.log('API Response:', res.config.url, res.status, res.data);
        return res;
    },
    (err) => {
        console.error('API Error:', err.config?.url, err.response?.status, err.response?.data);
        // 401 등 처리
        return Promise.reject(err);
    }
);

export default api; 