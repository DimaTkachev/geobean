import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Добро пожаловать в GeoBean</h1>
                <p className={styles.description}>
                    Платформа для отслеживания кофейных зерен и управления
                    поставками
                </p>

                <div className={styles.actions}>
                    <Link to='/register' className={styles.registerButton}>
                        Создать аккаунт
                    </Link>
                    <Link to='/login' className={styles.loginButton}>
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
};
