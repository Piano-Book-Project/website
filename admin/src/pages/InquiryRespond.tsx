import React, { useState, useEffect } from 'react';
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
    Divider,
    Grid,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Send as SendIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

interface Inquiry {
    id: number;
    title: string;
    content: string;
    author: string;
    email: string;
    category: string;
    status: 'pending' | 'in_progress' | 'completed' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    updatedAt: string;
    responseAt?: string;
    response?: string;
}

const InquiryRespond: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const [responseText, setResponseText] = useState('');
    const [status, setStatus] = useState<string>('pending');
    const [priority, setPriority] = useState<string>('medium');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 문의 상세 정보 불러오기
    const { data: inquiry, isLoading, isError } = useQuery<Inquiry>({
        queryKey: ['inquiry', id],
        queryFn: async () => {
            // 실제 API가 준비되면 이 부분을 교체
            // const { data } = await api.get(`/inquiries/${id}`);
            // return data;

            // 목업 데이터
            return {
                id: parseInt(id || '1'),
                title: '로그인 문제 문의',
                content: '로그인이 되지 않는 문제가 발생하고 있습니다. 아이디와 비밀번호는 정확히 입력했는데도 로그인이 되지 않습니다. 이 문제를 해결해주시기 바랍니다.',
                author: 'user1',
                email: 'user1@example.com',
                category: '기술지원',
                status: 'pending',
                priority: 'high',
                createdAt: '2025-07-12T10:00:00Z',
                updatedAt: '2025-07-12T10:00:00Z',
            };
        },
        enabled: !!id,
    });

    // 답변 전송 뮤테이션
    const sendResponseMutation = useMutation({
        mutationFn: async (data: { response: string; status: string; priority: string }) => {
            // 실제 API가 준비되면 이 부분을 교체
            // return await api.post(`/inquiries/${id}/respond`, data);
            return { success: true };
        },
        onSuccess: () => {
            setSnackbar({
                open: true,
                message: '답변이 성공적으로 전송되었습니다.',
                severity: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['inquiries'] });
            setTimeout(() => {
                navigate('/inquiries');
            }, 1500);
        },
        onError: () => {
            setSnackbar({
                open: true,
                message: '답변 전송에 실패했습니다.',
                severity: 'error',
            });
        },
    });

    useEffect(() => {
        if (inquiry) {
            setStatus(inquiry.status);
            setPriority(inquiry.priority);
            setResponseText(inquiry.response || '');
        }
    }, [inquiry]);

    const handleSendResponse = () => {
        if (!responseText.trim()) {
            setSnackbar({
                open: true,
                message: '답변 내용을 입력해주세요.',
                severity: 'error',
            });
            return;
        }

        sendResponseMutation.mutate({
            response: responseText,
            status,
            priority,
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'in_progress': return 'info';
            case 'completed': return 'success';
            case 'closed': return 'default';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return '대기중';
            case 'in_progress': return '처리중';
            case 'completed': return '완료';
            case 'closed': return '종료';
            default: return status;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'default';
            default: return 'default';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'urgent': return '긴급';
            case 'high': return '높음';
            case 'medium': return '보통';
            case 'low': return '낮음';
            default: return priority;
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>로딩 중...</Typography>
            </Box>
        );
    }

    if (isError || !inquiry) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">문의를 불러오는데 실패했습니다.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', mx: 0, px: 0, pb: 6, margin: 0 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 4, ml: 0, mr: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/inquiries')}
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
                        문의 답변
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
                        startIcon={<SendIcon />}
                        onClick={handleSendResponse}
                        disabled={sendResponseMutation.isPending}
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
                        답변 전송
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* 문의 정보 */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: 0,
                        background: '#141517',
                        border: '1px solid #232427',
                        boxShadow: 'none',
                    }}>
                        <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                            문의 정보
                        </Typography>
                        <Divider sx={{ mb: 3, borderColor: '#232427' }} />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                제목
                            </Typography>
                            <Typography variant="body1" color="text.primary" fontWeight={500}>
                                {inquiry.title}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                작성자
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                                {inquiry.author} ({inquiry.email})
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                카테고리
                            </Typography>
                            <Chip label={inquiry.category} size="small" />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                등록일
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                                {new Date(inquiry.createdAt).toLocaleString()}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                문의 내용
                            </Typography>
                            <Paper sx={{
                                p: 2,
                                background: '#232427',
                                border: '1px solid #35373d',
                                borderRadius: 0,
                            }}>
                                <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {inquiry.content}
                                </Typography>
                            </Paper>
                        </Box>
                    </Paper>
                </Grid>

                {/* 답변 작성 */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: 0,
                        background: '#141517',
                        border: '1px solid #232427',
                        boxShadow: 'none',
                    }}>
                        <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                            답변 작성
                        </Typography>
                        <Divider sx={{ mb: 3, borderColor: '#232427' }} />

                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel sx={{ color: '#9ca3af' }}>상태</InputLabel>
                                <Select
                                    value={status}
                                    label="상태"
                                    onChange={(e) => setStatus(e.target.value)}
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
                                    <MenuItem value="pending">대기중</MenuItem>
                                    <MenuItem value="in_progress">처리중</MenuItem>
                                    <MenuItem value="completed">완료</MenuItem>
                                    <MenuItem value="closed">종료</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel sx={{ color: '#9ca3af' }}>우선순위</InputLabel>
                                <Select
                                    value={priority}
                                    label="우선순위"
                                    onChange={(e) => setPriority(e.target.value)}
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
                                    <MenuItem value="low">낮음</MenuItem>
                                    <MenuItem value="medium">보통</MenuItem>
                                    <MenuItem value="high">높음</MenuItem>
                                    <MenuItem value="urgent">긴급</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                답변 내용
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={8}
                                placeholder="답변을 입력하세요..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
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
                        </Box>

                        {inquiry.response && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    기존 답변
                                </Typography>
                                <Paper sx={{
                                    p: 2,
                                    background: '#232427',
                                    border: '1px solid #35373d',
                                    borderRadius: 0,
                                }}>
                                    <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {inquiry.response}
                                    </Typography>
                                    {inquiry.responseAt && (
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            답변일: {new Date(inquiry.responseAt).toLocaleString()}
                                        </Typography>
                                    )}
                                </Paper>
                            </Box>
                        )}
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

export default InquiryRespond; 