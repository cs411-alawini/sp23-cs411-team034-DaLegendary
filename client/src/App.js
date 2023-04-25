import './App.css';

import React, { useState, useEffect, useRef } from 'react'

import { Routes ,Route } from 'react-router-dom';

import Home from "./pages/Home";
import QueryI from "./pages/QueryI";
import Layout from "./components/layout/Layout";
import Favorites from "./pages/Favorites";
import Settings from './pages/Settings';
import MostFavoriedVideos from './pages/MostFavoriedVideos';

function App() {
  return (
    <Layout>
      <Routes >
        <Route path='/' element={<Home/>} />
        <Route path='/favorites' element={<Favorites/>}/>
        <Route path='/mostFavoriedVideos' element={<MostFavoriedVideos/>} />
        <Route path='/categories' element={<QueryI/>} />
        <Route path='/settings' element={<Settings/>} />
      </Routes>
    </Layout>
  );
}

export default App;

