import './SideNav.scss';

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="header-mobile">
      <div className="header-mobile__profile">Gi</div>
      <button className="header-mobile__menu" onClick={onMenuClick} aria-label="메뉴 열기">
        <svg
          width="24"
          height="24"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="7" width="32" height="2.5" rx="1.25" fill="#fff" />
          <rect y="14.5" width="32" height="2.5" rx="1.25" fill="#fff" />
          <rect y="22" width="32" height="2.5" rx="1.25" fill="#fff" />
        </svg>
      </button>
    </header>
  );
}

export default Header;
