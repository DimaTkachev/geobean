import React from 'react';
import cn from 'classnames';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import styles from './style.module.css';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    width?: 'full' | 'fit';
    search?: boolean;
}

export const Input: React.FC<InputProps> = ({
    className,
    width,
    search,
    ...props
}) => (
    <div
        className={cn(styles.input, className, {
            [styles.fullWidth]: width === 'full',
            [styles.search]: search,
        })}
    >
        {search && (
            <MagnifyingGlassIcon size={20} className={styles.searchIcon} />
        )}
        <input className={styles.field} {...props} />
    </div>
);
