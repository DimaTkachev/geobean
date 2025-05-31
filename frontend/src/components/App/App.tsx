import React, { useEffect } from 'react';

import { MarkerDTO } from '@/types/dtos';
import { fetchApi } from '@/utils/api';
import './App.css';

export const App: React.FC = () => {
    useEffect(() => {
        fetchApi<MarkerDTO[]>('/api/map/all')
            .then((data: MarkerDTO[]) => {
                console.log(data);
            })
            .catch((error: Error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className='app'>
            <h1>Fullstack Project</h1>
        </div>
    );
};

export default App;
