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
    Article as ArticleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    category: string;
    status: 'published' | 'draft' | 'archived';
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

const PostManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    // 실제 DB에서 게시물 목록 불러오기 (현재는 목업 데이터)
    const { data: posts = [], isLoading, isError, refetch } = useQuery<Post[]>({
        queryKey: ['posts', searchTerm, statusFilter, categoryFilter],
        queryFn: async () => {
            // 실제 API가 준비되면 이 부분을 교체
            // const { data } = await api.get('/posts', {
            //     params: {
            //         search: searchTerm,
            //         status: statusFilter !== 'all' ? statusFilter : undefined,
            //         category: categoryFilter !== 'all' ? categoryFilter : undefined,
            //     },
            // });
            // return data;

            // 목업 데이터
            return [
                {
                    id: 1,
                    title: '공지사항 안내',
                    content: '중요한 공지사항입니다.',
                    author: 'admin',
                    category: '공지사항',
                    status: 'published',
                    viewCount: 125,
                    createdAt: '2025-07-12T10:00:00Z',
                    updatedAt: '2025-07-12T10:00:00Z',
                },
                {
                    id: 2,
                    title: '자유게시판 첫 글',
                    content: '자유로운 소통을 시작합니다.',
                    author: 'user1',
                    category: '자유게시판',
                    status: 'published',
                    viewCount: 89,
                    createdAt: '2025-07-12T09:00:00Z',
                    updatedAt: '2025-07-12T09:00:00Z',
                },
                {
                    id: 3,
                    title: '문의사항 답변',
                    content: '고객 문의에 대한 답변입니다.',
                    author: 'admin',
                    category: '문의사항',
                    status: 'draft',
                    viewCount: 0,
                    createdAt: '2025-07-12T08:00:00Z',
                    updatedAt: '2025-07-12T08:00:00Z',
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

    const handleCategoryFilter = (event: any) => {
        setCategoryFilter(event.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setCategoryFilter('all');
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'success';
            case 'draft': return 'warning';
            case 'archived': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'published': return '발행됨';
            case 'draft': return '임시저장';
            case 'archived': return '보관됨';
            default: return status;
        }
    };

    return (
        <Box sx={{ width: '100%', mx: 0, px: 0, pb: 6, margin: 0 }}>
            {/* Header and Search in same row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 4, ml: 0, mr: 0 }}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" gutterBottom>
                        게시물 관리
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        총 {filteredPosts.length}개의 게시물이 있습니다
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/posts/add')}
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
                    게시물 작성
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
                        placeholder="제목, 내용, 작성자로 검색"
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
                    {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
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
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                <FormControl sx={{ minWidth: 200 }}>
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
                                        <MenuItem value="published">발행됨</MenuItem>
                                        <MenuItem value="draft">임시저장</MenuItem>
                                        <MenuItem value="archived">보관됨</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 200 }}>
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
                                        <MenuItem value="공지사항">공지사항</MenuItem>
                                        <MenuItem value="자유게시판">자유게시판</MenuItem>
                                        <MenuItem value="문의사항">문의사항</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Paper>

            {/* Post Table */}
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
                                width: '250px'
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
                            }}>조회수</TableCell>
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
                            }} align="center">수정 | 삭제</TableCell>
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
                        ) : filteredPosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <ArticleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        게시물을 찾을 수 없습니다
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        검색 조건을 변경하거나 새로운 게시물을 작성해보세요
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPosts.map((post, index) => (
                                <TableRow key={post.id} hover sx={{
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
                                    }}>{post.title}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{post.author}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{post.category}</TableCell>
                                    <TableCell sx={{
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>
                                        <Chip
                                            label={getStatusLabel(post.status)}
                                            color={getStatusColor(post.status)}
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
                                    }}>{post.viewCount}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="center" sx={{
                                        py: 2.5,
                                        px: 3
                                    }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => navigate(`/posts/edit/${post.id}`)}
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
                                                if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
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

export default PostManagement; 