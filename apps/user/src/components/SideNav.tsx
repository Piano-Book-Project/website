import { useSideNav } from '../hooks/useSideNav';

interface SideNavProps {
  isMobile?: boolean;
  open?: boolean;
}

export default function SideNav({ isMobile = false, open = false }: SideNavProps) {
  const { menuList, activePath, handleMenuClick } = useSideNav();
  return (
    <nav className={`side-nav${isMobile ? ' side-nav--mobile' : ''}${open ? ' open' : ''}`}>
      <div className="side-nav__top">
        <div className="side-nav__profile">Gi</div>
        <div className="side-nav__more">&#8942;</div>
      </div>
      <ul className="side-nav__menu">
        {menuList.map((menu) => (
          <li
            key={menu.path}
            className={activePath === menu.path ? 'active' : ''}
            onClick={() => handleMenuClick(menu.path)}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleMenuClick(menu.path)}
            role="button"
            aria-current={activePath === menu.path ? 'page' : undefined}
          >
            {menu.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
