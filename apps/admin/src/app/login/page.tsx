'use client';
import React, { useState, useRef } from 'react';

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
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleNext} className="login-form">
          {/* 왼쪽: 로그인 그룹 */}
          <div className="login-left">
            {/* 로고 */}
            <div className="login-left__logo">
              <img src={LOGO_URL} alt="로고" />
            </div>
            {/* 로그인 flex row */}
            <div className="login-left__title">
              <h1>로그인</h1>
            </div>
            {/* 설명 */}
            <div className="login-left__description">
              어드민 계정으로 로그인합니다.
              <br />이 계정은 관리자 전용이며, 권한이 부여된 사용자만 접근할 수 있습니다.
            </div>
          </div>
          {/* 오른쪽: 입력+버튼 */}
          <div className="login-right">
            <div className="login-right__content">
              {/* 아이디 인풋 + 비밀번호 + 버튼 그룹 */}
              <div className="login-right__input-group">
                <input
                  type="text"
                  placeholder="아이디"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                    setError('');
                    // 아이디에 문자가 입력되면 바로 비밀번호 필드 표시
                    if (e.target.value.length > 0) {
                      setStep('pw');
                    } else {
                      setStep('id');
                    }
                  }}
                  disabled={loading}
                  className="login-right__input"
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
                  className={`login-right__input login-right__password-input ${
                    id.length >= 1 ? 'visible' : ''
                  }`}
                />
                {/* 다음 버튼 */}
                <div className="login-right__button-container">
                  <button
                    type="submit"
                    disabled={loading || !id || !pw}
                    className="login-right__submit-button"
                  >
                    {loading ? '확인 중...' : '다음'}
                  </button>
                </div>
              </div>
              {/* 에러 메시지 */}
              {error && <div className="login-right__error">{error}</div>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
