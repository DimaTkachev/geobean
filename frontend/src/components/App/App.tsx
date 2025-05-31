import React from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AuthProvider } from '../../contexts';
import { Header } from '../Header';
import { Home } from '../Home';
import { Login } from '../Login';
import { Registration } from '../Registration';

import styles from './App.module.css';

export const App: React.FC = () => (
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

export default App;
