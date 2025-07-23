import { useLocation, useNavigate } from 'react-router-dom';

export const MENU_LIST = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Piano Books', path: '/piano-books' },
  { name: 'Price', path: '/price' },
  { name: 'Contact Us', path: '/contact' },
];

export function useSideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const handleMenuClick = (path: string) => {
    if (activePath !== path) navigate(path);
  };

  return {
    menuList: MENU_LIST,
    activePath,
    handleMenuClick,
  };
}
