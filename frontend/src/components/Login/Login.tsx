import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

export const Login: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Вход в систему</h1>
                <p className={styles.description}>
                    Эта страница находится в разработке
                </p>
                <div className={styles.actions}>
                    <Link to='/' className={styles.homeButton}>
                        На главную
                    </Link>
                    <Link to='/register' className={styles.registerButton}>
                        Создать аккаунт
                    </Link>
                </div>
            </div>
        </div>
    );
};
