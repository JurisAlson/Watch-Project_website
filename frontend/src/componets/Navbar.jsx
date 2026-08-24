import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="site-navbar">

      <div className="navbar-inner">

        {/* BRAND */}
        <Link to="/" className="navbar-logo">
          WATCHPROJECT
        </Link>


        {/* NAVIGATION */}
        <nav className="navbar-links">

          <Link
            to="/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            HOME
          </Link>

          <Link
            to="/catalog"
            className={`navbar-link ${isActive('/catalog') ? 'active' : ''}`}
          >
            CATALOG
          </Link>

          <Link
            to="/about"
            className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
          >
            ABOUT
          </Link>

        </nav>


        {/* RIGHT SIDE */}
        <div className="navbar-right">

          <a
            href="https://m.me/YOUR_PAGE_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-contact"
          >
            INQUIRE
          </a>

        </div>

      </div>

    </header>
  );
}

export default Navbar;