import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Chip, IconButton, Dialog, DialogContent, DialogActions, Tooltip, InputAdornment, MenuItem, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { usePermissions, PERMISSIONS } from '../hooks/usePermissions';
import api from '../utils/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface AdminUser {
    id: number;
    username: string;
    nickname: string;
    role: string;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { hasPermission } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        nickname: '',
        password: '',
        role: 'admin',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
    const deleteTargetUser = users.find(u => u.id === deleteTargetId) || null;

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

    // 수정: 백엔드에서 검색된 users에서 roleFilter만 프론트에서 적용
    const filteredUsers = users
        .filter((user) => roleFilter === 'all' || user.role === roleFilter)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

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
        setError('');
        setLoading(true);
        try {
            let res;
            if (editingUser) {
                res = await api.put(`/users/${editingUser.id}`, formData);
            } else {
                res = await api.post('/users', formData);
            }
            if (res.data && res.data.code !== 'SUCCESS') {
                throw new Error(res.data.message || '작업 실패');
            }
            handleCloseDialog();
            refetch();
        } catch (err: any) {
            setError(err.message || '작업 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setError('');
        setLoading(true);
        try {
            const res = await api.delete(`/users/${id}`);
            if (res.data && res.data.code !== 'SUCCESS') {
                throw new Error(res.data.message || '삭제 실패');
            }
            refetch();
        } catch (err: any) {
            setError(err.message || '삭제 실패');
        } finally {
            setLoading(false);
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

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: ko });
        } catch {
            return '날짜 오류';
        }
    };

    const formatLastLogin = (lastLoginAt?: string) => {
        if (!lastLoginAt) return '로그인 기록 없음';
        try {
            const date = new Date(lastLoginAt);
            const now = new Date();
            const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

            if (diffInHours < 1) return '방금 전';
            if (diffInHours < 24) return `${diffInHours}시간 전`;
            if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`;

            return format(date, 'yyyy-MM-dd HH:mm', { locale: ko });
        } catch {
            return '날짜 오류';
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
                        onClick={() => handleOpenDialog()}
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
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 0 }}>
                    <TextField
                        placeholder="아이디 또는 닉네임 검색"
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
                            minWidth: 300,
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
                            },
                        }}
                        InputLabelProps={{ style: { color: '#b6c2e1' } }}
                    />
                    <TextField
                        select
                        label="권한"
                        value={roleFilter}
                        onChange={handleRoleFilter}
                        sx={{
                            minWidth: 120,
                            backgroundColor: '#232427',
                            borderRadius: 0,
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
                            },
                        }}
                        InputLabelProps={{ style: { color: '#b6c2e1' } }}
                    >
                        <MenuItem value="all">전체</MenuItem>
                        <MenuItem value="super_admin">슈퍼 관리자</MenuItem>
                        <MenuItem value="admin">관리자</MenuItem>
                    </TextField>
                    <Button
                        variant="outlined"
                        onClick={clearFilters}
                        sx={{
                            borderRadius: 0,
                            color: '#60a5fa',
                            borderColor: '#60a5fa',
                            fontWeight: 600,
                            height: 40,
                            ml: 1,
                            '&:hover': {
                                borderColor: '#2563eb',
                                color: '#2563eb',
                                background: '#1e2127',
                            },
                        }}
                    >
                        초기화
                    </Button>
                </Box>
            </Paper>

            {/* Users Table */}
            <TableContainer component={Paper} sx={{
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
                                color: '#fff', fontWeight: 700, py: 2, px: 3, borderBottom: '1px solid #35373d', fontSize: 14, width: '80px'
                            }}>ID</TableCell>
                            <TableCell sx={{
                                color: '#fff', fontWeight: 700, py: 2, px: 3, borderBottom: '1px solid #35373d', fontSize: 14, width: '150px'
                            }}>사용자명</TableCell>
                            <TableCell sx={{
                                color: '#fff', fontWeight: 700, py: 2, px: 3, borderBottom: '1px solid #35373d', fontSize: 14, width: '150px'
                            }}>닉네임</TableCell>
                            <TableCell sx={{
                                color: '#fff', fontWeight: 700, py: 2, px: 3, borderBottom: '1px solid #35373d', fontSize: 14, width: '100px'
                            }}>권한</TableCell>
                            <TableCell sx={{
                                color: '#fff', fontWeight: 700, py: 2, px: 3, borderBottom: '1px solid #35373d', fontSize: 14, width: '160px'
                            }}>마지막 로그인</TableCell>
                            <TableCell sx={{
                                color: '#fff', fontWeight: 700, py: 2, px: 3, borderBottom: '1px solid #35373d', fontSize: 14, width: '120px'
                            }}>가입일</TableCell>
                            <TableCell sx={{
                                color: '#fff', fontWeight: 700, py: 2, px: 3, borderBottom: '1px solid #35373d', fontSize: 14, width: '120px'
                            }}>수정일</TableCell>
                            <TableCell sx={{
                                color: '#fff', fontWeight: 700, py: 2, px: 3, borderBottom: '1px solid #35373d', fontSize: 14, width: '120px'
                            }} align="center">작업</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} hover sx={{ '&:hover': { background: '#232942' } }}>
                                <TableCell sx={{ color: '#fff', py: 2, px: 3, fontSize: 14 }}>{user.id}</TableCell>
                                <TableCell sx={{ color: '#fff', py: 2, px: 3, fontSize: 14 }}>{user.username}</TableCell>
                                <TableCell sx={{ color: '#fff', py: 2, px: 3, fontSize: 14 }}>{user.nickname}</TableCell>
                                <TableCell sx={{ color: '#fff', py: 2, px: 3, fontSize: 14 }}>{getRoleLabel(user.role)}</TableCell>
                                <TableCell sx={{ color: '#fff', py: 2, px: 3, fontSize: 14 }}>{formatLastLogin(user.lastLoginAt)}</TableCell>
                                <TableCell sx={{ color: '#fff', py: 2, px: 3, fontSize: 14 }}>{formatDate(user.createdAt)}</TableCell>
                                <TableCell sx={{ color: '#fff', py: 2, px: 3, fontSize: 14 }}>{formatDate(user.updatedAt)}</TableCell>
                                <TableCell sx={{ color: '#fff', py: 2, px: 3, fontSize: 14 }} align="center">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        {hasPermission(PERMISSIONS.USERS_UPDATE) && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(user)}
                                                sx={{ color: '#3b82f6', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' } }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                        {hasPermission(PERMISSIONS.USERS_DELETE) && (
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    if (user.role === 'super_admin') {
                                                        setAlertMessage('슈퍼 관리자는 삭제할 수 없습니다.');
                                                        setAlertOpen(true);
                                                    } else {
                                                        setDeleteTargetId(user.id);
                                                    }
                                                }}
                                                sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit/Add User Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: 1, bgcolor: '#1d1f22', boxShadow: 'none', border: '1px solid #232427', color: '#fff', p: 0 } }}
                TransitionProps={{ appear: true }}
            >
                <DialogContent sx={{ p: 3, pb: 2, bgcolor: '#1d1f22' }}>
                    <Typography variant="h6" fontWeight={700} mb={1.5} color="#60a5fa" sx={{ letterSpacing: -0.5 }}>
                        {editingUser ? '사용자 수정' : '새 사용자 추가'}
                    </Typography>
                    <Box component="form" autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="사용자명"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                            fullWidth
                            required
                            variant="standard"
                            InputProps={{ disableUnderline: true, sx: { borderRadius: 1, bgcolor: '#232427', color: '#fff', px: 2, py: 1.2, fontSize: 16 } }}
                            InputLabelProps={{ sx: { color: '#b6c2e1', fontSize: 15 } }}
                        />
                        <TextField
                            label={editingUser ? "새 비밀번호 (변경시에만 입력)" : "비밀번호"}
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            fullWidth
                            required={!editingUser}
                            variant="standard"
                            InputProps={{ disableUnderline: true, sx: { borderRadius: 1, bgcolor: '#232427', color: '#fff', px: 2, py: 1.2, fontSize: 16 } }}
                            InputLabelProps={{ sx: { color: '#b6c2e1', fontSize: 15 } }}
                        />
                        <TextField
                            select
                            label="권한"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            fullWidth
                            required
                            variant="standard"
                            InputProps={{ disableUnderline: true, sx: { borderRadius: 1, bgcolor: '#232427', color: '#fff', px: 2, py: 1.2, fontSize: 16 } }}
                            InputLabelProps={{ sx: { color: '#b6c2e1', fontSize: 15 } }}
                        >
                            <MenuItem value="super_admin">슈퍼 관리자</MenuItem>
                            <MenuItem value="admin">관리자</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#1d1f22', px: 3, pb: 2, pt: 0, gap: 1, borderTop: '1px solid #232427' }}>
                    <Button onClick={handleCloseDialog} sx={{ color: '#b6c2e1', borderRadius: 1, minWidth: 0, px: 2, fontWeight: 500, fontSize: 15 }} disableElevation>취소</Button>
                    <Button
                        onClick={handleSubmit}
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
                            '&:hover': { bgcolor: '#3b82f6' }
                        }}
                        disabled={loading}
                    >
                        {editingUser ? <EditIcon sx={{ fontSize: 18, mr: 0.5 }} /> : <AddIcon sx={{ fontSize: 18, mr: 0.5 }} />}
                        {editingUser ? '수정' : '추가'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete User Confirm Dialog */}
            <Dialog open={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: 1, bgcolor: '#1d1f22', boxShadow: 'none', border: '1px solid #232427', color: '#fff', p: 0 } }}
                TransitionProps={{ appear: true }}
            >
                <DialogContent sx={{ p: 3, bgcolor: '#1d1f22', textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <DeleteIcon sx={{ color: '#ef4444', fontSize: 28, mr: 1 }} />
                        <Typography variant="h6" fontWeight={700} color="#ef4444" sx={{ letterSpacing: -0.5 }}>
                            사용자 삭제
                        </Typography>
                    </Box>
                    <Typography mb={2} color="#b6c2e1" fontSize={15}>
                        정말로 이 사용자를 삭제하시겠습니까?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button onClick={() => setDeleteTargetId(null)} sx={{ color: '#b6c2e1', borderRadius: 1, minWidth: 0, px: 2, fontWeight: 500, fontSize: 15 }} disableElevation>취소</Button>
                        <Button
                            onClick={() => {
                                if (deleteTargetId !== null) {
                                    const id = deleteTargetId;
                                    setDeleteTargetId(null);
                                    handleDelete(id);
                                }
                            }}
                            variant="contained"
                            disableElevation
                            sx={{
                                bgcolor: '#ef4444',
                                color: 'white',
                                borderRadius: 1,
                                fontWeight: 700,
                                px: 3,
                                fontSize: 15,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#b91c1c' }
                            }}
                        >
                            삭제
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* 안내 알림 팝업 (슈퍼 어드민 삭제 불가) */}
            <Dialog open={alertOpen} onClose={() => setAlertOpen(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: 1, bgcolor: '#1d1f22', boxShadow: 'none', border: '1px solid #232427', color: '#fff', p: 0 } }}
            >
                <DialogContent sx={{ p: 3, bgcolor: '#1d1f22', textAlign: 'left' }}>
                    <Typography fontWeight={600} color="#ef4444" sx={{ mb: 1 }}>
                        {alertMessage}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={() => setAlertOpen(false)} sx={{ color: '#b6c2e1', borderRadius: 1, minWidth: 0, px: 2, fontWeight: 500, fontSize: 15 }} disableElevation>확인</Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Alert 컴포넌트 추가 (에러 발생 시) */}
            {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2, width: '100%', fontSize: 15, p: 1.2, textAlign: 'left' }}>{error}</Alert>
            )}
        </Box>
    );
};

export default UserManagement; 