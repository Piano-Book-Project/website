'use client';
import { usePathname } from 'next/navigation';
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith('/login');

  return (
    <div className={`client-layout${isLogin ? ' client-layout--login' : ''}`}>
      {!isLogin && <Sidebar username="sysadmin" />}
      <div className="client-layout__main">
        {!isLogin && <Header />}
        <main className="client-layout__content">{children}</main>
      </div>
    </div>
  );
}
