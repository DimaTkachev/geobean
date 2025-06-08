import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth, useShop } from '../../contexts';

import styles from './Header.module.css';
import { ProfileOptionsModal } from '../ProfileOptionsModal/ProfileOptionsModal';

export const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { currentShop } = useShop();
    const navigate = useNavigate();
    const [showProfileOptions, setShowProfileOptions] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleEmailClick = () => {
        setShowProfileOptions(!showProfileOptions);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to='/' className={styles.logo}>
                    <span className={styles.logoIcon}>☕</span>
                    <span className={styles.logoText}>
                        {currentShop ? currentShop.name : 'GeoBean'}
                    </span>
                </Link>

                <nav className={styles.nav}>
                    {isAuthenticated ? (
                        <div
                            className={styles.userSection}
                            style={{ position: 'relative' }}
                        >
                            <span
                                className={styles.userEmail}
                                onClick={handleEmailClick}
                                style={{ cursor: 'pointer' }}
                            >
                                {user?.email}
                            </span>

                            <ProfileOptionsModal
                                isOpen={showProfileOptions}
                                onClose={() => setShowProfileOptions(false)}
                            />
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
