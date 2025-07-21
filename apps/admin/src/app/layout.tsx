import React from 'react';
import '../styles/global.scss';

export const metadata = {
  title: '김츄츄의 피아노책',
  description:
    '김츄츄가 연주하는 다양한 피아노 커버를 소개하는 페이지입니다. 김츄츄의 음악을 사랑하는 분들을 위한 공간입니다.',
  keywords: ['피아노', '커버', '연주', '음악', '김츄츄', 'Piano', 'Cover', 'Music'],
  authors: [{ name: '김츄츄' }],
  robots: 'index, follow',
  openGraph: {
    title: '김츄츄의 피아노책',
    description: '다양한 피아노 커버를 감상하세요.',
    type: 'website',
    url: 'https://your-domain.com/',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '김츄츄의 피아노책',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '김츄츄의 피아노책',
    description: '다양한 피아노 커버를 감상하세요.',
    images: ['https://your-domain.com/og-image.jpg'],
  },
  icons: {
    icon: '/ci.ico',
  },
  themeColor: '#1F1F22',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ background: '#171719', minHeight: '100vh' }}>{children}</body>
    </html>
  );
}
