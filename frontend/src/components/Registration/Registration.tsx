import React, { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import styles from './Registration.module.css';
import { useAuth } from '../../contexts';

interface RegistrationFormData {
    email: string;
    password: string;
    confirmPassword: string;
    agreeToPrivacy: boolean;
}

const validationSchema = yup
    .object({
        email: yup
            .string()
            .required('Введите email')
            .email('Неверный формат email'),
        password: yup
            .string()
            .required('Введите пароль')
            .min(6, 'Пароль должен содержать минимум 6 символов'),
        confirmPassword: yup
            .string()
            .required('Подтвердите пароль')
            .oneOf([yup.ref('password')], 'Пароли не совпадают'),
        agreeToPrivacy: yup
            .boolean()
            .required('Необходимо согласиться с политикой конфиденциальности')
            .oneOf(
                [true],
                'Необходимо согласиться с политикой конфиденциальности'
            ),
    })
    .required();

export const Registration: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegistrationFormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            agreeToPrivacy: false,
        },
    });

    const onSubmit = async (data: RegistrationFormData) => {
        setSubmitError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                if (login) {
                    await login(data.email, data.password);
                }
                navigate('/create-shop');
            } else {
                setIsLoading(false);
                const errorData = await response.json();
                if (errorData.message?.includes('User already exists')) {
                    setError('email', {
                        message: 'Пользователь с таким email уже существует',
                    });
                } else {
                    setSubmitError(errorData.message || 'Ошибка регистрации');
                }
            }
        } catch (error) {
            setIsLoading(false);
            setSubmitError('Ошибка сети. Попробуйте еще раз.');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Link to='/' className={styles.backButton}>
                        ← На главную
                    </Link>
                </div>

                <h1 className={styles.title}>Создать аккаунт</h1>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {submitError && (
                        <div className={styles.submitError}>{submitError}</div>
                    )}

                    <div className={styles.inputGroup}>
                        <input
                            {...register('email')}
                            type='email'
                            placeholder='Введите e-mail'
                            disabled={isLoading}
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        />
                        {errors.email && (
                            <span className={styles.error}>
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.passwordWrapper}>
                            <input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Введите пароль'
                                disabled={isLoading}
                                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            />
                            <button
                                type='button'
                                className={styles.eyeButton}
                                disabled={isLoading}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                👁️
                            </button>
                        </div>
                        {errors.password && (
                            <span className={styles.error}>
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.passwordWrapper}>
                            <input
                                {...register('confirmPassword')}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='Повторите пароль'
                                disabled={isLoading}
                                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                            />
                            <button
                                type='button'
                                className={styles.eyeButton}
                                disabled={isLoading}
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                👁️
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className={styles.error}>
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                {...register('agreeToPrivacy')}
                                type='checkbox'
                                disabled={isLoading}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkboxCustom}></span>
                            <span className={styles.checkboxText}>
                                Я согласен с{' '}
                                <span className={styles.privacyLink}>
                                    Политикой конфиденциальности
                                </span>
                            </span>
                        </label>
                        {errors.agreeToPrivacy && (
                            <span className={styles.error}>
                                {errors.agreeToPrivacy.message}
                            </span>
                        )}
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                    >
                        {isLoading ? (
                            <span className={styles.loadingContent}>
                                <span className={styles.spinner}></span>
                                Регистрируется...
                            </span>
                        ) : (
                            'Зарегистрироваться'
                        )}
                    </button>
                </form>

                <div className={styles.loginSection}>
                    <span className={styles.loginText}>Уже есть аккаунт? </span>
                    <button
                        type='button'
                        onClick={handleLoginClick}
                        className={styles.loginButton}
                    >
                        Войти
                    </button>
                </div>
            </div>
        </div>
    );
};
