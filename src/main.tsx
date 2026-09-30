import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,HashRouter} from 'react-router-dom';
import App from './App';
import './style.css';
// Pages has no SPA rewrite; hash routes keep refresh requests at the site root.
const Router = import.meta.env.MODE === 'github-pages' ? HashRouter : BrowserRouter;
createRoot(document.getElementById('root')!).render(<React.StrictMode><Router><App/></Router></React.StrictMode>);
import './final.css';
