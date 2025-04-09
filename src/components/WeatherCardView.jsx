import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Icon, List, ListItem } from 'framework7-react';
import { t } from '../utils/i18n';

// 模擬天氣數據
const mockWeatherData = () => {
  const weatherTypes = ['sunny', 'cloudy', 'rainy', 'thunderstorm', 'partly-cloudy'];
  const randomType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
  const temperatures = {
    sunny: { current: 28, min: 24, max: 31 },
    cloudy: { current: 24, min: 21, max: 27 },
    rainy: { current: 22, min: 19, max: 24 },
    thunderstorm: { current: 20, min: 18, max: 23 },
    'partly-cloudy': { current: 26, min: 22, max: 29 }
  };
  
  const weatherIcons = {
    sunny: 'wb_sunny',
    cloudy: 'cloud',
    rainy: 'water_drop',
    thunderstorm: 'flash_on',
    'partly-cloudy': 'partially_cloudy_day'
  };
  
  const weatherDescriptions = {
    sunny: '晴天',
    cloudy: '多雲',
    rainy: '雨天',
    thunderstorm: '雷雨',
    'partly-cloudy': '晴時多雲'
  };
  
  return {
    current: {
      type: randomType,
      icon: weatherIcons[randomType],
      description: weatherDescriptions[randomType],
      temperature: temperatures[randomType].current,
      min: temperatures[randomType].min,
      max: temperatures[randomType].max,
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 10) + 5 // 5-15 km/h
    }
  };
};

const WeatherCardView = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHourlyForecast, setShowHourlyForecast] = useState(false);
  
  // 根據時間決定背景顏色
  const isDarkBackground = () => {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18; // 早上6點前或晚上6點後使用深色背景
  };
  
  const backgroundStyle = isDarkBackground() 
    ? { background: 'rgb(26, 26, 51)', color: 'white' }
    : { background: 'rgba(0, 123, 255, 0.3)', color: 'white' };
  
  // 模擬小時預報
  const getHourlyTemperatures = () => {
    const result = [];
    const baseTemp = Math.floor(Math.random() * 10) + 20; // 20-30°C
    
    for (let i = 0; i < 5; i++) { // 生成5個小時的預報
      // 溫度上下波動2度
      result.push(baseTemp + Math.floor(Math.random() * 5) - 2);
    }
    
    return result;
  };
  
  useEffect(() => {
    // 在真實應用中，這裡應該調用實際的天氣API
    setLoading(true);
    
    // 模擬API請求延遲
    setTimeout(() => {
      const data = mockWeatherData();
      // 添加小時預報
      data.hourlyTemperatures = getHourlyTemperatures();
      setWeatherData(data);
      setLoading(false);
    }, 1000);
  }, []);
  
  const toggleHourlyForecast = () => {
    setShowHourlyForecast(!showHourlyForecast);
  };
  
  if (loading) {
    return (
      <Card className="weather-card ios-card" style={backgroundStyle}>
        <CardContent style={{ paddingTop: '15px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>台北市</div>
          <div className="weather-loading">
            <div className="preloader"></div>
            <div>載入中...</div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="weather-card ios-card" style={backgroundStyle}>
      <CardContent style={{ paddingTop: '15px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>台北市</div>
        {weatherData && (
          <>
            <div className="current-weather" onClick={toggleHourlyForecast}>
              <div className="weather-icon">
                <i className="material-icons" style={{ fontSize: '50px' }}>{weatherData.current.icon}</i>
              </div>
              <div className="weather-details">
                <div className="weather-description">{weatherData.current.description}</div>
                <div className="weather-temperature">{weatherData.current.temperature}°C</div>
                <div className="weather-temperature-range">
                  {weatherData.current.min}°C ~ {weatherData.current.max}°C
                </div>
              </div>
              <div className="weather-extra">
                <div className="weather-humidity">
                  <i className="material-icons" style={{ fontSize: '16px' }}>water_drop</i>
                  <span>{weatherData.current.humidity}%</span>
                </div>
                <div className="weather-wind">
                  <i className="material-icons" style={{ fontSize: '16px' }}>air</i>
                  <span>{weatherData.current.windSpeed} km/h</span>
                </div>
              </div>
            </div>
            
            {showHourlyForecast && (
              <div className="hourly-forecast">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginBottom: '10px', padding: '0 10px' }}>
                  {weatherData.hourlyTemperatures.map((temp, index) => {
                    const currentHour = new Date().getHours();
                    const displayHour = (currentHour + index + 1) % 24;
                    
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div>{temp}°C</div>
                        <i className="material-icons" style={{ fontSize: '30px', margin: '5px 0' }}>{weatherData.current.icon}</i>
                        <div>{displayHour}:00</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCardView; 