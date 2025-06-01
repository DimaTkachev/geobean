import React from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AuthProvider } from '../../contexts';
import { ShopProvider } from '../../contexts';
import { Header } from '../Header';
import { Home } from '../Home';
import { Login } from '../Login';
import { Registration } from '../Registration';
import { CreateShop } from '../CreateShop';
import { Catalog } from '../Catalog';
import CoffeeLotCardPage from '../../pages/CoffeeLotCardPage';

import styles from './App.module.css';

export const App: React.FC = () => (
  <ShopProvider>
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
              <Route path='/create-shop' element={<CreateShop />} />
              <Route path='/catalog' element={<Catalog />} />
              <Route path='/coffee-lots/:lotID' element={<CoffeeLotCardPage />} />
            </Routes>
          </main>
        </Router>
      </div>
    </AuthProvider>
  </ShopProvider>
);

export default App;
