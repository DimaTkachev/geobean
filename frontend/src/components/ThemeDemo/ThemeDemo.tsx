import React from 'react';
import { useTheme } from '@hooks/useTheme';
import styles from './ThemeDemo.module.css';

export const ThemeDemo: React.FC = () => {
    const { setTheme } = useTheme();

    return (
        <div className={styles.demo}>
            <h3>Демонстрация системы тем</h3>
            <div className={styles.buttons}>
                <button
                    className={styles.themeButton}
                    onClick={() => setTheme('beige')}
                >
                    Бежевая тема
                </button>
                <button
                    className={styles.themeButton}
                    onClick={() => setTheme('purple')}
                >
                    Фиолетовая тема
                </button>
                <button
                    className={styles.themeButton}
                    onClick={() => setTheme('blue')}
                >
                    Синяя тема
                </button>
            </div>
            <div className={styles.preview}>
                <div className={styles.card}>
                    <h4>Превью темы</h4>
                    <p>Этот компонент использует переменные темы</p>
                </div>
            </div>
        </div>
    );
};
