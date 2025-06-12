import React from 'react';
import classNames from 'classnames';
import styles from './style.module.css';
import { Link, To } from 'react-router-dom';

export interface ButtonProps {
    children: React.ReactNode;
    type?: 'outline' | 'filled';
    size?: 'small' | 'medium';
    onClick?: () => void;
    active?: boolean;
    to?: To;
    disabled?: boolean;
    htmlType?: 'button' | 'submit' | 'reset';
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'filled',
    size = 'medium',
    active = false,
    to,
    disabled = false,
    htmlType = 'button',
    className,
}) => {
    const buttonClasses = classNames(
        styles.button,
        styles[type],
        styles[size],
        {
            [styles.active]: active,
            [styles.disabled]: disabled,
        },
        className
    );

    return to ? (
        <Link onClick={onClick} className={buttonClasses} to={to}>
            {children}
        </Link>
    ) : (
        <button
            onClick={onClick}
            className={buttonClasses}
            disabled={disabled}
            type={htmlType}
        >
            {children}
        </button>
    );
};
