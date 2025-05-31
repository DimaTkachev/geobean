import React from 'react';
import useSWR from 'swr';

import { MarkerDTO } from '@/types/dtos';
import { fetchApi } from '@/utils/api';
import styles from './App.module.css';

export const App: React.FC = () => {
    const { data, error } = useSWR<MarkerDTO[]>('/api/map/all', fetchApi);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <div className={styles.app}>
            <h1 className={styles.title}>Fullstack Project</h1>
        </div>
    );
};

export default App;
