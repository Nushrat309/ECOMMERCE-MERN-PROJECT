import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Cart from '../pages/Cart';
import Error from '../pages/Error';

const Index = () => {
    return (
        <BrowserRouter>
        <Routes>
            <Route>
             <Route path="/" element={<Home/>}/>
             <Route path="/register" element={<Register/>}/>
             <Route path="/login" element={<Login/>}/>
             <Route path="/cart" element={<Cart/>}/>
             <Route path="/*" element={<Error/>}/> 
            </Route>
        </Routes>
        </BrowserRouter>
    );
};

export default Index;