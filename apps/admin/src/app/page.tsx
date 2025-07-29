'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 루트 페이지에서 대시보드로 리다이렉션
    router.push('/dashboard');
  }, [router]);

  return null; // 리다이렉션 중에는 아무것도 렌더링하지 않음
}
// Test comment
