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
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'filled',
    size = 'medium',
    active = false,
    to,
}) => {
    const buttonClasses = classNames(
        styles.button,
        styles[type],
        styles[size],
        {
            [styles.active]: active,
        }
    );

    return to ? (
        <Link onClick={onClick} className={buttonClasses} to={to}>
            {children}
        </Link>
    ) : (
        <button onClick={onClick} className={buttonClasses}>
            {children}
        </button>
    );
};
