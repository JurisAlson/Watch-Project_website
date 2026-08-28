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
            className={`navbar-link ${
              isActive('/') ? 'active' : ''
            }`}
          >
            HOME
          </Link>

          <Link
            to="/catalog"
            className={`navbar-link ${
              isActive('/catalog') ? 'active' : ''
            }`}
          >
            CATALOG
          </Link>

          <Link
            to="/about"
            className={`navbar-link ${
              isActive('/about') ? 'active' : ''
            }`}
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

          {/* PRIVATE ACCESS */}
          <Link
            to="/admin/login"
            className="navbar-admin"
            title="Private Access"
            aria-label="Private Access"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="15"
                r="4"
              />

              <path
                d="M11 12l9-9"
              />

              <path
                d="M17 6l2 2"
              />

              <path
                d="M14 9l2 2"
              />
            </svg>
          </Link>
        </div>

      </div>

    </header>
  );
}

export default Navbar;