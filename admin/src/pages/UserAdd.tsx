import React, { useState } from 'react';
import {
    Box,
    Paper,
    Button,
    TextField,
    Typography,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const UserAdd: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        nickname: '',
        password: '',
        role: 'admin' as string,
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const createUserMutation = useMutation({
        mutationFn: (userData: typeof formData) => api.post('/users', userData),
        onSuccess: () => {
            setSnackbar({
                open: true,
                message: '사용자가 성공적으로 추가되었습니다.',
                severity: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setTimeout(() => {
                navigate('/users');
            }, 1500);
        },
        onError: () => {
            setSnackbar({
                open: true,
                message: '사용자 추가에 실패했습니다.',
                severity: 'error',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.nickname || !formData.password) {
            setSnackbar({
                open: true,
                message: '필수 필드를 모두 입력해주세요.',
                severity: 'error',
            });
            return;
        }
        createUserMutation.mutate(formData);
    };

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleRoleChange = (event: any) => {
        setFormData(prev => ({
            ...prev,
            role: event.target.value,
        }));
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#181a20', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 0 }}>
            <Box sx={{ width: 400, borderRadius: 1, bgcolor: '#1d1f22', boxShadow: 'none', p: 0, border: '1px solid #232427', color: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pt: 3, px: 3 }}>
                    <IconButton onClick={() => navigate('/users')} sx={{ mr: 1, color: '#b6c2e1' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={700} color="#60a5fa" sx={{ letterSpacing: -0.5 }}>
                        사용자 추가
                    </Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3, pb: 3 }}>
                    <TextField
                        label="사용자명"
                        value={formData.username}
                        onChange={handleInputChange('username')}
                        fullWidth
                        autoFocus
                        required
                        variant="standard"
                        InputProps={{ disableUnderline: true, sx: { borderRadius: 1, bgcolor: '#232427', color: '#fff', px: 2, py: 1.2, fontSize: 16 } }}
                        InputLabelProps={{ sx: { color: '#b6c2e1', fontSize: 15 } }}
                    />
                    <TextField
                        label="닉네임"
                        value={formData.nickname}
                        onChange={handleInputChange('nickname')}
                        fullWidth
                        required
                        variant="standard"
                        InputProps={{ disableUnderline: true, sx: { borderRadius: 1, bgcolor: '#232427', color: '#fff', px: 2, py: 1.2, fontSize: 16 } }}
                        InputLabelProps={{ sx: { color: '#b6c2e1', fontSize: 15 } }}
                    />
                    <TextField
                        label="비밀번호"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        fullWidth
                        required
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: { borderRadius: 1, bgcolor: '#232427', color: '#fff', px: 2, py: 1.2, fontSize: 16 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: '#60a5fa' }}
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{ sx: { color: '#b6c2e1', fontSize: 15 } }}
                    />
                    <TextField
                        select
                        label="권한"
                        value={formData.role}
                        onChange={handleRoleChange}
                        fullWidth
                        required
                        variant="standard"
                        InputProps={{ disableUnderline: true, sx: { borderRadius: 1, bgcolor: '#232427', color: '#fff', px: 2, py: 1.2, fontSize: 16 } }}
                        InputLabelProps={{ sx: { color: '#b6c2e1', fontSize: 15 } }}
                    >
                        <MenuItem value="super_admin">슈퍼 관리자</MenuItem>
                        <MenuItem value="admin">관리자</MenuItem>
                    </TextField>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disableElevation
                            sx={{
                                bgcolor: '#60a5fa',
                                color: 'white',
                                borderRadius: 1,
                                fontWeight: 700,
                                px: 3,
                                fontSize: 15,
                                boxShadow: 'none',
                                flex: 1,
                                '&:hover': { bgcolor: '#3b82f6' }
                            }}
                        >
                            {createUserMutation.isPending ? '추가 중...' : '사용자 추가'}
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => navigate('/users')}
                            sx={{ color: '#b6c2e1', borderRadius: 1, minWidth: 0, px: 2, fontWeight: 500, fontSize: 15, flex: 1 }}
                            disableElevation
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%', bgcolor: '#1d1f22', color: '#fff' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserAdd; 