import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts';

import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to='/' className={styles.logo}>
          <span className={styles.logoIcon}>☕</span>
          <span className={styles.logoText}>GeoBean</span>
        </Link>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <div className={styles.userSection}>
              <span className={styles.userEmail}>
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                                Выйти
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to='/login' className={styles.loginButton}>
                                Войти
              </Link>
              <Link
                to='/register'
                className={styles.registerButton}
              >
                                Регистрация
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
