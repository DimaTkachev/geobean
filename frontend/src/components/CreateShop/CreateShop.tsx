import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import styles from './CreateShop.module.css';
import { Input } from '@components/Input';
import { useShop } from '@contexts/index';

const themes = [
    { value: 'beige', label: 'Бежевый', color: '#8b6a4a' },
    { value: 'purple', label: 'Фиолетовый', color: '#6c4a8b' },
    { value: 'blue', label: 'Синий', color: '#4a6a8b' },
];

interface ApiError {
    message: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
}

type ErrorType = Error | ApiError;

export const CreateShop: React.FC = () => {
    const navigate = useNavigate();
    const { refreshShops } = useShop();
    const [name, setName] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('beige');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleError = (error: ErrorType): void => {
        const errorMessage =
            error instanceof Error ? error.message : error.message;
        setError(errorMessage);
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/shops', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, theme: selectedTheme }),
            });

            const data = (await response.json()) as ApiResponse;

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create shop');
            }

            await refreshShops();

            navigate('/');
        } catch (err) {
            if (err instanceof Error) {
                handleError(err);
            } else {
                handleError(new Error('An unexpected error occurred'));
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Добавьте вашу первую кофейню!</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.submitError}>{error}</div>}
                    <div className={styles.formContent}>
                        <div
                            className={styles.themePreview}
                            style={{
                                background: themes.find(
                                    (t) => t.value === selectedTheme
                                )?.color,
                            }}
                        />
                        <Input
                            type='text'
                            placeholder='Название'
                            style={{ width: '300px' }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={!!error}
                        />
                        <div className={styles.themeSelector}>
                            {themes.map((t) => (
                                <button
                                    key={t.value}
                                    type='button'
                                    className={classNames(styles.themeButton, {
                                        [styles.themeButtonSelected]:
                                            selectedTheme === t.value,
                                    })}
                                    style={{ background: t.color }}
                                    onClick={() => setSelectedTheme(t.value)}
                                    aria-label={t.label}
                                />
                            ))}
                        </div>
                    </div>
                    <button
                        type='submit'
                        disabled={isLoading || !name}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Добавляется...' : 'Добавить'}
                    </button>
                </form>
            </div>
        </div>
    );
};
