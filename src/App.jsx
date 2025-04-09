import React, { useState, useEffect, createContext } from 'react';
import { App, View, f7ready, f7 } from 'framework7-react';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import { getLanguage, setLanguage } from './utils/SettingsStore';

// Framework7 配置
const f7params = {
  name: '加班計算器',
  theme: 'auto',
  // 初始化時啟用調試模式
  debug: true,
  // 路由配置
  routes: [
    {
      path: '/',
      component: HomePage,
    },
    {
      path: '/settings/',
      component: SettingsPage,
    },
  ],
};

// Create a context for the uploaded image
export const ImageContext = createContext();

const MyApp = () => {
  const [language, setCurrentLanguage] = useState(getLanguage());
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // 當框架準備就緒時執行
  useEffect(() => {
    f7ready((f7Instance) => {
      console.log('Framework7 is ready!', f7Instance);
      // 當組件掛載時，檢查路由
      console.log('Current route:', f7Instance.views.current.router.url);
    });
  }, []);
  
  // 當語言變更時更新文檔語言
  useEffect(() => {
    document.documentElement.lang = language;
    setLanguage(language);
    // 當語言變更時強制重新渲染
    document.title = language === 'zh-Hant' ? '加班計算器' : 'Overtime Calculator';
    console.log('Language updated:', language);
  }, [language]);
  
  return (
    <ImageContext.Provider value={{ uploadedImage, setUploadedImage }}>
      <App {...f7params}>
        <View main url="/" />
      </App>
    </ImageContext.Provider>
  );
};

export default MyApp; 