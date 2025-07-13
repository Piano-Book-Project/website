import React, { useState } from 'react';
import {
    Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, DialogActions, TextField, Checkbox, InputAdornment, Menu as MuiMenu, MenuItem as MuiMenuItem
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { usePermissions, PERMISSIONS } from '../hooks/usePermissions';
import api from '../utils/api';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

// Mock data for board sections
const boardSections = [
    {
        label: '공지 사항',
        rows: [
            { id: 1, name: '사내 소식', owner: 'NAVER CLOUD', count: 10, permission: '공개', type: '미리보기형' },
            { id: 2, name: '서비스 소식', owner: 'NAVER CLOUD', count: 30, permission: '공개', type: '열람형' },
            { id: 3, name: '점검사', owner: 'NAVER CLOUD', count: 50, permission: '멤버', type: '게시판형' },
        ],
    },
    {
        label: '서비스',
        rows: [
            { id: 4, name: '아이디의 제한', owner: 'NAVER CLOUD', count: 10, permission: '공개', type: '미리보기형' },
        ],
    },
];

const tabList = [
    '일반',
    '홈 화면 관리',
    '게시판 관리',
    '게시글 정리',
    '게시글 백업',
];

const AccountManagement: React.FC = () => {
    const [tab, setTab] = useState(2); // 게시판 관리
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const { hasPermission } = usePermissions();

    // 검색/필터 적용
    const filteredSections = useState(() => {
        if (!search) return boardSections;
        return boardSections
            .map(section => ({
                ...section,
                rows: section.rows.filter(row => row.name.includes(search)),
            }))
            .filter(section => section.rows.length > 0);
    })[0];

    // 체크박스
    const allRows = filteredSections.flatMap(section => section.rows);
    const handleSelectAll = (checked: boolean) => {
        setSelected(checked ? allRows.map(r => r.id) : []);
    };
    const handleSelect = (id: number) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };

    // 더보기 메뉴
    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#181a20', p: 0 }}>
            {/* 상단 탭 메뉴 */}
            <Box sx={{ borderBottom: 1, borderColor: '#e5e7eb', bgcolor: '#fff', px: 4, pt: 2 }}>
                {/* Tabs component was removed from imports, so this will cause an error */}
                {/* <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ minHeight: 48 }}>
                    {tabList.map((label, idx) => (
                        <Tab key={label} label={label} sx={{ fontWeight: 600, color: tab === idx ? '#2563eb' : '#64748b', minWidth: 120, fontSize: 16 }} />
                    ))}
                </Tabs> */}
            </Box>
            {/* 상단 액션바 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 4, py: 2, bgcolor: '#181a20', borderBottom: 0 }}>
                <TextField
                    size="small"
                    placeholder="게시판명 검색"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    sx={{
                        minWidth: 220, bgcolor: '#232427', borderRadius: 1, mr: 2, color: '#fff',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            bgcolor: '#232427',
                            color: '#fff',
                            border: 'none',
                            fontSize: 15,
                        },
                        '& .MuiInputBase-input': { color: '#fff' },
                        '& .MuiInputLabel-root': { color: '#b6c2e1' }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MoreVertIcon sx={{ color: '#60a5fa' }} />
                            </InputAdornment>
                        ),
                        style: { fontSize: 15 },
                    }}
                />
                <Button variant="contained" sx={{ fontWeight: 700, bgcolor: '#60a5fa', color: '#fff', borderRadius: 1, boxShadow: 'none', ml: 1, px: 3, py: 1.2, fontSize: 15, '&:hover': { bgcolor: '#3b82f6' } }}>
                    게시판 추가
                </Button>
            </Box>
            {/* 게시판 테이블 */}
            <Box sx={{ px: 4, py: 3, bgcolor: '#181a20', minHeight: 600 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 'none', bgcolor: '#141517', border: '1px solid #232427', overflow: 'visible' }}>
                    <Table sx={{ minWidth: 900, bgcolor: '#141517' }}>
                        <TableHead>
                            <TableRow sx={{ background: '#232427' }}>
                                <TableCell padding="checkbox" sx={{ width: 48, color: '#b6c2e1', fontWeight: 700, fontSize: 15, borderBottom: '1px solid #35373d' }}>
                                    <Checkbox
                                        color="primary"
                                        checked={selected.length === allRows.length && allRows.length > 0}
                                        indeterminate={selected.length > 0 && selected.length < allRows.length}
                                        onChange={e => handleSelectAll(e.target.checked)}
                                        sx={{ color: '#60a5fa' }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#b6c2e1', fontSize: 15, borderBottom: '1px solid #35373d' }}>게시판명</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#b6c2e1', fontSize: 15, borderBottom: '1px solid #35373d' }}>소유 도메인</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#b6c2e1', fontSize: 15, borderBottom: '1px solid #35373d' }}>게시글 수</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#b6c2e1', fontSize: 15, borderBottom: '1px solid #35373d' }}>권한</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#b6c2e1', fontSize: 15, borderBottom: '1px solid #35373d' }}>게시판 타입</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSections.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ color: '#64748b', py: 8, fontSize: 18, fontWeight: 500 }}>
                                        등록된 게시판이 없습니다
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredSections.map(section => [
                                    <TableRow key={section.label} sx={{ bgcolor: '#232427' }}>
                                        <TableCell colSpan={6} sx={{ fontWeight: 700, color: '#60a5fa', fontSize: 15, borderBottom: 'none', py: 2, bgcolor: '#232427' }}>{section.label}</TableCell>
                                    </TableRow>,
                                    ...section.rows.map(row => (
                                        <TableRow key={row.id} hover selected={selected.includes(row.id)} sx={{ '&:hover': { bgcolor: '#232942' }, bgcolor: '#141517' }}>
                                            <TableCell padding="checkbox">
                                                <Checkbox color="primary" checked={selected.includes(row.id)} onChange={() => handleSelect(row.id)} sx={{ color: '#60a5fa' }} />
                                            </TableCell>
                                            <TableCell sx={{ color: '#fff', fontWeight: 500 }}>{row.name}</TableCell>
                                            <TableCell sx={{ color: '#b6c2e1' }}>{row.owner}</TableCell>
                                            <TableCell sx={{ color: '#b6c2e1' }}>{row.count}</TableCell>
                                            <TableCell sx={{ color: '#b6c2e1' }}>{row.permission}</TableCell>
                                            <TableCell sx={{ color: '#b6c2e1' }}>{row.type}</TableCell>
                                        </TableRow>
                                    ))
                                ])
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default AccountManagement; 