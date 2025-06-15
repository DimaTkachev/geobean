import React from 'react';
import { AppLayout } from '@components/Layout';
import styles from './CatalogLayout.module.css';

interface CatalogLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export const CatalogLayout: React.FC<CatalogLayoutProps> = ({
    children,
    sidebar,
}) => (
    <AppLayout
        title='Каталог зерен'
        sidebar={sidebar}
        className={styles.catalogLayout}
    >
        {children}
    </AppLayout>
);
