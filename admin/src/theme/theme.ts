import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material';

const fontFamily = [
    'Pretendard',
    'Roboto',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Segoe UI',
    'Arial',
    'sans-serif',
].join(', ');

const darkThemeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#60a5fa',
            light: '#93c5fd',
            dark: '#3b82f6',
        },
        secondary: {
            main: '#64748b',
            light: '#94a3b8',
            dark: '#334155',
        },
        background: {
            default: '#0e0f10',
            paper: '#18191B',
        },
        divider: 'rgba(255,255,255,0.08)',
        text: {
            primary: '#fff',
            secondary: '#b0b0b0',
            disabled: '#555',
        },
        error: { main: '#ef4444' },
        warning: { main: '#f59e42' },
        info: { main: '#60a5fa' },
        success: { main: '#22c55e' },
    },
    typography: {
        fontFamily,
        h1: { fontWeight: 800 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        button: { fontWeight: 600, letterSpacing: 0.5 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'Pretendard';
          font-style: normal;
          font-weight: 400;
          src: url('https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable.woff2') format('woff2');
        }
        html, body {
          font-family: ${fontFamily};
          background: #0e0f10;
        }
      `,
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: '#0e0f10',
                    color: '#fff',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: '#0e0f10',
                    color: '#fff',
                    borderRight: '1px solid rgba(255,255,255,0.08)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    color: '#fff',
                    background: '#18191B',
                    '&:hover': {
                        background: '#232427',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)',
                    color: '#fff',
                    '&:hover': {
                        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: '#18191B',
                    boxShadow: '0 1px 4px 0 #00000033',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    background: '#18191B',
                    fontWeight: 700,
                    color: '#fff',
                },
                body: {
                    color: '#fff',
                    fontSize: 15,
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#60a5fa',
                    height: 3,
                    borderRadius: 2,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: 16,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    background: '#18191B',
                    color: '#fff',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    background: '#18191B',
                    color: '#fff',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#60a5fa',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#60a5fa',
                    },
                },
                notchedOutline: {
                    borderColor: 'rgba(255,255,255,0.08)',
                },
            },
        },
        MuiSnackbarContent: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                    fontSize: 15,
                    background: '#18191B',
                    color: '#fff',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#fff',
                    borderRadius: 8,
                    '&:hover': {
                        background: '#232427',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    background: '#18191B',
                    color: '#fff',
                    borderRadius: 8,
                },
            },
        },
    },
};

export const darkTheme = createTheme(darkThemeOptions);
export const lightTheme = darkTheme; 