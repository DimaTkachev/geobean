import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { useAuth, useShop } from '@contexts/index';
import styles from './Header.module.css';
import { ProfileOptionsModal } from '@components/ProfileOptionsModal/ProfileOptionsModal';
import { Button } from '@components/Button';
import Logo from '@assets/images/logo.svg';

export const Header: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { currentShop, toggleShopSidebar } = useShop();
    const [showProfileOptions, setShowProfileOptions] = useState(false);

    const handleEmailClick = () => {
        setShowProfileOptions(!showProfileOptions);
    };

    return (
        <header className={cn(styles.header)}>
            <div className={cn(styles.headerLeft)}>
                {isAuthenticated && (
                    <button
                        className={cn(styles.toggleShopButton)}
                        onClick={toggleShopSidebar}
                    >
                        <svg
                            width='28'
                            height='28'
                            viewBox='0 0 28 28'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                            className={styles.menuIcon}
                        >
                            <path
                                d='M4.66666 6.99998C4.66666 6.69056 4.78958 6.39381 5.00837 6.17502C5.22717 5.95623 5.52391 5.83331 5.83333 5.83331H22.1667C22.4761 5.83331 22.7728 5.95623 22.9916 6.17502C23.2104 6.39381 23.3333 6.69056 23.3333 6.99998C23.3333 7.3094 23.2104 7.60614 22.9916 7.82494C22.7728 8.04373 22.4761 8.16665 22.1667 8.16665H5.83333C5.52391 8.16665 5.22717 8.04373 5.00837 7.82494C4.78958 7.60614 4.66666 7.3094 4.66666 6.99998ZM4.66666 14C4.66666 13.6906 4.78958 13.3938 5.00837 13.175C5.22717 12.9562 5.52391 12.8333 5.83333 12.8333H22.1667C22.4761 12.8333 22.7728 12.9562 22.9916 13.175C23.2104 13.3938 23.3333 13.6906 23.3333 14C23.3333 14.3094 23.2104 14.6061 22.9916 14.8249C22.7728 15.0437 22.4761 15.1666 22.1667 15.1666H5.83333C5.52391 15.1666 5.22717 15.0437 5.00837 14.8249C4.78958 14.6061 4.66666 14.3094 4.66666 14ZM5.83333 19.8333C5.52391 19.8333 5.22717 19.9562 5.00837 20.175C4.78958 20.3938 4.66666 20.6906 4.66666 21C4.66666 21.3094 4.78958 21.6061 5.00837 21.8249C5.22717 22.0437 5.52391 22.1666 5.83333 22.1666H22.1667C22.4761 22.1666 22.7728 22.0437 22.9916 21.8249C23.2104 21.6061 23.3333 21.3094 23.3333 21C23.3333 20.6906 23.2104 20.3938 22.9916 20.175C22.7728 19.9562 22.4761 19.8333 22.1667 19.8333H5.83333Z'
                                fill='currentColor'
                            />
                        </svg>
                    </button>
                )}

                <Link to='/' className={cn(styles.logo)}>
                    <span className={cn(styles.logoIcon)}>
                        <Logo />
                    </span>
                    <h2 className={cn(styles.logoText)}>
                        {currentShop ? currentShop.name : 'GeoBean'}
                    </h2>
                </Link>
            </div>

            <nav className={cn(styles.nav)}>
                {isAuthenticated ? (
                    <div className={cn(styles.userSection)}>
                        <div className={cn(styles.userEmailContainer)}>
                            <span
                                className={cn(styles.userEmail)}
                                onClick={handleEmailClick}
                            >
                                {user?.email}
                            </span>
                            <svg
                                width='32'
                                height='32'
                                viewBox='0 0 32 32'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                className={styles.userIcon}
                            >
                                <path
                                    d='M26.749 24.9323C28.1851 23.2044 29.184 21.156 29.661 18.9604C30.1381 16.7649 30.0793 14.4867 29.4897 12.3187C28.9001 10.1506 27.797 8.15648 26.2737 6.50493C24.7504 4.85338 22.8517 3.59301 20.7383 2.83044C18.6248 2.06787 16.3589 1.82554 14.132 2.12394C11.9051 2.42234 9.78282 3.25269 7.94472 4.54476C6.10662 5.83683 4.60675 7.5526 3.57199 9.54693C2.53724 11.5413 1.99804 13.7555 2.00001 16.0023C2.00085 19.2684 3.15183 22.43 5.25101 24.9323L5.23101 24.9493C5.30101 25.0333 5.38101 25.1053 5.45301 25.1883C5.54301 25.2913 5.64001 25.3883 5.73301 25.4883C6.01167 25.7929 6.30167 26.0829 6.60301 26.3583C6.69634 26.4409 6.78967 26.5216 6.88301 26.6003C7.20301 26.8769 7.53301 27.1376 7.87301 27.3823C7.91701 27.4123 7.95701 27.4513 8.00101 27.4823V27.4703C10.3431 29.1186 13.1371 30.0032 16.001 30.0032C18.8649 30.0032 21.659 29.1186 24.001 27.4703V27.4823C24.045 27.4513 24.084 27.4123 24.129 27.3823C24.469 27.1369 24.799 26.8763 25.119 26.6003C25.2123 26.5209 25.3057 26.4403 25.399 26.3583C25.6997 26.0829 25.9897 25.7929 26.269 25.4883C26.362 25.3883 26.458 25.2913 26.549 25.1883C26.62 25.1053 26.701 25.0333 26.771 24.9483L26.749 24.9323ZM16 8.00226C16.89 8.00226 17.7601 8.26618 18.5001 8.76064C19.2401 9.25511 19.8169 9.95791 20.1575 10.7802C20.4981 11.6024 20.5872 12.5072 20.4135 13.3802C20.2399 14.2531 19.8113 15.0549 19.182 15.6842C18.5527 16.3136 17.7508 16.7422 16.8779 16.9158C16.005 17.0894 15.1002 17.0003 14.2779 16.6597C13.4557 16.3191 12.7529 15.7423 12.2584 15.0023C11.7639 14.2623 11.5 13.3923 11.5 12.5023C11.5 11.3088 11.9741 10.1642 12.818 9.32028C13.6619 8.47636 14.8065 8.00226 16 8.00226ZM8.00701 24.9323C8.02435 23.6192 8.55795 22.3658 9.49236 21.4432C10.4268 20.5206 11.6869 20.0029 13 20.0023H19C20.3132 20.0029 21.5732 20.5206 22.5076 21.4432C23.4421 22.3658 23.9757 23.6192 23.993 24.9323C21.7998 26.9086 18.9523 28.0023 16 28.0023C13.0477 28.0023 10.2002 26.9086 8.00701 24.9323Z'
                                    fill='currentColor'
                                />
                            </svg>
                        </div>
                        <ProfileOptionsModal
                            isOpen={showProfileOptions}
                            onClose={() => setShowProfileOptions(false)}
                        />
                    </div>
                ) : (
                    <div className={styles.authButtons}>
                        <Button type='outline' to='/register'>
                            Зарегистрироваться
                        </Button>
                        <Button to='/login'>Войти</Button>
                    </div>
                )}
            </nav>
        </header>
    );
};
