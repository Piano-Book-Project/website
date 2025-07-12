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
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/users')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" fontWeight={700}>
                    사용자 추가
                </Typography>
            </Box>

            <Paper sx={{ p: 4, maxWidth: 600 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="사용자 ID"
                        value={formData.username}
                        onChange={handleInputChange('username')}
                        margin="normal"
                        required
                        helperText="로그인에 사용할 고유한 ID를 입력하세요"
                    />

                    <TextField
                        fullWidth
                        label="닉네임"
                        value={formData.nickname}
                        onChange={handleInputChange('nickname')}
                        margin="normal"
                        required
                        helperText="표시될 이름을 입력하세요"
                    />

                    <TextField
                        fullWidth
                        label="비밀번호"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        helperText="8자 이상의 안전한 비밀번호를 입력하세요"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>권한</InputLabel>
                        <Select
                            value={formData.role}
                            onChange={handleRoleChange}
                            label="권한"
                        >
                            <MenuItem value="super_admin">Super Admin</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="moderator">Moderator</MenuItem>
                            <MenuItem value="user">User</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={createUserMutation.isPending}
                            sx={{ flex: 1 }}
                        >
                            {createUserMutation.isPending ? '추가 중...' : '사용자 추가'}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/users')}
                            sx={{ flex: 1 }}
                        >
                            취소
                        </Button>
                    </Box>
                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserAdd; 