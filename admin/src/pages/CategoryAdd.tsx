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
    FormControlLabel,
    Switch,
    IconButton,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Category as CategoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const CategoryAdd: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
        sortOrder: 1,
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const createCategoryMutation = useMutation({
        mutationFn: (categoryData: typeof formData) => api.post('/categories', categoryData),
        onSuccess: () => {
            setSnackbar({
                open: true,
                message: '카테고리가 성공적으로 추가되었습니다.',
                severity: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setTimeout(() => {
                navigate('/categories');
            }, 1500);
        },
        onError: () => {
            setSnackbar({
                open: true,
                message: '카테고리 추가에 실패했습니다.',
                severity: 'error',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setSnackbar({
                open: true,
                message: '카테고리명을 입력해주세요.',
                severity: 'error',
            });
            return;
        }
        createCategoryMutation.mutate(formData);
    };

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleSwitchChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.checked,
        }));
    };

    const handleSelectChange = (field: string) => (event: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/categories')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" fontWeight={700}>
                    카테고리 추가
                </Typography>
            </Box>

            <Paper sx={{ p: 4, maxWidth: 600 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="카테고리명"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        margin="normal"
                        required
                        helperText="카테고리의 이름을 입력하세요"
                    />

                    <TextField
                        fullWidth
                        label="설명"
                        value={formData.description}
                        onChange={handleInputChange('description')}
                        margin="normal"
                        multiline
                        rows={3}
                        helperText="카테고리에 대한 설명을 입력하세요"
                    />

                    <TextField
                        fullWidth
                        label="정렬순서"
                        type="number"
                        value={formData.sortOrder}
                        onChange={handleInputChange('sortOrder')}
                        margin="normal"
                        inputProps={{ min: 1 }}
                        helperText="카테고리의 표시 순서를 설정하세요 (숫자가 작을수록 먼저 표시)"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={handleSwitchChange('isActive')}
                                color="primary"
                            />
                        }
                        label="활성 상태"
                        sx={{ mt: 2, mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={createCategoryMutation.isPending}
                            sx={{ flex: 1 }}
                        >
                            {createCategoryMutation.isPending ? '추가 중...' : '카테고리 추가'}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/categories')}
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

export default CategoryAdd; 