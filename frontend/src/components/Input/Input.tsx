import React from 'react';
import cn from 'classnames';

import styles from './style.module.css';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => (
    <input className={cn(styles.input, className)} {...props} />
);
