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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
    Person as PersonIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { usePermissions } from '../hooks/usePermissions';

interface AdminUser {
    id: number;
    username: string;
    nickname: string;
    role: string;
    lastLoginAt?: string;
    createdAt: string;
}

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { hasPermission, PERMISSIONS } = usePermissions();

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        nickname: '',
        password: '',
        role: 'admin',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    // 실제 DB에서 사용자 목록 불러오기
    const { data: users = [], isLoading, isError, refetch } = useQuery<AdminUser[]>({
        queryKey: ['users', searchTerm, roleFilter],
        queryFn: async () => {
            const { data } = await api.get('/users', {
                params: {
                    search: searchTerm,
                    role: roleFilter !== 'all' ? roleFilter : undefined,
                },
            });
            return data;
        },
    });

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleRoleFilter = (event: any) => {
        setRoleFilter(event.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setRoleFilter('all');
    };

    const filteredUsers = users
        .filter((user) => {
            const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toString().includes(searchTerm);
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // 오래된 순으로 정렬

    const handleOpenDialog = (user?: AdminUser) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                nickname: user.nickname,
                password: '',
                role: user.role,
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                nickname: '',
                password: '',
                role: 'admin',
            });
        }
        setShowPassword(false);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUser(null);
        setFormData({
            username: '',
            nickname: '',
            password: '',
            role: 'admin',
        });
        setShowPassword(false);
    };

    const handlePermissionChange = (permission: string) => {
        // This function is no longer needed as permissions are managed by the backend
        // Keeping it for now, but it will not affect the formData.permissions state
        // as the formData structure is simplified.
        // If permissions were to be managed here, the formData structure would need to be updated.
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.nickname || (!editingUser && !formData.password)) {
            setSnackbar({
                open: true,
                message: '필수 필드를 모두 입력해주세요.',
                severity: 'error',
            });
            return;
        }

        try {
            if (editingUser) {
                // Update existing user
                await api.put(`/users/${editingUser.id}`, formData);
                setSnackbar({
                    open: true,
                    message: '사용자가 성공적으로 수정되었습니다.',
                    severity: 'success',
                });
            } else {
                // Add new user
                await api.post('/users', formData);
                setSnackbar({
                    open: true,
                    message: '사용자가 성공적으로 추가되었습니다.',
                    severity: 'success',
                });
            }
            refetch(); // Refresh the list after successful operation
            handleCloseDialog();
        } catch (error) {
            setSnackbar({
                open: true,
                message: '사용자 추가/수정에 실패했습니다.',
                severity: 'error',
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
            try {
                await api.delete(`/users/${id}`);
                setSnackbar({
                    open: true,
                    message: '사용자가 성공적으로 삭제되었습니다.',
                    severity: 'success',
                });
                refetch(); // Refresh the list after successful operation
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: '사용자 삭제에 실패했습니다.',
                    severity: 'error',
                });
            }
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin': return 'error';
            case 'admin': return 'primary';
            case 'moderator': return 'secondary';
            default: return 'default';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'super_admin': return '슈퍼 관리자';
            case 'admin': return '관리자';
            case 'moderator': return '모더레이터';
            default: return role;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'inactive': return 'warning';
            case 'suspended': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return '활성';
            case 'inactive': return '비활성';
            case 'suspended': return '정지';
            default: return status;
        }
    };

    const availablePermissions = [
        { key: 'users', label: '사용자 관리' },
        { key: 'categories', label: '카테고리 관리' },
        { key: 'posts', label: '게시물 관리' },
        { key: 'inquiries', label: '문의 관리' },
        { key: 'pricing', label: '요금제 관리' },
    ];

    return (
        <Box sx={{ width: '100%', mx: 0, px: 0, pb: 6, margin: 0 }}>
            {/* Header and Search in same row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 4, ml: 0, mr: 0 }}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" gutterBottom>
                        사용자 관리
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        총 {filteredUsers.length}명의 사용자가 있습니다
                    </Typography>
                </Box>
                {hasPermission(PERMISSIONS.USERS_WRITE) && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/users/add')}
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
                        사용자 추가
                    </Button>
                )}
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
                        placeholder="사용자명 또는 ID로 검색"
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
                    {(searchTerm || roleFilter !== 'all') && (
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
                                    <InputLabel sx={{ color: '#9ca3af' }}>권한</InputLabel>
                                    <Select
                                        value={roleFilter}
                                        label="권한"
                                        onChange={handleRoleFilter}
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
                                        <MenuItem value="super_admin">슈퍼 관리자</MenuItem>
                                        <MenuItem value="admin">관리자</MenuItem>
                                        <MenuItem value="moderator">모더레이터</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Paper>

            {/* User Table */}
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
                                width: '100px'
                            }}>ID</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '150px'
                            }}>닉네임</TableCell>
                            <TableCell sx={{
                                color: '#fff',
                                fontWeight: 700,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid #35373d',
                                fontSize: 14,
                                width: '120px'
                            }}>권한</TableCell>
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
                                width: '150px'
                            }}>마지막 접속 일자</TableCell>
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
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        사용자를 찾을 수 없습니다
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        검색 조건을 변경하거나 새로운 사용자를 추가해보세요
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user, index) => (
                                <TableRow key={user.id} hover sx={{
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
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{user.username}</TableCell>
                                    <TableCell sx={{
                                        color: '#fff',
                                        fontWeight: 600,
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{user.nickname}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{getRoleLabel(user.role)}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{user.createdAt}</TableCell>
                                    <TableCell sx={{
                                        color: '#e0e7ef',
                                        py: 2.5,
                                        px: 3,
                                        fontSize: 14
                                    }}>{user.lastLoginAt || '-'}</TableCell>
                                    <TableCell align="center" sx={{
                                        py: 2.5,
                                        px: 3
                                    }}>
                                        {hasPermission(PERMISSIONS.USERS_UPDATE) && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(user)}
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
                                        )}
                                        {hasPermission(PERMISSIONS.USERS_UPDATE) && hasPermission(PERMISSIONS.USERS_DELETE) && (
                                            <span style={{ color: '#4b5563', margin: '0 8px' }}>|</span>
                                        )}
                                        {hasPermission(PERMISSIONS.USERS_DELETE) && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(user.id)}
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
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 0,
                        background: '#141517',
                        border: '1px solid #232427',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        overflow: 'hidden',
                    }
                }}
            >
                {/* Header */}
                <Box sx={{
                    p: 3,
                    pb: 2,
                    borderBottom: '1px solid #232427',
                    background: '#232427',
                }}>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        {editingUser ? '사용자 수정' : '사용자 추가'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {editingUser ? '사용자 정보를 수정합니다.' : '새로운 사용자를 추가합니다.'}
                    </Typography>
                </Box>

                {/* Content */}
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* 사용자명 */}
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                사용자명 *
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="사용자명을 입력하세요"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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

                        {/* 닉네임 */}
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                닉네임 *
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="닉네임을 입력하세요"
                                value={formData.nickname}
                                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
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

                        {/* 비밀번호 */}
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                {editingUser ? '새 비밀번호 (변경시에만)' : '비밀번호 *'}
                            </Typography>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                placeholder={editingUser ? '변경하지 않으려면 비워두세요' : '비밀번호를 입력하세요'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{
                                                    color: '#9ca3af',
                                                    '&:hover': {
                                                        color: '#60a5fa',
                                                        backgroundColor: '#1e2127',
                                                    }
                                                }}
                                            >
                                                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
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

                        {/* 역할 */}
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                역할 *
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as string })}
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
                                    <MenuItem value="super_admin">슈퍼 관리자</MenuItem>
                                    <MenuItem value="admin">관리자</MenuItem>
                                    <MenuItem value="moderator">모더레이터</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>

                {/* Actions */}
                <Box sx={{
                    p: 3,
                    pt: 2,
                    borderTop: '1px solid #232427',
                    background: '#232427',
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                }}>
                    <Button
                        onClick={handleCloseDialog}
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
                        variant="outlined"
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            borderRadius: 0,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #3b82f6 0%, #2563eb 100%)',
                            }
                        }}
                    >
                        {editingUser ? '수정 완료' : '추가 완료'}
                    </Button>
                </Box>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        fontWeight: 500
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserManagement; 