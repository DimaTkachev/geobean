import React, { useState, useEffect } from 'react';
import './App.css';

export const App = () => {
    const [message, setMessage] = useState('');
    const [dbMessage, setDbMessage] = useState('');

    useEffect(() => {
        fetch('/api/map/all')
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    return (
        <div className='app'>
            <h1>Fullstack Project</h1>
            <p>API Response: {message}</p>
            <p>Database Response: {dbMessage}</p>
        </div>
    );
};

export default App;
