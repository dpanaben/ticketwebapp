import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Page,
  Navbar,
  Block,
  Card,
  CardHeader,
  CardContent,
  f7,
  List,
  ListItem,
  Toggle,
  Button,
  Link,
  Icon
} from 'framework7-react';
import { ImageContext } from '../App';

// 引入工具與自定義組件
import { calculateWorkdayAndOvertime, formatMinutes, formatCurrency, isHoliday } from '../utils/OvertimeModel';
import { getSettings, getImage } from '../utils/SettingsStore';
import { t, getRandomQuote } from '../utils/i18n';
import AlmanacCardView from '../components/AlmanacCardView';
import WeatherCardView from '../components/WeatherCardView';

// 薪資摘要組件
const SalarySummaryView = ({ workdayPay, overtimePay, workdayMinutes, overtimeMinutes, isOvertimeLimitReached }) => {
  console.log('Rendering SalarySummaryView', { workdayPay, overtimePay, isOvertimeLimitReached });
  const totalPay = workdayPay + overtimePay;
  const [isFlipped, setIsFlipped] = useState(false);
  
  // 根據加班時長決定顏色
  const determineColor = () => {
    if (overtimeMinutes === 0) {
      return '#4CAF50'; // 綠色，沒有加班
    } else if (overtimeMinutes < 60) {
      return '#FFC107'; // 黃色，少量加班
    } else if (overtimeMinutes < 180) {
      return '#FF9800'; // 橙色，中等加班
    } else {
      return '#D32F2F'; // 紅色，大量加班
    }
  };
  
  return (
    <div className="card-flip-container">
      <div 
        className={`card-flipper ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* 正面 - 只顯示總薪資 */}
        <Card className="card-face card-front ios-card">
          <CardContent>
            <div className="total-pay-container">
              <div className="total-pay-label">{t('total_pay')}</div>
              <div className="total-pay-amount" style={{ color: determineColor() }}>
                {formatCurrency(totalPay)}
              </div>
              
              {/* 加班上限警示 */}
              {isOvertimeLimitReached && (
                <div className="limit-warning margin-top">
                  <i className="material-icons color-red">warning</i>
                  <span className="text-color-red">{t('overtime_limit_reached')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* 背面 - 只顯示正常與加班薪資 */}
        <Card className="card-face card-back ios-card">
          <CardContent>
            <div className="salary-details-container">
              <div className="salary-detail-item">
                <div className="salary-detail-amount" style={{ color: '#4CAF50' }}>
                  {formatCurrency(workdayPay)}
                </div>
                <div className="salary-detail-label">{t('normal_pay')}</div>
              </div>
              
              <div className="salary-divider"></div>
              
              <div className="salary-detail-item">
                <div className="salary-detail-amount" style={{ color: '#FF9800' }}>
                  {formatCurrency(overtimePay)}
                </div>
                <div className="salary-detail-label">{t('overtime_pay')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 焦慮釋放卡片組件
const AnxietyCardView = ({ tapCount, setTapCount, uploadedImage }) => {
  console.log('Rendering AnxietyCardView', { tapCount, hasImage: !!uploadedImage });
  const maxTapCount = 50;
  const tapPercent = (tapCount / maxTapCount) * 100;
  const [isActive, setIsActive] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  
  // 根據點擊次數決定卡片背景色
  const colorForTapCount = () => {
    switch (true) {
      case (tapCount < 10): return "#D32F2F";
      case (tapCount < 20): return "#FF5722";
      case (tapCount < 30): return "#FF9800";
      case (tapCount < 40): return "#CDDC39";
      case (tapCount < 50): return "#8BC34A";
      default: return "#4CAF50";
    }
  };
  
  // 彩虹顏色數組
  const rainbowColors = [
    '#FF5252', // 紅
    '#FF7043', // 橙
    '#FFCA28', // 黃
    '#66BB6A', // 綠
    '#29B6F6', // 藍
    '#5C6BC0', // 靛
    '#AB47BC'  // 紫
  ];
  
  // 創建彩虹泡泡
  const createBubbles = (e) => {
    // 獲取點擊位置
    const rect = e.currentTarget.getBoundingClientRect();
    let x, y;
    
    if (e.touches) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    // 創建15個新泡泡
    const newBubbles = [];
    for (let i = 0; i < 15; i++) {
      newBubbles.push({
        id: Date.now() + '-' + i,
        x: x + (Math.random() - 0.5) * 100, // 點擊位置附近隨機分佈
        y: y,
        size: Math.floor(Math.random() * 40) + 30, // 30-70px
        color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        speed: Math.random() * 3 + 2, // 2-5的速度
        opacity: 1
      });
    }
    
    // 添加新泡泡到現有泡泡中
    setBubbles(prev => [...prev, ...newBubbles]);
    
    // 3秒後移除這些泡泡
    setTimeout(() => {
      setBubbles(prev => prev.filter(bubble => !newBubbles.find(b => b.id === bubble.id)));
    }, 3000);
  };
  
  // 處理點擊
  const handleTap = (e) => {
    if (tapCount < maxTapCount) {
      setTapCount(prev => prev + 1);
      
      // 震動效果
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      
      // 創建泡泡
      createBubbles(e);
    }
  };
  
  const handleMouseDown = () => {
    setIsActive(true);
  };
  
  const handleMouseUp = () => {
    setIsActive(false);
  };
  
  const handleTouchStart = () => {
    setIsActive(true);
  };
  
  const handleTouchEnd = () => {
    setIsActive(false);
  };
  
  // 根據點擊次數顯示對應的焦慮訊息
  const messageForTapCount = () => {
    switch (true) {
      case (tapCount < 10): return t('anxious_stage_1');
      case (tapCount < 20): return t('anxious_stage_2');
      case (tapCount < 30): return t('anxious_stage_3');
      case (tapCount < 40): return t('anxious_stage_4');
      case (tapCount < 50): return t('anxious_stage_5');
      default: return t('anxious_stage_final');
    }
  };
  
  // 更新所有的泡泡位置
  useEffect(() => {
    if (bubbles.length === 0) return;
    
    const interval = setInterval(() => {
      setBubbles(prev => prev.map(bubble => ({
        ...bubble,
        y: bubble.y - bubble.speed,
        opacity: bubble.opacity >= 0.05 ? bubble.opacity - 0.02 : 0
      })));
    }, 50);
    
    return () => clearInterval(interval);
  }, [bubbles.length]);
  
  useEffect(() => {
    console.log('Uploaded image updated:', uploadedImage);
    // This effect will run whenever uploadedImage changes
  }, [uploadedImage]);
  
  return (
    <Card 
      className="anxiety-card ios-card" 
      style={{ 
        backgroundColor: colorForTapCount(),
        transform: isActive ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 0.1s ease-in-out',
        boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardContent>
        <div 
          className="anxiety-content" 
          onClick={handleTap}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ 
            userSelect: 'none',
            position: 'relative',
            zIndex: 1
          }}
        >
          {uploadedImage ? (
            <>
              <img 
                src={uploadedImage} 
                alt="Anxiety Release" 
                className="anxiety-image"
                style={{ 
                  opacity: Math.max(0.5, 1 - tapCount / maxTapCount),
                  transform: `scale(${1 - tapCount / (maxTapCount * 3)})`,
                }}
              />
              <h2 style={{ 
                color: 'white', 
                fontSize: '36px', 
                fontWeight: 'bold', 
                margin: '0 0 20px', 
                textAlign: 'center',
                userSelect: 'none'
              }}>
                {messageForTapCount()}
              </h2>
            </>
          ) : (
            <h2 style={{ 
              color: 'white', 
              fontSize: '44px', 
              fontWeight: 'bold', 
              marginBottom: '30px', 
              textAlign: 'center',
              userSelect: 'none'
            }}>
              {messageForTapCount()}
            </h2>
          )}
          
          {/* 彩虹泡泡 */}
          {bubbles.map(bubble => (
            <div
              key={bubble.id}
              style={{
                position: 'absolute',
                left: `${bubble.x}px`,
                top: `${bubble.y}px`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                backgroundColor: bubble.color,
                borderRadius: '50%',
                opacity: bubble.opacity,
                boxShadow: `0 0 10px ${bubble.color}`,
                zIndex: 10,
                pointerEvents: 'none',
                transition: 'opacity 0.1s'
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 勞基法引言卡片
const QuoteCard = ({ quote }) => {
  console.log('Rendering QuoteCard', { quote });
  if (!quote) {
    console.error('QuoteCard received empty quote');
    return null;
  }
  
  return (
    <Card className="quote-card ios-card">
      <CardContent>
        <blockquote className="quote-text">
          {quote}
        </blockquote>
      </CardContent>
    </Card>
  );
};

// 主頁面
const HomePage = (props) => {
  console.log('Rendering HomePage', props);
  
  // 狀態
  const { uploadedImage, setUploadedImage } = useContext(ImageContext);
  const [calculationResult, setCalculationResult] = useState({
    workdayMinutes: 0,
    workdayPay: 0,
    overtimeMinutes: 0,
    overtimePay: 0,
    isHoliday: false,
    isOvertimeLimitReached: false
  });
  
  const [settings, setSettings] = useState(getSettings());
  const [tapCount, setTapCount] = useState(0);
  const [quotes, setQuotes] = useState(() => {
    try {
      // 生成三個隨機引言
      const randomQuotes = [
        getRandomQuote(),
        getRandomQuote(),
        getRandomQuote()
      ];
      console.log('Generated quotes', randomQuotes);
      return randomQuotes;
    } catch (error) {
      console.error('Error generating quotes:', error);
      return ['引言加載錯誤', '引言加載錯誤', '引言加載錯誤'];
    }
  });
  
  const timerRef = useRef(null);
  
  // 啟動計時器
  useEffect(() => {
    console.log('HomePage mounted, calculating data...');
    calculateData();
    
    // 每秒更新一次數據
    timerRef.current = setInterval(() => {
      calculateData();
    }, 1000);
    
    // 載入圖片
    try {
      const storedImage = getImage();
      if (storedImage) {
        console.log('Found stored image');
        setUploadedImage(storedImage);
      }
    } catch (error) {
      console.error('Failed to load image:', error);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [settings]);
  
  // 計算數據
  const calculateData = () => {
    try {
      const result = calculateWorkdayAndOvertime(settings);
      setCalculationResult(result);
      
      // 如果達到加班上限，停止計時器
      if (result.isOvertimeLimitReached && timerRef.current) {
        clearInterval(timerRef.current);
        // 移除彈出提示，只在卡片中顯示警告
      }
    } catch (error) {
      console.error('Error calculating data:', error);
    }
  };
  
  // 轉到設定頁面
  const goToSettings = () => {
    f7.views.main.router.navigate('/settings/');
  };
  
  // 切換語言
  const toggleLanguage = () => {
    const currentLanguage = settings.language;
    const newLanguage = currentLanguage === 'zh-Hant' ? 'en' : 'zh-Hant';
    
    const newSettings = {
      ...settings,
      language: newLanguage
    };
    
    setSettings(newSettings);
    localStorage.setItem('language', newLanguage);
    
    // 更新引言
    try {
      setQuotes([
        getRandomQuote(),
        getRandomQuote(),
        getRandomQuote()
      ]);
    } catch (error) {
      console.error('Error updating quotes:', error);
    }
  };

  // 確保所有引言都存在
  const safeQuotes = quotes.map(q => q || '無法載入引言');
  console.log('Safe quotes for rendering:', safeQuotes);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'uploadedImage') {
        const newImage = event.newValue;
        console.log('Local storage updated, new image:', newImage);
        setUploadedImage(newImage);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Page name="home">
      <Navbar>
        <Link slot="left" onClick={toggleLanguage}>
          <i className="material-icons">language</i>
        </Link>
        <Link slot="right" onClick={goToSettings}>
          <i className="material-icons">settings</i>
        </Link>
      </Navbar>
      
      <SalarySummaryView 
        workdayPay={calculationResult.workdayPay}
        overtimePay={calculationResult.overtimePay}
        workdayMinutes={calculationResult.workdayMinutes}
        overtimeMinutes={calculationResult.overtimeMinutes}
        isOvertimeLimitReached={calculationResult.isOvertimeLimitReached}
      />
      
      {/* 第一個引言卡片 */}
      {safeQuotes[0] && <QuoteCard quote={safeQuotes[0]} />}
      
      {/* 添加農民曆卡片 */}
      <AlmanacCardView />
      
      {/* 第二個引言卡片 */}
      {safeQuotes[1] && <QuoteCard quote={safeQuotes[1]} />}
      
      <AnxietyCardView 
        tapCount={tapCount}
        setTapCount={setTapCount}
        uploadedImage={uploadedImage}
      />
      
      {/* 第三個引言卡片 */}
      {safeQuotes[2] && <QuoteCard quote={safeQuotes[2]} />}
      
      {/* 添加天氣卡片 */}
      <WeatherCardView />
    </Page>
  );
};

export default HomePage; 