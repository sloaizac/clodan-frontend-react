import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <img
          // eslint-disable-next-line no-undef
          src={window.location.origin + '/R4.png'}
          alt="CLODAN"
          style={{ width: 200 }}
        />
        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link
              to="/"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/calendar"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Agendar
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/profile"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Perfil
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
