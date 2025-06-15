import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { useAuth } from '@contexts/index';
import styles from './ProfileOptionsModal.module.css';

interface ProfileOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileOptionsModal: React.FC<ProfileOptionsModalProps> = ({
    isOpen,
    onClose,
}) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    if (!isOpen) {
        return null;
    }

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleLogoutClick = () => {
        logout();
        onClose();
        navigate('/');
    };

    return (
        <div className={styles.modal}>
            <ul className={styles.list}>
                <li
                    className={styles.listItem}
                    onClick={() => handleNavigation('/catalog')}
                >
                    Каталог зерен
                </li>
                <li
                    className={styles.listItem}
                    onClick={() => handleNavigation('/inventory')}
                >
                    Инвентарь кофейни
                </li>
                <li
                    className={styles.listItem}
                    onClick={() => handleNavigation('/guest-access')}
                >
                    Гостевой доступ
                </li>
                <li
                    className={classNames(
                        styles.listItem,
                        styles.listItemWithBorder
                    )}
                    onClick={handleLogoutClick}
                >
                    Выйти
                </li>
            </ul>
        </div>
    );
};
