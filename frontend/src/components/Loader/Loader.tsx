import React from 'react';
import { ClipLoader } from 'react-spinners';
import classNames from 'classnames';

import styles from './Loader.module.css';

interface LoaderProps {
    variant?: 'fullscreen' | 'container' | 'center' | 'small';
    size?: number;
    color?: string;
    text?: string;
    className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
    variant = 'center',
    size = 50,
    color = 'var(--theme-text)',
    text,
    className,
}) => {
    const getContainerClass = () => {
        switch (variant) {
            case 'fullscreen':
                return styles.fullScreenLoader;
            case 'container':
                return styles.containerLoader;
            case 'center':
                return styles.centerLoader;
            case 'small':
                return styles.smallLoader;
            default:
                return styles.centerLoader;
        }
    };

    return (
        <div className={classNames(getContainerClass(), className)}>
            <div>
                <ClipLoader color={color} size={size} />
                {text && <div className={styles.loadingText}>{text}</div>}
            </div>
        </div>
    );
};

export default Loader;
