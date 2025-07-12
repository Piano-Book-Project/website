import { useCallback, useEffect, useState, useMemo } from 'react';
import api from '../utils/api';

const TOKEN_KEY = 'token';

export function useAuth() {
    const getToken = useCallback(() => localStorage.getItem(TOKEN_KEY), []);
    const [token, setToken] = useState(() => getToken());
    const [user, setUser] = useState<{ id: string; username: string; nickname: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = useMemo(() => !!token, [token]);

    const login = useCallback((token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        setToken(token);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    // checkAuth는 loading을 직접 관리하지 않음
    const checkAuth = useCallback(async () => {
        try {
            console.log('checkAuth: calling /api/auth/me with token:', token ? 'exists' : 'none');
            const { data } = await api.get('/auth/me');
            setUser(data);
            console.log('checkAuth: success', data);
            return true;
        } catch (err) {
            console.error('checkAuth: failed', err);
            logout();
            return false;
        }
    }, [logout, token]);

    useEffect(() => {
        let ignore = false;
        if (!token) {
            setLoading(false);
            setUser(null);
            return;
        }
        setLoading(true);
        (async () => {
            await checkAuth();
            if (!ignore) setLoading(false);
        })();
        return () => { ignore = true; };
    }, [token]);

    return { getToken, login, logout, isAuthenticated, checkAuth, user, loading };
} 