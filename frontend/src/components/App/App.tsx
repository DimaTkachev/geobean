import React, { useEffect } from 'react';
import { fetchApi } from '@/utils/api';
import './App.css';
import { MarkerDTO } from '@/types/dtos';

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
