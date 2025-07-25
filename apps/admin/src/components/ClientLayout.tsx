'use client';
import { usePathname } from 'next/navigation';
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith('/login');
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {!isLogin && <Sidebar username="sysadmin" />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!isLogin && <Header />}
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
