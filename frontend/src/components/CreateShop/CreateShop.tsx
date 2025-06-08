import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '@components/Registration/Registration.module.css';

const themes = [
    { value: 'beige', label: 'Бежевый', color: '#8b6a4a' },
    { value: 'purple', label: 'Фиолетовый', color: '#6c4a8b' },
    { value: 'blue', label: 'Синий', color: '#4a6a8b' },
];

export const CreateShop: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [theme, setTheme] = useState('beige');
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/shops', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, theme, image }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Ошибка создания кофейни');
            }
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Добавьте вашу первую кофейню!</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.submitError}>{error}</div>}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: 24,
                        }}
                    >
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: themes.find(
                                    (t) => t.value === theme
                                )?.color,
                                marginBottom: 12,
                            }}
                        />
                        <input
                            type='text'
                            placeholder='Название'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            style={{
                                width: 300,
                                textAlign: 'center',
                                marginBottom: 16,
                            }}
                            required
                        />
                        {/* Optionally, add image upload here */}
                        <div
                            style={{
                                display: 'flex',
                                gap: 16,
                                marginBottom: 16,
                            }}
                        >
                            {themes.map((t) => (
                                <button
                                    key={t.value}
                                    type='button'
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: t.color,
                                        border:
                                            theme === t.value
                                                ? '3px solid #333'
                                                : '2px solid #ccc',
                                        outline: 'none',
                                    }}
                                    onClick={() => setTheme(t.value)}
                                    aria-label={t.label}
                                />
                            ))}
                        </div>
                    </div>
                    <button
                        type='submit'
                        disabled={isLoading || !name}
                        className={styles.submitButton}
                        style={{ width: 300 }}
                    >
                        {isLoading ? 'Добавляется...' : 'Добавить'}
                    </button>
                </form>
            </div>
        </div>
    );
};
