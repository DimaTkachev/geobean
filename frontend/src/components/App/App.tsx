import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from '@contexts/index';
import { ShopProvider } from '@contexts/index';
import { Header } from '@components/Header';
import { Login } from '@components/Login';
import { Registration } from '@components/Registration';
import { CreateShop } from '@components/CreateShop';
import { Catalog } from '@components/Catalog';
import CoffeeLotCardPage from '@pages/CoffeeLotCardPage';
import { CoffeeMap } from '@components/CoffeeMap';
import GuestAccess from '@pages/GuestAccess';
import GuestInventory from '@pages/GuestInventory';
import Inventory from '@pages/Inventory';

import styles from './App.module.css';

export const App: React.FC = () => (
    <ShopProvider>
        <AuthProvider>
            <div className={styles.app}>
                <Router>
                    <Header />
                    <main className={styles.main}>
                        <Routes>
                            <Route path='/' element={<CoffeeMap />} />
                            <Route
                                path='/register'
                                element={<Registration />}
                            />
                            <Route path='/login' element={<Login />} />
                            <Route
                                path='/create-shop'
                                element={<CreateShop />}
                            />
                            <Route path='/catalog' element={<Catalog />} />
                            <Route path='/inventory' element={<Inventory />} />
                            <Route
                                path='/coffee-lots/:lotID'
                                element={<CoffeeLotCardPage />}
                            />
                            <Route
                                path='/guest-access'
                                element={<GuestAccess />}
                            />
                            <Route
                                path='/guest-inventory/:shareUrl'
                                element={<GuestInventory />}
                            />
                        </Routes>
                    </main>
                </Router>
            </div>
        </AuthProvider>
    </ShopProvider>
);

export default App;
