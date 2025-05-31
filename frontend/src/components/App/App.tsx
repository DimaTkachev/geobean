import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../contexts';
import { Header } from '../Header';
import { Home } from '../Home';
import { Registration } from '../Registration';
import { Login } from '../Login';
import styles from './App.module.css';

export const App: React.FC = () => {
    return (
        <AuthProvider>
            <div className={styles.app}>
                <Router>
                    <Header />
                    <main className={styles.main}>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route
                                path='/register'
                                element={<Registration />}
                            />
                            <Route path='/login' element={<Login />} />
                        </Routes>
                    </main>
                </Router>
            </div>
        </AuthProvider>
    );
};

export default App;
