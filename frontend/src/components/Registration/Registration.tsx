import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import styles from './Registration.module.css';
import { Input } from '@components/Input';
import { Button } from '../Button';
import { EyeIcon } from '@phosphor-icons/react';
import { useAuth } from '@contexts/index';
import { fetchApi } from '@utils/api';

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
    const { setUserAfterRegistration } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegistrationFormData>({
        resolver: yupResolver(validationSchema),
        reValidateMode: 'onChange',
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
            const result = await fetchApi<{ token: string; user: any }>(
                '/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                    }),
                }
            );

            localStorage.setItem('authToken', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            setUserAfterRegistration(result.user);

            navigate('/create-shop');
        } catch (error) {
            setSubmitError('Ошибка сети. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const isButtonActive =
        !isLoading &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword &&
        watch('email') &&
        watch('password') &&
        watch('confirmPassword') &&
        watch('agreeToPrivacy');

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Создать аккаунт</h1>

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

                    <div className={styles.inputGroup}>
                        <div className={styles.passwordWrapper}>
                            <Input
                                {...register('confirmPassword')}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='Повторите пароль'
                                disabled={isLoading}
                                error={!!errors.confirmPassword}
                                onChange={(e) => {
                                    register('confirmPassword').onChange(e);
                                    setSubmitError('');
                                }}
                            />
                            <button
                                type='button'
                                className={styles.eyeButton}
                                disabled={isLoading}
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                <EyeIcon size={20} />
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
                                <Link to='#' className={styles.privacyLink}>
                                    Политикой конфиденциальности
                                </Link>
                            </span>
                        </label>
                        {errors.agreeToPrivacy && (
                            <span className={styles.error}>
                                {errors.agreeToPrivacy.message}
                            </span>
                        )}
                    </div>

                    <Button
                        htmlType='submit'
                        disabled={!isButtonActive}
                        active={!!isButtonActive}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Регистрируется...' : 'Зарегистрироваться'}
                    </Button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Уже есть аккаунт?{' '}
                        <Link to='/login' className={styles.link}>
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
