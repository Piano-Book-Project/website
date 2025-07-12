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
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as MuiPaper,
    IconButton,
    Tooltip,
    Divider,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon,
    Visibility as ViewIcon,
    VisibilityOff as ViewOffIcon,
    QuestionAnswer as InquiryIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
}

const InquiryManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    // 실제 DB에서 문의 목록 불러오기 (현재는 목업 데이터)
    const { data: inquiries = [], isLoading, isError, refetch } = useQuery<Inquiry[]>({
        queryKey: ['inquiries', searchTerm, statusFilter, priorityFilter, categoryFilter],
        queryFn: async () => {
            // 실제 API가 준비되면 이 부분을 교체
            // const { data } = await api.get('/inquiries', {
            //     params: {
            //         search: searchTerm,
            //         status: statusFilter !== 'all' ? statusFilter : undefined,
            //         priority: priorityFilter !== 'all' ? priorityFilter : undefined,
            //         category: categoryFilter !== 'all' ? categoryFilter : undefined,
            //     },
            // });
            // return data;

            // 목업 데이터
            return [
                {
                    id: 1,
                    title: '로그인 문제 문의',
                    content: '로그인이 되지 않는 문제가 발생하고 있습니다.',
                    author: 'user1',
                    email: 'user1@example.com',
                    category: '기술지원',
                    status: 'pending',
                    priority: 'high',
                    createdAt: '2025-07-12T10:00:00Z',
                    updatedAt: '2025-07-12T10:00:00Z',
                },
                {
                    id: 2,
                    title: '결제 관련 문의',
                    content: '결제가 완료되지 않는 문제가 있습니다.',
                    author: 'user2',
                    email: 'user2@example.com',
                    category: '결제',
                    status: 'in_progress',
                    priority: 'urgent',
                    createdAt: '2025-07-12T09:00:00Z',
                    updatedAt: '2025-07-12T09:30:00Z',
                },
                {
                    id: 3,
                    title: '기능 개선 제안',
                    content: '사용자 편의를 위한 기능 개선을 제안합니다.',
                    author: 'user3',
                    email: 'user3@example.com',
                    category: '제안',
                    status: 'completed',
                    priority: 'medium',
                    createdAt: '2025-07-12T08:00:00Z',
                    updatedAt: '2025-07-12T11:00:00Z',
                    responseAt: '2025-07-12T11:00:00Z',
                },
                {
                    id: 4,
                    title: '계정 삭제 요청',
                    content: '계정을 삭제하고 싶습니다.',
                    author: 'user4',
                    email: 'user4@example.com',
                    category: '계정',
                    status: 'closed',
                    priority: 'low',
                    createdAt: '2025-07-11T15:00:00Z',
                    updatedAt: '2025-07-12T09:00:00Z',
                    responseAt: '2025-07-12T09:00:00Z',
                },
            ];
        },
    });

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleStatusFilter = (event: any) => {
        setStatusFilter(event.target.value);
    };

    const handlePriorityFilter = (event: any) => {
        setPriorityFilter(event.target.value);
    };

    const handleCategoryFilter = (event: any) => {
        setCategoryFilter(event.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPriorityFilter('all');
        setCategoryFilter('all');
    };

    const filteredInquiries = inquiries.filter((inquiry) => {
        const matchesSearch = inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || inquiry.priority === priorityFilter;
        const matchesCategory = categoryFilter === 'all' || inquiry.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

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

    return (
        <Box sx={{ width: '100%', mx: 0, px: 0, pb: 6, margin: 0 }}>
            {/* Header and Search in same row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 4, ml: 0, mr: 0 }}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" gutterBottom>
                        문의 관리
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        총 {filteredInquiries.length}개의 문의가 있습니다
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/inquiries/add')}
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
                    문의 답변
                </Button>
            </Box>

            {/* Search and Filters */}
            <Paper sx={{
                p: 3,
                mb: 3,
                borderRadius: 0,
                background: '#141517',
                border: '1px solid #232427',
                boxShadow: 'none',
                maxWidth: '100%',
                ml: 0,
                mr: 0
            }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: showFilters ? 2 : 0 }}>
                    <TextField
                        placeholder="제목, 내용, 작성자, 이메일로 검색"
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9ca3af' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flexGrow: 2,
                            minWidth: 400,
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
                    <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{
                            borderRadius: 0,
                            px: 3,
                            py: 1.5,
                            borderColor: '#35373d',
                            color: '#9ca3af',
                            '&:hover': {
                                borderColor: '#4b5563',
                                backgroundColor: '#1e2127',
                                color: '#60a5fa',
                            }
                        }}
                    >
                        필터
                    </Button>
                    {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
                        <Button
                            variant="text"
                            startIcon={<ClearIcon />}
                            onClick={clearFilters}
                            sx={{
                                borderRadius: 0,
                                color: '#6b7280',
                                '&:hover': {
                                    backgroundColor: '#1e2127',
                                    color: '#9ca3af',
                                }
                            }}
                        >
                            초기화
                        </Button>
                    )}
                </Box>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Divider sx={{ my: 3, borderColor: '#232427' }} />
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel sx={{ color: '#9ca3af' }}>상태</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        label="상태"
                                        onChange={handleStatusFilter}
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
                                        <MenuItem value="all">전체</MenuItem>
                                        <MenuItem value="pending">대기중</MenuItem>
                                        <MenuItem value="in_progress">처리중</MenuItem>
                                        <MenuItem value="completed">완료</MenuItem>
                                        <MenuItem value="closed">종료</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel sx={{ color: '#9ca3af' }}>우선순위</InputLabel>
                                    <Select
                                        value={priorityFilter}
                                        label="우선순위"
                                        onChange={handlePriorityFilter}
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
                                        <MenuItem value="all">전체</MenuItem>
                                        <MenuItem value="urgent">긴급</MenuItem>
                                        <MenuItem value="high">높음</MenuItem>
                                        <MenuItem value="medium">보통</MenuItem>
                                        <MenuItem value="low">낮음</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel sx={{ color: '#9ca3af' }}>카테고리</InputLabel>
                                    <Select
                                        value={categoryFilter}
                                        label="카테고리"
                                        onChange={handleCategoryFilter}
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
                                        <MenuItem value="all">전체</MenuItem>
                                        <MenuItem value="기술지원">기술지원</MenuItem>
                                        <MenuItem value="결제">결제</MenuItem>
                                        <MenuItem value="제안">제안</MenuItem>
                                        <MenuItem value="계정">계정</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Paper>

            {/* Inquiry Table */}
            <TableContainer component={MuiPaper} sx={{
                background: '#141517',
                borderRadius: 0,
                boxShadow: 'none',
                border: '1px solid #232427',
                width: '100%',
                mx: 0,
                px: 0,
                ml: 0,
                mr: 0
            }}>
                <Table sx={{ minWidth: 900, width: '100%' }}>
                    <TableHead>
                        <TableRow sx={{ background: '#232427' }}>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '80px'
                            }}>No</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '200px'
                            }}>제목</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '120px'
                            }}>작성자</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '120px'
                            }}>카테고리</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '100px'
                            }}>상태</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '100px'
                            }}>우선순위</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '120px'
                            }}>등록 일자</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '120px'
                            }} align="center">답변 | 삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="h6" color="text.secondary">로딩 중...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="h6" color="text.secondary">데이터를 불러오는데 실패했습니다.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredInquiries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <InquiryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        문의를 찾을 수 없습니다
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        검색 조건을 변경해보세요
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInquiries.map((inquiry, index) => (
                                <TableRow key={inquiry.id} hover sx={{
                                    background: '#141517',
                                    '&:hover': {
                                        background: '#1e2127',
                                        transition: 'background-color 0.2s ease'
                                    },
                                    borderBottom: '1px solid #232427'
                                }}>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{index + 1}</TableCell>
                                    <TableCell sx={{
                                        color: '#fff',
                                        fontWeight: 600,
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{inquiry.title}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{inquiry.author}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{inquiry.category}</TableCell>
                                    <TableCell sx={{
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>
                                        <Chip
                                            label={getStatusLabel(inquiry.status)}
                                            color={getStatusColor(inquiry.status)}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: 12,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>
                                        <Chip
                                            label={getPriorityLabel(inquiry.priority)}
                                            color={getPriorityColor(inquiry.priority)}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: 12,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="center" sx={{
                                        py: 2.5,
                                        px: 3
                                    }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => navigate(`/inquiries/respond/${inquiry.id}`)}
                                            sx={{
                                                color: '#60a5fa',
                                                '&:hover': {
                                                    bgcolor: '#1e2127',
                                                    transform: 'scale(1.1)',
                                                    transition: 'all 0.2s ease'
                                                }
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <span style={{ color: '#4b5563', margin: '0 8px' }}>|</span>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                if (window.confirm('정말로 이 문의를 삭제하시겠습니까?')) {
                                                    // 삭제 로직
                                                }
                                            }}
                                            sx={{
                                                color: '#ef4444',
                                                '&:hover': {
                                                    bgcolor: '#1e2127',
                                                    transform: 'scale(1.1)',
                                                    transition: 'all 0.2s ease'
                                                }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default InquiryManagement; 