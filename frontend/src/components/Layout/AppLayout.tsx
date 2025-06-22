import React from 'react';
import { ShopContainer } from '@components/ShopContainer';
import styles from './AppLayout.module.css';
import classNames from 'classnames';

interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    className?: string;
    showShopContainer?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    title,
    sidebar,
    header,
    className,
    showShopContainer = true,
}) => (
    <section className={classNames(styles.appLayout, className)}>
        {showShopContainer && <ShopContainer />}
        <div className={styles.appContent}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                {header && <div className={styles.headerExtra}>{header}</div>}
            </div>
            <div className={styles.container}>
                {sidebar && (
                    <div className={styles.sidebarContainer}>{sidebar}</div>
                )}
                <div className={styles.mainContent}>{children}</div>
            </div>
        </div>
    </section>
);
