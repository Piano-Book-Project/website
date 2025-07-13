import React, { useState } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, IconButton, ListItemButton, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';

const drawerWidth = 240;
const miniDrawerWidth = 72;

const menuItems = [
    { label: '사용자 관리', path: '/users' },
    { label: '카테고리 관리', path: '/categories' },
    { label: '게시물 관리', path: '/posts' },
    { label: '문의 관리', path: '/inquiries' },
    { label: '요금제 관리', path: '/pricing' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mini, setMini] = useState(false);
    const { user, logout } = useAuth();
    const { canAccessMenu } = usePermissions();

    const drawerSpring = useSpring({
        width: mini ? miniDrawerWidth : drawerWidth,
        config: { tension: 300, friction: 30 }
    });
    const mainSpring = useSpring({
        marginLeft: 34,
        config: { tension: 300, friction: 30 }
    });
    const headerSpring = useSpring({
        width: `calc(100% - ${mini ? miniDrawerWidth : drawerWidth}px)`,
        marginLeft: mini ? miniDrawerWidth : drawerWidth,
        config: { tension: 300, friction: 30 }
    });

    // 권한에 따라 메뉴 필터링
    const filteredMenuItems = menuItems.filter(item => canAccessMenu(item.path));

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0e0f10' }}>
            {/* 사이드바 */}
            <animated.div style={drawerSpring}>
                <Drawer
                    variant="permanent"
                    open={!mini}
                    sx={{
                        width: mini ? miniDrawerWidth : drawerWidth,
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        boxSizing: 'border-box',
                        '& .MuiDrawer-paper': {
                            width: mini ? miniDrawerWidth : drawerWidth,
                            boxSizing: 'border-box',
                            borderRight: '1px solid #232427',
                            px: mini ? 0 : 1,
                            overflowX: 'hidden',
                            background: '#141517',
                            color: '#fff',
                            borderRadius: 0,
                        },
                    }}
                >
                    {/* 사이드바 Drawer 내 Toolbar도 색상 통일 */}
                    <Toolbar sx={{ minHeight: 48, justifyContent: mini ? 'center' : 'flex-end', px: 1, background: '#1d1f22', color: '#fff' }}>
                        <IconButton
                            onClick={() => setMini(!mini)}
                            size="small"
                            sx={{
                                color: '#fff',
                                borderRadius: 0,
                                '&:hover': {
                                    bgcolor: '#18191B',
                                    borderRadius: 0
                                }
                            }}
                        >
                            {mini ? <MenuIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </Toolbar>
                    <Divider sx={{ mb: 1, opacity: 0.6, borderColor: '#232427', background: '#141517' }} />
                    <List sx={{ flexGrow: 1 }}>
                        {filteredMenuItems.map((item) => (
                            <ListItem key={item.label} disablePadding sx={{ mb: 1, borderRadius: 0 }}>
                                <ListItemButton
                                    selected={location.pathname.startsWith(item.path)}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        borderRadius: 0,
                                        mx: 1,
                                        minHeight: 48,
                                        justifyContent: 'flex-start',
                                        px: 2,
                                        transition: 'background-color 0.2s ease',
                                        background: location.pathname.startsWith(item.path)
                                            ? '#232427'
                                            : 'transparent',
                                        color: location.pathname.startsWith(item.path) ? '#fff' : '#fff',
                                        '&:hover': {
                                            background: '#232427',
                                            borderRadius: 0,
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={item.label}
                                        sx={{
                                            fontWeight: location.pathname.startsWith(item.path) ? 700 : 400,
                                            fontSize: 15,
                                            color: location.pathname.startsWith(item.path) ? '#fff' : '#fff',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    {/* 로그아웃 버튼 */}
                    <Box sx={{ borderTop: '1px solid #232427', borderRadius: 0, background: '#141517' }}>
                        <ListItem disablePadding sx={{ borderRadius: 0 }}>
                            <ListItemButton
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                sx={{
                                    borderRadius: 0,
                                    mx: 1,
                                    minHeight: 48,
                                    justifyContent: 'flex-start',
                                    px: 2,
                                    transition: 'background-color 0.2s ease',
                                    color: '#fff',
                                    '&:hover': {
                                        background: '#18191B',
                                        color: '#60a5fa',
                                        borderRadius: 0,
                                    },
                                }}
                            >
                                <ListItemText
                                    primary="로그아웃"
                                    sx={{
                                        fontWeight: 400,
                                        fontSize: 15,
                                        color: '#fff',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Box>
                </Drawer>
            </animated.div>

            {/* 메인 컨텐츠 */}
            <animated.div style={mainSpring} className="main-content">
                <Box component="main" sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    bgcolor: '#0e0f10',
                    position: 'relative'
                }}>
                    {/* 상단 헤더 */}
                    <animated.div style={headerSpring}>
                        <AppBar
                            position="fixed"
                            elevation={0}
                            sx={{
                                zIndex: (theme) => theme.zIndex.drawer + 1,
                                background: '#1d1f22',
                                color: '#fff',
                                boxShadow: 'none',
                                borderBottom: '1px solid #232427',
                                minHeight: 48
                            }}
                        >
                            <Toolbar sx={{ minHeight: 48, background: '#1d1f22', color: '#fff', px: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    {/* 네이버 로고 */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <img
                                                src="https://ssl.pstatic.net/static/nng/glive/resource/p/static/media/logo_light.530b4d8f04d5671f2465.gif"
                                                alt="Logo"
                                                style={{
                                                    width: 120,
                                                    height: 'auto',
                                                    objectFit: 'contain',
                                                    display: 'block'
                                                }}
                                            />
                                        </Box>
                                    </motion.div>
                                </Box>
                                {/* 사용자 닉네임 표시 */}
                                {user?.nickname && (
                                    <Box sx={{ color: '#fff', fontWeight: 600, fontSize: 17, letterSpacing: 0.5, px: 2, py: 1, borderRadius: 1, bgcolor: 'rgba(36,40,48,0.7)' }}>
                                        {user.nickname}
                                    </Box>
                                )}
                            </Toolbar>
                        </AppBar>
                    </animated.div>
                    <Toolbar />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Box sx={{
                            px: 0,
                            pt: 0,
                            pb: 0,
                            width: '1600px',
                            maxWidth: '1600px',
                            margin: 0,
                            minHeight: 'calc(100vh - 64px)'
                        }}>
                            {children}
                        </Box>
                    </motion.div>
                </Box>
            </animated.div>
        </Box>
    );
};

export default AdminLayout; 