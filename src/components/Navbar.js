/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useAlert } from '../AlertContext';

const Navbar = ({ is_admin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAlert();

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
          {!is_admin ? (
            <>
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
                  to="/beneficiaries"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Beneficiarios
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/pqrsdf"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  PQRSDF
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
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  to="/admin-tasks"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tareas
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin-users"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin-register"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrar Nuevo
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <Button
              className="nav-link"
              onClick={() => {
                logout();
              }}
              sx={{ alignItems: 'center', padding: 0 }}
            >
              Cerrar Sesión
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
