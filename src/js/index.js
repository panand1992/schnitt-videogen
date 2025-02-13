import React from 'react';
import { createRoot } from 'react-dom/client';

import CustomRouter from './router';

import '../styles/app.scss';

const root = createRoot(document.getElementById('app'));
root.render(<CustomRouter />);
