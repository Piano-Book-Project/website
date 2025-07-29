'use client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

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

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  return (
    <aside className="sidebar">
      {/* Top: Avatar and menu */}
      <div className="sidebar__header">
        <div className="sidebar__avatar">{firstLetter}</div>
        <div className="sidebar__spacer" />
        <div className="sidebar__menu-button">⋯</div>
      </div>

      {/* Menu */}
      <nav className="sidebar__nav">
        {menuItems
          .filter((m) => m.section !== 'bottom')
          .map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => handleMenuClick(item.path)}
                className={`sidebar__menu-item${isActive ? ' active' : ''}`}
              >
                {item.icon && <span className="sidebar__menu-item__icon">{item.icon}</span>}
                <span className="sidebar__menu-item__label">{item.label}</span>
              </div>
            );
          })}

        <div className="sidebar__divider" />

        {menuItems
          .filter((m) => m.section === 'bottom')
          .map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => handleMenuClick(item.path)}
                className={`sidebar__bottom-menu-item${isActive ? ' active' : ''}`}
              >
                {item.icon && <span className="sidebar__bottom-menu-item__icon">{item.icon}</span>}
                <span className="sidebar__bottom-menu-item__label">{item.label}</span>
              </div>
            );
          })}
      </nav>
    </aside>
  );
}
