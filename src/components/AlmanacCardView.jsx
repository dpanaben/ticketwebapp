import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, List, ListItem } from 'framework7-react';
import { t } from '../utils/i18n';

// 獲取農曆日期
const getLunarDate = () => {
  // 這裡只是簡單示例，實際應該使用專門的農曆日期庫
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  
  return `${year}年${month}月${day}日`;
};

// 獲取宜忌活動
const getActivities = () => {
  // 隨機生成宜忌項目
  const goodActivities = [
    '祭祀', '出行', '結婚', '開業', '入宅', '動土', 
    '安床', '安葬', '納財', '求職', '上梁', '納采'
  ];
  
  const badActivities = [
    '諸事不宜', '破土', '安門', '作灶', '安床', '動土', 
    '伐木', '行喪', '安葬', '出行', '赴任', '嫁娶'
  ];
  
  // 隨機選擇2-4個宜項目
  const goodCount = Math.floor(Math.random() * 3) + 2;
  const good = [];
  for (let i = 0; i < goodCount; i++) {
    const idx = Math.floor(Math.random() * goodActivities.length);
    if (!good.includes(goodActivities[idx])) {
      good.push(goodActivities[idx]);
    }
  }
  
  // 隨機選擇1-3個忌項目
  const badCount = Math.floor(Math.random() * 3) + 1;
  const bad = [];
  for (let i = 0; i < badCount; i++) {
    const idx = Math.floor(Math.random() * badActivities.length);
    if (!bad.includes(badActivities[idx])) {
      bad.push(badActivities[idx]);
    }
  }
  
  return { good, bad };
};

// 根據宜忌數量決定背景顏色
const getBackgroundColor = (good, bad) => {
  if (good.length > bad.length) {
    return "#FFF8E1"; // 吉日：金黃
  } else if (bad.includes('諸事不宜') || bad.length > good.length) {
    return "#FFEBEE"; // 凶日：淡紅
  } else {
    return "#F0F4C3"; // 中性：草綠
  }
};

// 获取日标签
const getDayTag = (good, bad) => {
  if (bad.includes('諸事不宜')) {
    return { label: "🔴 凶日 ⚠️", color: "#E57373" };
  } else if (good.length > bad.length) {
    return { label: "🟢 吉日 ✨", color: "#FBC02D" };
  } else if (bad.length > good.length) {
    return { label: "🔴 凶日 ⚠️", color: "#E57373" };
  } else {
    return { label: "🟡 平日 😐", color: "#AED581" };
  }
};

const AlmanacCardView = () => {
  const [lunarDate, setLunarDate] = useState('');
  const [activities, setActivities] = useState({ good: [], bad: [] });
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    // 取得農曆日期
    setLunarDate(getLunarDate());
    
    // 取得宜忌事項
    setActivities(getActivities());
  }, []);
  
  // 获取背景颜色
  const backgroundColor = getBackgroundColor(activities.good, activities.bad);
  
  // 获取标签
  const tag = getDayTag(activities.good, activities.bad);
  
  // 获取星期几
  const weekday = new Date().toLocaleDateString('zh-Hant', { weekday: 'long' });
  
  return (
    <Card className="almanac-card" style={{ backgroundColor }}>
      <CardContent style={{ paddingTop: '15px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            農民曆
          </div>
          <div style={{ 
            backgroundColor: tag.color,
            borderRadius: '12px',
            padding: '3px 10px',
            fontSize: '12px',
            color: 'white'
          }}>
            {tag.label}
          </div>
        </div>
        
        <div className="lunar-date" style={{ textAlign: 'left', marginBottom: '15px' }}>
          <div style={{ marginBottom: '5px' }}>國曆：{new Date().toLocaleDateString('zh-Hant')} ({weekday})</div>
          <div>農曆：{lunarDate}</div>
        </div>
        
        <div className="activities-container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%',
          marginTop: '10px'
        }}>
          <div className="activities good" style={{ 
            width: '48%', 
            padding: '10px', 
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 153, 0, 0.08)'
          }}>
            <div className="activities-title" style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#090',
              textAlign: 'center'
            }}>宜</div>
            <div className="activities-list" style={{ 
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              {activities.good.join('、')}
            </div>
          </div>
          
          <div className="activities bad" style={{ 
            width: '48%', 
            padding: '10px', 
            borderRadius: '8px',
            backgroundColor: 'rgba(204, 0, 0, 0.08)'
          }}>
            <div className="activities-title" style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#c00',
              textAlign: 'center'
            }}>忌</div>
            <div className="activities-list" style={{ 
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              {activities.bad.join('、')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlmanacCardView; 