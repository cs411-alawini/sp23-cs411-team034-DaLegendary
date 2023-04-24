// import React from "react"
// import ReactDOM from "react-dom/client"
// import App from "./App"
// import WatchList from "./pages/WatchList"
// import Settings from "./pages/Settings"
// import Trendings from "./pages/Trendings"

// import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <App />
//     },
//     {
//         path: 'watchlist',
//         element: <WatchList />
//     },
//     {
//         path: 'settings',
//         element: <Settings />
//     },
//     {
//         path: 'trendings',
//         element: <Trendings />
//     }
// ])

// const root = ReactDOM.createRoot(document.getElementById('root'))
// root.render(<RouterProvider router={router} />)


import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));