import React, { useState, useEffect } from 'react';
import PlayerBar from './features/player/components/PlayerBar';
import SideNav from './components/SideNav';
import Header from './components/Header';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // 767px 이하 여부 체크
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 767;

  // 모바일 반응형 대응 (SSR/CSR 모두 안전하게)
  const [mobile, setMobile] = useState(isMobile);
  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth <= 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 메뉴 오픈 시 showMenu true로
  useEffect(() => {
    if (menuOpen) setShowMenu(true);
  }, [menuOpen]);

  // 오버레이 클릭 시 메뉴 닫힘 (애니메이션 후 showMenu false)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setMenuOpen(false);
      setTimeout(() => setShowMenu(false), 300); // 애니메이션 시간과 맞춤
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#171719' }}>
      {mobile ? (
        <>
          <Header
            onMenuClick={() => {
              setMenuOpen(true);
              setShowMenu(true);
            }}
          />
          {showMenu && (
            <div
              className={`side-nav__overlay${menuOpen ? '' : ' closing'}`}
              onClick={handleOverlayClick}
            >
              <SideNav isMobile open={menuOpen} />
            </div>
          )}
        </>
      ) : (
        <SideNav />
      )}
      <PlayerBar />
    </div>
  );
}

export default App;
