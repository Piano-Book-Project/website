import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import UserAdd from './pages/UserAdd';
import AccountManagement from './pages/AccountManagement';
import CategoryManagement from './pages/CategoryManagement';
import CategoryAdd from './pages/CategoryAdd';
import PostManagement from './pages/PostManagement';
import InquiryManagement from './pages/InquiryManagement';
import InquiryRespond from './pages/InquiryRespond';
import PricingManagement from './pages/PricingManagement';
import PricingAdd from './pages/PricingAdd';
import AdminLayout from './pages/Layout';
import { useAuth } from './hooks/useAuth';
import { detectDevTools, setupAutoLogout, setupVisibilityChangeHandler } from './utils/security';

// 다크 테마 설정
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa',
    },
    secondary: {
      main: '#f59e0b',
    },
    background: {
      default: '#0e0f10',
      paper: '#141517',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b7280 #1f2937",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#1f2937",
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b7280",
            minHeight: 24,
            border: "2px solid #1f2937",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#9ca3af",
          },
        },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 보호된 라우트 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      checkAuth();
    }
  }, [loading, isAuthenticated, checkAuth]);

  console.log('ProtectedRoute:', { isAuthenticated, loading, pathname: location.pathname });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// 로그인 리다이렉트 컴포넌트
const LoginRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
};

const App: React.FC = () => {
  useEffect(() => {
    // 보안 기능 초기화
    detectDevTools();
    const cleanupAutoLogout = setupAutoLogout(30); // 30분 후 자동 로그아웃
    const cleanupVisibilityHandler = setupVisibilityChangeHandler();

    // 페이지 로드 시 보안 경고
    console.log('%c⚠️ 보안 경고', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%c이 브라우저는 개발자만을 위한 것입니다. 다른 사람이 이 콘솔을 열도록 하지 마세요.', 'color: red; font-size: 14px;');

    return () => {
      cleanupAutoLogout();
      cleanupVisibilityHandler();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginRedirect />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/users/add" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <UserAdd />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/accounts" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AccountManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/categories" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CategoryManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/categories/add" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CategoryAdd />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/posts" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <PostManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/inquiries" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <InquiryManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/inquiries/respond/:id" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <InquiryRespond />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/pricing" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <PricingManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/pricing/add" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <PricingAdd />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
