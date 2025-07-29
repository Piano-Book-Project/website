'use client';
import React, { useEffect } from 'react';

export default function InquiriesPage() {
  // 메타태그 설정
  useEffect(() => {
    // 컴포넌트가 마운트된 후에만 메타태그 설정
    const timer = setTimeout(() => {
      try {
        // setPageMeta({
        //   title: '문의 관리 - Admin Dashboard',
        //   description: '문의 등록, 수정, 관리 기능',
        //   keywords: ['admin', 'inquiries', 'management', '문의'],
        //   openGraph: [
        //     { property: 'og:title', content: '문의 관리 - Admin Dashboard' },
        //     { property: 'og:description', content: '문의 등록, 수정, 관리 기능' },
        //     { property: 'og:type', content: 'website' },
        //   ],
        // });
      } catch (error) {
        console.warn('Failed to set page meta:', error);
      }
    }, 100);

    // Cleanup: 컴포넌트 언마운트 시 기본 메타태그로 복원
    return () => {
      clearTimeout(timer);
      try {
        // setDefaultMeta();
      } catch (error) {
        console.warn('Failed to set default meta:', error);
      }
    };
  }, []);

  return (
    <div style={{ color: '#fff', fontSize: 32, padding: 40 }}>문의 관리 페이지 (개발 예정)</div>
  );
}
