'use client';
import React, { useState, useRef } from 'react';

// Heroicons ChevronDown SVG
// const ChevronDownIcon = (
//   <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
//     <path stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
//   </svg>
// );

const LOGO_URL =
  'https://ssl.pstatic.net/static/nng/glive/resource/p/static/media/logo_light.530b4d8f04d5671f2465.gif';

export default function AdminLogin() {
  const [step, setStep] = useState<'id' | 'pw'>('id');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pwInputRef = useRef<HTMLInputElement>(null);

  // 아이디 정규식: 영문/숫자 4~20자
  const idValid = /^[a-zA-Z0-9]{4,20}$/.test(id);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (step === 'id') {
      if (!idValid) {
        setError('올바른 아이디를 입력하세요.');
        return;
      }
      setStep('pw');
      setTimeout(() => pwInputRef.current?.focus(), 100);
    } else {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, pw }),
          credentials: 'include', // 쿠키 저장을 위해 추가
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
          window.location.href = '/dashboard';
        } else {
          setError(data.error || '아이디 또는 비밀번호가 틀립니다.');
        }
      } catch {
        setLoading(false);
        setError('아이디 또는 비밀번호가 틀립니다.');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#171719',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 861,
          height: 332,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#23232b',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        <form
          onSubmit={handleNext}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: 0,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            boxShadow: 'none',
            borderRadius: 0,
            padding: 0,
            position: 'static',
          }}
        >
          {/* 왼쪽: 로그인 그룹 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              paddingLeft: 24,
            }}
          >
            {/* 로고 */}
            <div style={{ marginBottom: 0 }}>
              <img src={LOGO_URL} alt="로고" style={{ width: 100, display: 'block' }} />
            </div>
            {/* 로그인 flex row */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 18,
                marginBottom: 0,
                padding: 18,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', padding: 0, margin: 0 }}>
                로그인
              </div>
            </div>
            {/* 설명 */}
            <div
              style={{ color: '#bbb', fontSize: 15, lineHeight: 1.6, marginBottom: 0, padding: 18 }}
            >
              어드민 계정으로 로그인합니다.
              <br />이 계정은 관리자 전용이며, 권한이 부여된 사용자만 접근할 수 있습니다.
            </div>
          </div>
          {/* 오른쪽: 입력+버튼 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 32,
              paddingRight: 24,
              minWidth: 260,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 260,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                minHeight: 260,
                paddingBottom: 48,
                justifyContent: 'center',
              }}
            >
              {/* 아이디 인풋 + 비밀번호 + 아이디를 잊으셨나요 그룹 */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingLeft: 24,
                  paddingRight: 24,
                  rowGap: 8,
                }}
              >
                <input
                  type="text"
                  placeholder="아이디"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                    setError('');
                    if (e.target.value.length >= 1) setStep('pw');
                    else setStep('id');
                  }}
                  disabled={step === 'pw' && loading}
                  style={{
                    width: 324,
                    padding: '1.1em 1em',
                    borderRadius: 8,
                    border: '1px solid #8E918F',
                    background: '#19191f',
                    color: '#fff',
                    fontSize: 16,
                    outline: 'none',
                    marginBottom: 0, // margin 0으로 변경
                    fontWeight: 500,
                    letterSpacing: 0.5,
                    boxSizing: 'border-box',
                    textAlign: 'left',
                  }}
                />
                <input
                  ref={pwInputRef}
                  type="password"
                  placeholder="비밀번호"
                  value={pw}
                  onChange={(e) => {
                    setPw(e.target.value);
                    setError('');
                  }}
                  style={{
                    width: 324,
                    padding: '1.1em 1em',
                    borderRadius: 8,
                    border: '1px solid #8E918F',
                    background: '#19191f',
                    color: '#fff',
                    fontSize: 16,
                    outline: 'none',
                    marginBottom: 0, // margin 0으로 변경
                    fontWeight: 500,
                    letterSpacing: 0.5,
                    boxSizing: 'border-box',
                    textAlign: 'left',
                    display: id.length >= 1 ? 'block' : 'none',
                  }}
                />
              </div>
              {/* 에러 메시지 */}
              {error && (
                <div
                  style={{
                    color: '#ff5a5a',
                    fontSize: 14,
                    marginTop: 4,
                    marginBottom: 4,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: 324,
                  }}
                >
                  {error}
                </div>
              )}
              {/* 다음 버튼 */}
              <div
                style={{
                  width: 324,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  margin: '24 auto',
                  marginTop: 8,
                }}
              >
                <button
                  type="submit"
                  disabled={loading || id.length < 3 || (id.length >= 3 && !pw)}
                  style={{
                    minWidth: 80,
                    padding: '0.8em 2.2em',
                    borderRadius: 8,
                    background: '#7da2ff',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 16,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    opacity: loading || id.length < 3 || (id.length >= 3 && !pw) ? 0.6 : 1,
                    margin: 0, // Remove extra padding/margin from button wrapper
                  }}
                >
                  {loading ? '확인 중...' : '다음'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
