import React from 'react';
import { useAuth } from '../../contexts';
import styles from './Home.module.css';

export const Home: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {isAuthenticated ? (
                    <>
                        <h1 className={styles.title}>
                            Добро пожаловать, {user?.email}!
                        </h1>
                        <p className={styles.description}>
                            Готовы начать отслеживание ваших кофейных зерен?
                        </p>
                        <div className={styles.actions}>
                            <button className={styles.primaryButton}>
                                Создать новую партию
                            </button>
                            <button className={styles.secondaryButton}>
                                Просмотреть поставки
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className={styles.title}>
                            Добро пожаловать в GeoBean
                        </h1>
                        <p className={styles.description}>
                            Платформа для отслеживания кофейных зерен и
                            управления поставками. Зарегистрируйтесь или
                            войдите, чтобы начать работу.
                        </p>
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>📍</span>
                                <h3>Отслеживание происхождения</h3>
                                <p>
                                    Следите за путешествием ваших зерен от фермы
                                    до чашки
                                </p>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>📊</span>
                                <h3>Аналитика поставок</h3>
                                <p>
                                    Получайте детальную аналитику по всем
                                    поставкам
                                </p>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>🔒</span>
                                <h3>Безопасность данных</h3>
                                <p>
                                    Ваши данные защищены современными
                                    технологиями
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
