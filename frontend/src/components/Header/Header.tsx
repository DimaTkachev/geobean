import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useShop } from '@contexts/index';
import styles from './Header.module.css';
import { ProfileOptionsModal } from '@components/ProfileOptionsModal/ProfileOptionsModal';
import { Button } from '@components/Button';

export const Header: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { currentShop, toggleShopSidebar } = useShop();
    const [showProfileOptions, setShowProfileOptions] = useState(false);

    const handleEmailClick = () => {
        setShowProfileOptions(!showProfileOptions);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <button
                    className={styles.toggleShopButton}
                    onClick={toggleShopSidebar}
                >
                    <svg
                        width='28'
                        height='28'
                        viewBox='0 0 28 28'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M4.66666 6.99998C4.66666 6.69056 4.78958 6.39381 5.00837 6.17502C5.22717 5.95623 5.52391 5.83331 5.83333 5.83331H22.1667C22.4761 5.83331 22.7728 5.95623 22.9916 6.17502C23.2104 6.39381 23.3333 6.69056 23.3333 6.99998C23.3333 7.3094 23.2104 7.60614 22.9916 7.82494C22.7728 8.04373 22.4761 8.16665 22.1667 8.16665H5.83333C5.52391 8.16665 5.22717 8.04373 5.00837 7.82494C4.78958 7.60614 4.66666 7.3094 4.66666 6.99998ZM4.66666 14C4.66666 13.6906 4.78958 13.3938 5.00837 13.175C5.22717 12.9562 5.52391 12.8333 5.83333 12.8333H22.1667C22.4761 12.8333 22.7728 12.9562 22.9916 13.175C23.2104 13.3938 23.3333 13.6906 23.3333 14C23.3333 14.3094 23.2104 14.6061 22.9916 14.8249C22.7728 15.0437 22.4761 15.1666 22.1667 15.1666H5.83333C5.52391 15.1666 5.22717 15.0437 5.00837 14.8249C4.78958 14.6061 4.66666 14.3094 4.66666 14ZM5.83333 19.8333C5.52391 19.8333 5.22717 19.9562 5.00837 20.175C4.78958 20.3938 4.66666 20.6906 4.66666 21C4.66666 21.3094 4.78958 21.6061 5.00837 21.8249C5.22717 22.0437 5.52391 22.1666 5.83333 22.1666H22.1667C22.4761 22.1666 22.7728 22.0437 22.9916 21.8249C23.2104 21.6061 23.3333 21.3094 23.3333 21C23.3333 20.6906 23.2104 20.3938 22.9916 20.175C22.7728 19.9562 22.4761 19.8333 22.1667 19.8333H5.83333Z'
                            fill='#3C1F0C'
                        />
                    </svg>
                </button>

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
            </div>

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
