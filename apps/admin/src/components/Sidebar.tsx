'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const menuItems = [
  { label: '대시보드', path: '/dashboard', icon: null },
  { label: '사용자 관리', path: '/users', icon: null },
  { label: '카테고리 관리', path: '/categories', icon: null },
  { label: '게시물 관리', path: '/posts', icon: null },
  { label: '메인비주얼 관리', path: '/main-visual', icon: null },
  { label: '요금제 관리', path: '/plans', icon: null },
  { label: '문의 관리', path: '/inquiries', icon: null },
  { label: '기능 추가 요청', path: '/feature-request', section: 'bottom', icon: null },
  { label: '공지 사항', path: '/notice', section: 'bottom', icon: null },
];

export default function Sidebar({ username }: { username: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const firstLetter = username ? username[0].toUpperCase() : '?';
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const getMenuItemStyle = (item: any, isHovered: boolean, isActive: boolean) => ({
    padding: '10px 24px',
    color: isActive ? '#e24' : isHovered ? '#e24' : '#fff',
    fontWeight: isActive ? 700 : 400,
    cursor: 'pointer',
    background: isActive ? 'rgba(226,36,68,0.08)' : isHovered ? 'rgba(226,36,68,0.04)' : 'none',
    borderLeft: isActive ? '4px solid #e24' : '4px solid transparent',
    transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
    userSelect: 'none' as const,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  });

  return (
    <aside
      style={{
        width: 220,
        background: '#232226',
        color: '#fff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        boxSizing: 'border-box',
        borderRight: '1px solid #63676F', // 변경: 외각선 색상
      }}
    >
      {/* Top: Avatar and menu */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px 32px 24px' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {firstLetter}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 24, color: '#aaa', cursor: 'pointer' }}>⋯</div>
      </div>
      {/* Menu */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {menuItems
          .filter((m) => m.section !== 'bottom')
          .map((item, idx) => {
            const isActive = pathname === item.path;
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={item.path}
                onClick={() => router.push(item.path)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={getMenuItemStyle(item, isHovered, isActive)}
              >
                {item.icon && (
                  <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                )}
                <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
              </div>
            );
          })}
        <div style={{ borderTop: '1px solid #333', margin: '18px 0 0 0' }} />
        {menuItems
          .filter((m) => m.section === 'bottom')
          .map((item, idx) => {
            const realIdx = idx + 100;
            const isActive = pathname === item.path;
            const isHovered = hoveredIdx === realIdx;
            return (
              <div
                key={item.path}
                onClick={() => router.push(item.path)}
                onMouseEnter={() => setHoveredIdx(realIdx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  ...getMenuItemStyle(item, isHovered, isActive),
                  color: isActive ? '#fff' : isHovered ? '#e24' : '#ccc',
                  background: isActive
                    ? 'rgba(255,255,255,0.06)'
                    : isHovered
                      ? 'rgba(226,36,68,0.04)'
                      : 'none',
                }}
              >
                {item.icon && (
                  <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                )}
                <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
              </div>
            );
          })}
      </nav>
    </aside>
  );
}
