import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Fade,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
    { name: '1월', 월: 1200, 주: 300, 일: 50 },
    { name: '2월', 월: 1500, 주: 400, 일: 60 },
    { name: '3월', 월: 1800, 주: 500, 일: 70 },
    { name: '4월', 월: 2000, 주: 600, 일: 80 },
    { name: '5월', 월: 1700, 주: 550, 일: 75 },
    { name: '6월', 월: 2100, 주: 700, 일: 90 },
    { name: '7월', 월: 2300, 주: 800, 일: 100 },
];

const widgetStyle = {
    position: 'relative',
    height: 320,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(36,40,48,0.98)',
    borderRadius: 16,
    boxShadow: '0 4px 24px 0 #1e293b33',
    color: '#e0e7ef',
    p: 2,
    mt: 4,
    maxWidth: 900,
    margin: '0 auto',
};

const Dashboard: React.FC = () => {
    const [showActions, setShowActions] = useState(false);
    const [deleted, setDeleted] = useState(false);

    return (
        <>
            {/* 계정관리 설명 */}
            <Box sx={{ mb: 4, p: 3, bgcolor: '#232942', borderRadius: 3, boxShadow: '0 2px 12px 0 #1e293b33', color: '#e0e7ef' }}>
                <Typography variant="h6" fontWeight={700} color="#60a5fa" mb={1}>계정관리</Typography>
                <Typography variant="body1" color="#b6c2e1">
                    관리자 계정추가, ID/PW 설정 및 접근 권한을 관리할 수 있습니다.
                </Typography>
            </Box>
            {deleted ? (
                <Box sx={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h5" color="#60a5fa">위젯이 삭제되었습니다.</Typography>
                </Box>
            ) : (
                <Card
                    sx={widgetStyle}
                    onMouseEnter={() => setShowActions(true)}
                    onMouseLeave={() => setShowActions(false)}
                    onClick={() => setShowActions((v) => !v)}
                >
                    <CardContent sx={{ width: '100%', height: 240 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            접속자 (월/주/일) 추이
                        </Typography>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorWeek" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorDay" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#b6c2e1" fontSize={13} />
                                <YAxis stroke="#b6c2e1" fontSize={13} width={40} />
                                <Tooltip contentStyle={{ background: '#232942', border: 'none', color: '#fff' }} />
                                <Area type="monotone" dataKey="월" stroke="#60a5fa" fillOpacity={1} fill="url(#colorMonth)" name="월" />
                                <Area type="monotone" dataKey="주" stroke="#34d399" fillOpacity={1} fill="url(#colorWeek)" name="주" />
                                <Area type="monotone" dataKey="일" stroke="#fbbf24" fillOpacity={1} fill="url(#colorDay)" name="일" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <Fade in={showActions}>
                        <Box sx={{ position: 'absolute', top: 12, right: 16, display: 'flex', gap: 1 }}>
                            <IconButton size="small" color="primary" sx={{ bgcolor: '#232942' }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" sx={{ bgcolor: '#232942' }} onClick={() => setDeleted(true)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Fade>
                </Card>
            )}
        </>
    );
};

export default Dashboard; 