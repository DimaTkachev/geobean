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
                <span className={styles.logoIcon}>
                    <svg
                        width='32'
                        height='32'
                        viewBox='0 0 32 32'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M30 16C30 19.7 29.4 22.7 28.6 22.7C27.8 22.7 27.2 19.7 27.2 16C27.2 12.3 27.8 9.3 28.6 9.3C29.4 9.3 30 12.3 30 16ZM26.5 16C26.5 20.1 24.7 23.5 22.6 23.5C20.5 23.5 18.7 20.1 18.7 16C18.7 11.9 20.5 8.5 22.6 8.5C24.7 8.5 26.5 11.9 26.5 16ZM17.8 16C17.8 20.4 14.3 24 9.9 24C5.5 24 2 20.4 2 16C2 11.6 5.5 8 9.9 8C14.3 8 17.8 11.6 17.8 16Z'
                            fill='currentColor'
                        />
                    </svg>
                </span>
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
                            Зарегистрироваться
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
