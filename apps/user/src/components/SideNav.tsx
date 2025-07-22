import './SideNav.scss';

export default function SideNav() {
  return (
    <nav className="side-nav">
      <div className="side-nav__top">
        <div className="side-nav__profile">Gi</div>
        <div className="side-nav__more">&#8942;</div>
      </div>
      <ul className="side-nav__menu">
        <li className="active">Home</li>
        <li>About Us</li>
        <li>Piano Books</li>
        <li>Price</li>
        <li>Contact Us</li>
      </ul>
    </nav>
  );
}
