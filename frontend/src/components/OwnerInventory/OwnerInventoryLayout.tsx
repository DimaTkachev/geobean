import React from 'react';
import { AppLayout } from '@components/Layout';
import styles from './OwnerInventoryLayout.module.css';

interface OwnerInventoryLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export const OwnerInventoryLayout: React.FC<OwnerInventoryLayoutProps> = ({
    children,
    sidebar,
}) => (
    <AppLayout
        title='Инвентарь кофейни'
        sidebar={sidebar}
        className={styles.ownerInventoryLayout}
    >
        {children}
    </AppLayout>
);
