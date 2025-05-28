import React, { useEffect } from 'react';
import { fetchApi } from '@/utils/api';
import './App.css';

interface MapData {
    // Add your map data interface properties here
    id: number;
    // other properties...
}

export const App: React.FC = () => {
    useEffect(() => {
        fetchApi<MapData[]>('/api/map/all')
            .then((data: MapData[]) => {
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
