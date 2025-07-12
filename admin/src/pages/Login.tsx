// 로그인 페이지 컴포넌트 (MUI 기반)
import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Alert,
    Avatar,
    InputAdornment,
    IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// 색상 리터치: 더 부드럽고 현대적인 톤으로 조정
const PRIMARY_BLUE = '#60a5fa'; // 더 밝고 부드러운 블루
const BG_DARK = '#181a20'; // 약간 더 중성적인 다크
const CARD_BG = '#23272f'; // 카드 배경을 더 중성적으로
const CARD_BORDER = '#334155'; // 카드 테두리 색상 추가
const INFO_BG = '#23242a';
const INFO_TEXT = '#e0e7ef'; // 텍스트를 약간 더 밝게
const CARD_TEXT = '#f1f5fa'; // 카드 내 텍스트도 밝게

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                // 영어 에러 메시지를 한글로 매핑
                let msg = data.error || '로그인 실패';
                if (msg === 'Invalid credentials') msg = '아이디 또는 비밀번호가 올바르지 않습니다.';
                if (msg === 'Username and password are required') msg = '아이디와 비밀번호를 모두 입력해 주세요.';
                if (msg === 'Method not allowed') msg = '허용되지 않은 요청입니다.';
                throw new Error(msg);
            }
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                bgcolor: BG_DARK,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    p: 6,
                    minWidth: 360,
                    maxWidth: 420,
                    borderRadius: 4,
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: CARD_BG,
                    border: `2.5px solid ${CARD_BORDER}`,
                    color: CARD_TEXT,
                }}
            >
                <img
                    src="https://ssl.pstatic.net/static/nng/glive/resource/p/static/media/logo_light.530b4d8f04d5671f2465.gif"
                    alt="Logo"
                    style={{ width: 120, height: 'auto', marginBottom: 18, objectFit: 'contain', display: 'block' }}
                />
                <Typography variant="h5" fontWeight={700} mb={3} color={PRIMARY_BLUE} sx={{ textAlign: 'center', width: '100%', textShadow: '0 2px 8px #1e293b55' }}>
                    피아노츄는 김츄츄
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="Email"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        autoFocus
                        required
                        autoComplete="username"
                        InputProps={{
                            style: { fontSize: 18, color: CARD_TEXT },
                            sx: {
                                '& .MuiInputBase-input': { color: CARD_TEXT },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: CARD_BORDER },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_BLUE },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_BLUE },
                            },
                        }}
                        InputLabelProps={{ style: { color: '#b6c2e1' } }}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        autoComplete="current-password"
                        InputProps={{
                            style: { fontSize: 18, color: CARD_TEXT },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="비밀번호 표시/숨김"
                                        onClick={() => setShowPassword((show) => !show)}
                                        edge="end"
                                        sx={{ color: PRIMARY_BLUE }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                '& .MuiInputBase-input': { color: CARD_TEXT },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: CARD_BORDER },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_BLUE },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_BLUE },
                            },
                        }}
                        InputLabelProps={{ style: { color: '#b6c2e1' } }}
                    />
                    {/* 에러 메시지: 패스워드 인풋 바로 아래 */}
                    {error && (
                        <Alert severity="error" sx={{ mt: 1, mb: 2, width: '100%', fontSize: 15, p: 1.2, textAlign: 'left' }}>{error}</Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: 3,
                            fontWeight: 700,
                            fontSize: 18,
                            py: 1.5,
                            borderRadius: 2,
                            bgcolor: PRIMARY_BLUE,
                            color: '#fff',
                            boxShadow: '0 2px 12px 0 #1e293b33',
                            '&:hover': { bgcolor: '#3b82f6' },
                        }}
                        fullWidth
                        size="large"
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login; 