'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const pageNameMap: Record<string, string> = {
  '/dashboard': '대시보드',
  '/users': '사용자 관리',
  '/categories': '카테고리 관리',
  '/posts': '게시물 관리',
  '/main-visual': '메인비주얼 관리',
  '/plans': '요금제 관리',
  '/inquiries': '문의 관리',
  '/feature-request': '기능 추가 요청',
  '/notice': '공지 사항',
};

function getPageName(path: string) {
  return pageNameMap[path] ?? '';
}

export default function Header() {
  const pathname = usePathname();
  const [time, setTime] = useState('');

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hh}:${mm}:${ss}`);
    }
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const pageName = getPageName(pathname);

  return (
    <header
      style={{
        width: '100%',
        background: '#232226',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        fontSize: 18,
        fontWeight: 400,
        borderBottom: '1px solid #63676F', // 변경: 외각선 색상
        boxSizing: 'border-box',
        zIndex: 10,
      }}
    >
      <div>{pageName}</div>
      <div style={{ color: '#ccc', fontSize: 16 }}>{time}</div>
    </header>
  );
}
