import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useShop } from '@contexts/index';
import styles from './Header.module.css';
import { ProfileOptionsModal } from '@components/ProfileOptionsModal/ProfileOptionsModal';
import { Button } from '@components/Button';

export const Header: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { currentShop } = useShop();
    const [showProfileOptions, setShowProfileOptions] = useState(false);

    const handleEmailClick = () => {
        setShowProfileOptions(!showProfileOptions);
    };

    return (
        <header className={styles.header}>
            <Link to='/' className={styles.logo}>
                <span className={styles.logoIcon}>☕</span>
                <h2 className={styles.logoText}>
                    {currentShop ? currentShop.name : 'GeoBean'}
                </h2>
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
                        <Button type='outline' active to='/register'>
                            Регистрация
                        </Button>
                        <Button active to='/login'>
                            Войти
                        </Button>
                    </div>
                )}
            </nav>
        </header>
    );
};
