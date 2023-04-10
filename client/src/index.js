import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import WatchList from "./pages/WatchList"
import Settings from "./pages/Settings"

import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: 'watchlist',
        element: <WatchList />
    },
    {
        path: 'settings',
        element: <Settings />
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<RouterProvider router={router} />)