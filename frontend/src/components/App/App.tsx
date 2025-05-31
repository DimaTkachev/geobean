import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from '../Home';
import { Registration } from '../Registration';
import { Login } from '../Login';
import styles from './App.module.css';

export const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<Registration />} />
                    <Route path='/login' element={<Login />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
