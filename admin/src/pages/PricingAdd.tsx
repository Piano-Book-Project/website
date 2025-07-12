import React, { useState } from 'react';
import {
    Box,
    Paper,
    Button,
    TextField,
    Typography,
    Chip,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Divider,
    Grid,
    IconButton,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

interface PricingFormData {
    name: string;
    description: string;
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly' | 'lifetime';
    features: string[];
    isActive: boolean;
    isPopular: boolean;
    sortOrder: number;
}

const PricingAdd: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<PricingFormData>({
        name: '',
        description: '',
        price: 0,
        currency: 'KRW',
        billingCycle: 'monthly',
        features: [''],
        isActive: true,
        isPopular: false,
        sortOrder: 1,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 요금제 추가 뮤테이션
    const addPricingMutation = useMutation({
        mutationFn: async (data: PricingFormData) => {
            // 실제 API가 준비되면 이 부분을 교체
            // return await api.post('/pricing', data);
            return { success: true };
        },
        onSuccess: () => {
            setSnackbar({
                open: true,
                message: '요금제가 성공적으로 추가되었습니다.',
                severity: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
            setTimeout(() => {
                navigate('/pricing');
            }, 1500);
        },
        onError: () => {
            setSnackbar({
                open: true,
                message: '요금제 추가에 실패했습니다.',
                severity: 'error',
            });
        },
    });

    const handleInputChange = (field: keyof PricingFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({
            ...prev,
            features: newFeatures,
        }));
    };

    const handleAddFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, ''],
        }));
    };

    const handleRemoveFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            features: newFeatures,
        }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            setSnackbar({
                open: true,
                message: '요금제명을 입력해주세요.',
                severity: 'error',
            });
            return;
        }

        if (formData.price < 0) {
            setSnackbar({
                open: true,
                message: '가격은 0 이상이어야 합니다.',
                severity: 'error',
            });
            return;
        }

        const validFeatures = formData.features.filter(feature => feature.trim() !== '');

        addPricingMutation.mutate({
            ...formData,
            features: validFeatures,
        });
    };

    const handleSaveDraft = () => {
        // 임시 저장 로직
        setSnackbar({
            open: true,
            message: '임시 저장되었습니다.',
            severity: 'success',
        });
    };

    return (
        <Box sx={{ width: '100%', mx: 0, px: 0, pb: 6, margin: 0 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 4, ml: 0, mr: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/pricing')}
                        sx={{
                            borderRadius: 0,
                            borderColor: '#35373d',
                            color: '#9ca3af',
                            '&:hover': {
                                borderColor: '#4b5563',
                                backgroundColor: '#1e2127',
                                color: '#60a5fa',
                            }
                        }}
                    >
                        목록으로
                    </Button>
                    <Typography variant="h4" component="h1" fontWeight={700} color="text.primary">
                        요금제 추가
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveDraft}
                        sx={{
                            borderRadius: 0,
                            borderColor: '#35373d',
                            color: '#9ca3af',
                            '&:hover': {
                                borderColor: '#4b5563',
                                backgroundColor: '#1e2127',
                                color: '#60a5fa',
                            }
                        }}
                    >
                        임시 저장
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleSubmit}
                        disabled={addPricingMutation.isPending}
                        sx={{
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(45deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #3b82f6 0%, #2563eb 100%)',
                            }
                        }}
                    >
                        요금제 추가
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* 기본 정보 */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: 0,
                        background: '#141517',
                        border: '1px solid #232427',
                        boxShadow: 'none',
                    }}>
                        <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                            기본 정보
                        </Typography>
                        <Divider sx={{ mb: 3, borderColor: '#232427' }} />

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="요금제명"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 0,
                                        backgroundColor: '#232427',
                                        border: '1px solid #35373d',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#1e2127',
                                            borderColor: '#4b5563',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: '#1e2127',
                                            borderColor: '#60a5fa',
                                        },
                                        '& fieldset': {
                                            border: 'none',
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#9ca3af',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#fff',
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                label="설명"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                multiline
                                rows={3}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 0,
                                        backgroundColor: '#232427',
                                        border: '1px solid #35373d',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#1e2127',
                                            borderColor: '#4b5563',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: '#1e2127',
                                            borderColor: '#60a5fa',
                                        },
                                        '& fieldset': {
                                            border: 'none',
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#9ca3af',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#fff',
                                    }
                                }}
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <TextField
                                        fullWidth
                                        label="가격"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 0,
                                                backgroundColor: '#232427',
                                                border: '1px solid #35373d',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#1e2127',
                                                    borderColor: '#4b5563',
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: '#1e2127',
                                                    borderColor: '#60a5fa',
                                                },
                                                '& fieldset': {
                                                    border: 'none',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#9ca3af',
                                            },
                                            '& .MuiInputBase-input': {
                                                color: '#fff',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: '#9ca3af' }}>통화</InputLabel>
                                        <Select
                                            value={formData.currency}
                                            label="통화"
                                            onChange={(e) => handleInputChange('currency', e.target.value)}
                                            sx={{
                                                borderRadius: 0,
                                                backgroundColor: '#232427',
                                                border: '1px solid #35373d',
                                                color: '#fff',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none',
                                                },
                                                '&:hover': {
                                                    backgroundColor: '#1e2127',
                                                    borderColor: '#60a5fa',
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: '#1e2127',
                                                    borderColor: '#60a5fa',
                                                }
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        backgroundColor: '#232427',
                                                        border: '1px solid #35373d',
                                                        '& .MuiMenuItem-root': {
                                                            color: '#fff',
                                                            '&:hover': {
                                                                backgroundColor: '#2a2d35',
                                                            },
                                                            '&.Mui-selected': {
                                                                backgroundColor: '#60a5fa',
                                                                color: '#fff',
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            <MenuItem value="KRW">KRW (원)</MenuItem>
                                            <MenuItem value="USD">USD ($)</MenuItem>
                                            <MenuItem value="EUR">EUR (€)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel sx={{ color: '#9ca3af' }}>결제 주기</InputLabel>
                            <Select
                                value={formData.billingCycle}
                                label="결제 주기"
                                onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                                sx={{
                                    borderRadius: 0,
                                    backgroundColor: '#232427',
                                    border: '1px solid #35373d',
                                    color: '#fff',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#1e2127',
                                        borderColor: '#60a5fa',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#1e2127',
                                        borderColor: '#60a5fa',
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: '#232427',
                                            border: '1px solid #35373d',
                                            '& .MuiMenuItem-root': {
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#2a2d35',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#60a5fa',
                                                    color: '#fff',
                                                }
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="monthly">월간</MenuItem>
                                <MenuItem value="yearly">연간</MenuItem>
                                <MenuItem value="lifetime">평생</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#60a5fa',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#60a5fa',
                                            },
                                        }}
                                    />
                                }
                                label="활성 상태"
                                sx={{ color: '#e0e7ef' }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isPopular}
                                        onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#f59e0b',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#f59e0b',
                                            },
                                        }}
                                    />
                                }
                                label="인기 요금제"
                                sx={{ color: '#e0e7ef' }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* 제공 기능 */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: 0,
                        background: '#141517',
                        border: '1px solid #232427',
                        boxShadow: 'none',
                    }}>
                        <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                            제공 기능
                        </Typography>
                        <Divider sx={{ mb: 3, borderColor: '#232427' }} />

                        {formData.features.map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    placeholder="기능을 입력하세요"
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 0,
                                            backgroundColor: '#232427',
                                            border: '1px solid #35373d',
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#1e2127',
                                                borderColor: '#4b5563',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#1e2127',
                                                borderColor: '#60a5fa',
                                            },
                                            '& fieldset': {
                                                border: 'none',
                                            }
                                        },
                                        '& .MuiInputBase-input': {
                                            color: '#fff',
                                            '&::placeholder': {
                                                color: '#9ca3af',
                                                opacity: 1
                                            }
                                        }
                                    }}
                                />
                                {formData.features.length > 1 && (
                                    <IconButton
                                        onClick={() => handleRemoveFeature(index)}
                                        sx={{
                                            color: '#ef4444',
                                            '&:hover': {
                                                backgroundColor: '#1e2127',
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}

                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddFeature}
                            sx={{
                                borderRadius: 0,
                                borderColor: '#35373d',
                                color: '#9ca3af',
                                '&:hover': {
                                    borderColor: '#4b5563',
                                    backgroundColor: '#1e2127',
                                    color: '#60a5fa',
                                }
                            }}
                        >
                            기능 추가
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PricingAdd; 