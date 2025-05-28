import React, { useEffect } from 'react';
import { fetchApi } from '../../utils/api';
import './App.css';

export const App: React.FC = () => {
    useEffect(() => {
        fetchApi('/api/map/all')
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
            });
    }, []);

    return (
        <div className='app'>
            <h1>Fullstack Project</h1>
        </div>
    );
};

export default App;
