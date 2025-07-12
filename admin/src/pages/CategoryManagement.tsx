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
    Switch,
    FormControlLabel,
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
    Category as CategoryIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface Category {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

const CategoryManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    // 실제 DB에서 카테고리 목록 불러오기 (현재는 목업 데이터)
    const { data: categories = [], isLoading, isError, refetch } = useQuery<Category[]>({
        queryKey: ['categories', searchTerm, statusFilter],
        queryFn: async () => {
            // 실제 API가 준비되면 이 부분을 교체
            // const { data } = await api.get('/categories', {
            //     params: {
            //         search: searchTerm,
            //         status: statusFilter !== 'all' ? statusFilter : undefined,
            //     },
            // });
            // return data;

            // 목업 데이터
            return [
                {
                    id: 1,
                    name: '공지사항',
                    description: '중요한 공지사항을 위한 카테고리',
                    isActive: true,
                    sortOrder: 1,
                    createdAt: '2025-07-12T10:00:00Z',
                    updatedAt: '2025-07-12T10:00:00Z',
                },
                {
                    id: 2,
                    name: '자유게시판',
                    description: '자유로운 소통을 위한 게시판',
                    isActive: true,
                    sortOrder: 2,
                    createdAt: '2025-07-12T10:00:00Z',
                    updatedAt: '2025-07-12T10:00:00Z',
                },
                {
                    id: 3,
                    name: '문의사항',
                    description: '고객 문의를 위한 카테고리',
                    isActive: true,
                    sortOrder: 3,
                    createdAt: '2025-07-12T10:00:00Z',
                    updatedAt: '2025-07-12T10:00:00Z',
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

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
    };

    const filteredCategories = categories.filter((category) => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && category.isActive) ||
            (statusFilter === 'inactive' && !category.isActive);
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'success' : 'error';
    };

    const getStatusLabel = (isActive: boolean) => {
        return isActive ? '활성' : '비활성';
    };

    return (
        <Box sx={{ width: '100%', mx: 0, px: 0, pb: 6, margin: 0 }}>
            {/* Header and Search in same row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 4, ml: 0, mr: 0 }}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" gutterBottom>
                        카테고리 관리
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        총 {filteredCategories.length}개의 카테고리가 있습니다
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/categories/add')}
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
                    카테고리 추가
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
                        placeholder="카테고리명 또는 설명으로 검색"
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
                    {(searchTerm || statusFilter !== 'all') && (
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
                                        <MenuItem value="active">활성</MenuItem>
                                        <MenuItem value="inactive">비활성</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Paper>

            {/* Category Table */}
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
                                width: '150px'
                            }}>카테고리명</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '200px'
                            }}>설명</TableCell>
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
                            }}>정렬순서</TableCell>
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
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="h6" color="text.secondary">로딩 중...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="h6" color="text.secondary">데이터를 불러오는데 실패했습니다.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        카테고리를 찾을 수 없습니다
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        검색 조건을 변경하거나 새로운 카테고리를 추가해보세요
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories.map((category, index) => (
                                <TableRow key={category.id} hover sx={{
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
                                    }}>{category.name}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{category.description}</TableCell>
                                    <TableCell sx={{
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>
                                        <Chip
                                            label={getStatusLabel(category.isActive)}
                                            color={getStatusColor(category.isActive)}
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
                                    }}>{category.sortOrder}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="center" sx={{
                                        py: 2.5,
                                        px: 3
                                    }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => navigate(`/categories/edit/${category.id}`)}
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
                                                if (window.confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
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

export default CategoryManagement; 