import App from './App';
import { createRoot } from 'react-dom/client';
import React from 'react';
import 'simplebar';
import 'simplebar/dist/simplebar.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";
import './scss/index.scss';

const contianer = document.getElementById('root');
const root = createRoot(contianer!);
root.render(<App/>);
