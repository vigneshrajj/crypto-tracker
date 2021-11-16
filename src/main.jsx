import React from 'react';
import ReactDOM from 'react-dom';
import Login from './screens/login';
import List from './screens/list';
import CoinDetails from './screens/coinDetails';
import './index.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/list' element={<List />} />
                <Route path='/coin/:coinId' element={<CoinDetails />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
