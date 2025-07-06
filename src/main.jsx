import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Root from './routes/Root.jsx'
import About from "./components/About.jsx";

import {createBrowserRouter, RouterProvider} from "react-router-dom";

const route = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <App/>
            },
            {
                path: 'about',
                element: <About/>
            }
        ]
    }
],
    {
        basename: import.meta.env.BASE_URL
    }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route}/>
  </StrictMode>,
)
