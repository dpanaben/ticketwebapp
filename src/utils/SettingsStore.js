/**
 * 設定存儲工具
 * 處理用戶偏好設定的保存與讀取
 */

const STORAGE_KEYS = {
  WORK_START_HOUR: 'workStartHour',
  WORK_START_MINUTE: 'workStartMinute',
  WORK_END_HOUR: 'workEndHour',
  WORK_END_MINUTE: 'workEndMinute',
  IGNORE_FIRST_30_MINUTES: 'ignoreFirst30Minutes',
  HOURLY_RATE: 'hourlyRate',
  UPLOADED_IMAGE: 'uploadedImage',
  LANGUAGE: 'language'
};

/**
 * 獲取所有設定
 * @returns {Object} 設定對象
 */
export const getSettings = () => {
  return {
    workStartHour: getItem(STORAGE_KEYS.WORK_START_HOUR, 8),
    workStartMinute: getItem(STORAGE_KEYS.WORK_START_MINUTE, 0),
    workEndHour: getItem(STORAGE_KEYS.WORK_END_HOUR, 17),
    workEndMinute: getItem(STORAGE_KEYS.WORK_END_MINUTE, 0),
    ignoreFirst30Minutes: getItem(STORAGE_KEYS.IGNORE_FIRST_30_MINUTES, false),
    hourlyRate: getItem(STORAGE_KEYS.HOURLY_RATE, 190),
    language: getItem(STORAGE_KEYS.LANGUAGE, 'zh-Hant')
  };
};

/**
 * 保存設定
 * @param {Object} settings - 設定對象
 */
export const saveSettings = (settings) => {
  Object.entries(settings).forEach(([key, value]) => {
    if (STORAGE_KEYS[key.toUpperCase()] || Object.values(STORAGE_KEYS).includes(key)) {
      setItem(key, value);
    }
  });
};

/**
 * 從 localStorage 獲取設定項
 * @param {string} key - 設定鍵名
 * @param {any} defaultValue - 預設值
 * @returns {any} 設定值
 */
export const getItem = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    
    // 嘗試解析 JSON，如果失敗則直接返回值
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch (e) {
      return value;
    }
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return defaultValue;
  }
};

/**
 * 保存設定項到 localStorage
 * @param {string} key - 設定鍵名
 * @param {any} value - 設定值
 */
export const setItem = (key, value) => {
  try {
    // 布林值、數字或對象需要轉為字符串
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value.toString();
    localStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
  }
};

/**
 * 保存上傳的圖片
 * @param {string} imageData - 圖片數據 (Base64)
 */
export const saveImage = (imageData) => {
  setItem(STORAGE_KEYS.UPLOADED_IMAGE, imageData);
};

/**
 * 獲取上傳的圖片
 * @returns {string|null} 圖片數據 (Base64) 或 null
 */
export const getImage = () => {
  return getItem(STORAGE_KEYS.UPLOADED_IMAGE, null);
};

/**
 * 刪除上傳的圖片
 */
export const deleteImage = () => {
  localStorage.removeItem(STORAGE_KEYS.UPLOADED_IMAGE);
};

/**
 * 設置當前語言
 * @param {string} language - 語言代碼 (zh-Hant 或 en)
 */
export const setLanguage = (language) => {
  setItem(STORAGE_KEYS.LANGUAGE, language);
};

/**
 * 獲取當前語言
 * @returns {string} 語言代碼
 */
export const getLanguage = () => {
  try {
    const lang = getItem(STORAGE_KEYS.LANGUAGE, 'zh-Hant');
    console.log('Current language from storage:', lang);
    return lang;
  } catch (error) {
    console.error('Error getting language:', error);
    return 'zh-Hant'; // 默認為繁體中文
  }
}; 