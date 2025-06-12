import React from 'react';
import cn from 'classnames';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import styles from './style.module.css';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    width?: 'full' | 'fit';
    search?: boolean;
    error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, width, search, error, ...props }, ref) => (
        <div
            className={cn(styles.input, className, {
                [styles.fullWidth]: width === 'full',
                [styles.search]: search,
            })}
        >
            {search && (
                <MagnifyingGlassIcon size={20} className={styles.searchIcon} />
            )}
            <input
                ref={ref}
                className={cn(styles.field, {
                    [styles.error]: error,
                })}
                {...props}
            />
        </div>
    )
);

Input.displayName = 'Input';
