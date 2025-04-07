import React from 'react';
import { createRoot } from 'react-dom/client';
import Framework7 from 'framework7/lite-bundle';
import Framework7React from 'framework7-react';
import App from './App';

// Framework7 插件初始化
Framework7.use(Framework7React);

// Framework7 樣式
import 'framework7/css/bundle';
import 'framework7-icons';

// 自定義樣式
import './css/app.css';

const rootElement = document.getElementById('app');
const root = createRoot(rootElement);
root.render(<App />); 