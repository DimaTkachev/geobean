import React, { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { useAuth } from '@contexts/index';

import styles from './Login.module.css';
import { Input } from '@components/Input';
import { Button } from '../Button';
import { EyeIcon } from '@phosphor-icons/react';

interface LoginFormData {
    email: string;
    password: string;
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
    })
    .required();

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(validationSchema),
        reValidateMode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setSubmitError('');
        setIsLoading(true);

        try {
            await login(data.email, data.password);
            navigate('/');
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : 'Ошибка входа'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Войти в аккаунт</h1>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {submitError && (
                        <div className={styles.submitError}>{submitError}</div>
                    )}

                    <div className={styles.inputGroup}>
                        <Input
                            {...register('email')}
                            type='email'
                            placeholder='Введите e-mail'
                            disabled={isLoading}
                            error={!!errors.email}
                            onChange={(e) => {
                                register('email').onChange(e);
                                setSubmitError('');
                            }}
                        />
                        {errors.email && (
                            <span className={styles.error}>
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.passwordWrapper}>
                            <Input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Введите пароль'
                                disabled={isLoading}
                                error={!!errors.password}
                                onChange={(e) => {
                                    register('password').onChange(e);
                                    setSubmitError('');
                                }}
                            />
                            <button
                                type='button'
                                className={styles.eyeButton}
                                disabled={isLoading}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <EyeIcon size={20} />
                            </button>
                        </div>
                        {errors.password && (
                            <span className={styles.error}>
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <Link to='/forgot-password' className={styles.link}>
                        Забыли пароль?
                    </Link>

                    <Button
                        htmlType='submit'
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </Button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Нет аккаунта?{' '}
                        <Link to='/register' className={styles.registerLink}>
                            Создать
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
