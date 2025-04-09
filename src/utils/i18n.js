/**
 * 多語言支援工具
 * 提供翻譯和語言切換功能
 */

import { getLanguage } from './SettingsStore';

// 語言庫
const translations = {
  'zh-Hant': {
    // 主介面
    app_name: '加班計算器',
    today_is_holiday: '今天是假日',
    today_is_weekday: '今天是平日',
    
    // 薪資摘要
    normal_pay: '正常薪資',
    overtime_pay: '加班薪資',
    total_pay: '總薪資',
    normal_hours: '正常工時',
    overtime_hours: '加班工時',
    salary_details: '薪資詳情',
    
    // 加班計算
    start_time: '開始時間',
    end_time: '結束時間',
    calculate: '計算加班時數和費用',
    calculation_result: '計算結果',
    overtime_limit_reached: '已達加班上限',
    
    // 設定頁面
    settings: '設定',
    work_hours: '工作時間設定',
    work_start: '上班時間',
    work_end: '下班時間',
    ignore_first_30_minutes: '忽略下班後 30 分鐘',
    salary_settings: '薪資設定',
    hourly_rate: '每小時薪資',
    
    // 圖片上傳
    emotional_release: '情緒發洩',
    upload_photo: '上傳照片',
    upload_success: '上傳成功',
    upload_photo_error: '請選擇有效的圖片文件',
    delete_photo: '刪除圖片',
    confirm_delete_photo: '確定要刪除此圖片嗎？',
    delete_success: '刪除成功',
    confirm: '確認',
    uploading: '上傳中...',
    file_too_large: '文件太大，請選擇小於10MB的圖片',
    read_file_error: '讀取文件時出錯',
    
    // 焦慮階段
    anxious_stage_1: '我很焦慮',
    anxious_stage_2: '減輕一些了',
    anxious_stage_3: '比剛才好些了',
    anxious_stage_4: '差不多了',
    anxious_stage_5: '好多了',
    anxious_stage_final: '我他媽好多了',
    
    // 引言
    labor_law_quotes: [
      '根據勞基法第三十二條，每日正常工作時間不得超過八小時，每週不得超過四十小時。',
      '勞基法規定，延長工作時間連同正常工作時間，一日不得超過十二小時。',
      '根據勞基法，雇主延長勞工工作時間者，應依規定給予加班費。',
      '勞基法第三十六條規定，勞工每七日中應有二日之休息，其中一日為例假。',
      '勞基法規定，雇主應依約定給付勞工工資，且不得低於基本工資。',
      '依照勞基法，加班費第一個小時為平日薪資的 1.34 倍，第二個小時後為 1.67 倍。',
      '根據勞基法，勞工每年應有特別休假，特休未休完雇主應發給工資。',
      '勞基法規定，勞工請婚假、喪假、病假等，雇主應給予相應的假期。',
      '勞基法第十六條規定，雇主不得預扣勞工工資作為違約金。',
      '勞基法規定，雇主不得強制勞工在休假日工作。'
    ],
    
    // 其他
    save: '儲存',
    cancel: '取消',
    back: '返回',
    loading: '加載中...',
    error: '發生錯誤',
    success: '成功'
  },
  'en': {
    // Main Interface
    app_name: 'Overtime Calculator',
    today_is_holiday: 'Today is a holiday',
    today_is_weekday: 'Today is a workday',
    
    // Salary Summary
    normal_pay: 'Normal Pay',
    overtime_pay: 'Overtime Pay',
    total_pay: 'Total Pay',
    normal_hours: 'Normal Hours',
    overtime_hours: 'Overtime Hours',
    salary_details: 'Salary Details',
    
    // Overtime Calculation
    start_time: 'Start Time',
    end_time: 'End Time',
    calculate: 'Calculate Overtime',
    calculation_result: 'Calculation Result',
    overtime_limit_reached: 'Overtime Limit Reached',
    
    // Settings Page
    settings: 'Settings',
    work_hours: 'Work Hours Settings',
    work_start: 'Work Start',
    work_end: 'Work End',
    ignore_first_30_minutes: 'Ignore First 30 Minutes After Work',
    salary_settings: 'Salary Settings',
    hourly_rate: 'Hourly Rate',
    
    // Photo Upload
    emotional_release: 'Emotional Release',
    upload_photo: 'Upload Photo',
    upload_success: 'Upload Successful',
    upload_photo_error: 'Please select a valid image file',
    delete_photo: 'Delete Photo',
    confirm_delete_photo: 'Are you sure you want to delete this photo?',
    delete_success: 'Delete Successful',
    confirm: 'Confirm',
    uploading: 'Uploading...',
    file_too_large: 'File is too large, please select an image less than 10MB',
    read_file_error: 'Error reading the file',
    
    // Anxiety Stages
    anxious_stage_1: 'I feel anxious',
    anxious_stage_2: 'Feeling better',
    anxious_stage_3: 'Getting better',
    anxious_stage_4: 'Almost there',
    anxious_stage_5: 'Much better',
    anxious_stage_final: 'I feel f**king better',
    
    // Quotes
    labor_law_quotes: [
      'According to Labor Standards Act Article 32, regular working hours shall not exceed 8 hours per day and 40 hours per week.',
      'Labor law stipulates that working hours including overtime shall not exceed 12 hours per day.',
      'According to labor law, employers must pay overtime for extended working hours.',
      'Labor Standards Act Article 36 states that workers shall have two days off every seven days, one of which is a regular day off.',
      'Labor law requires employers to pay wages as agreed, and not less than the minimum wage.',
      'According to labor law, overtime pay is 1.34 times the regular rate for the first hour, and 1.67 times after.',
      'Labor law provides for annual leave, and employers must pay wages for any unused leave.',
      'Labor law stipulates that employers must provide appropriate leave for marriage, bereavement, illness, etc.',
      'Labor Standards Act Article 16 prohibits employers from deducting wages as penalties.',
      'Labor law prohibits employers from forcing employees to work on rest days.'
    ],
    
    // Others
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  }
};

/**
 * 獲取翻譯文本
 * @param {string} key - 翻譯鍵名
 * @param {string} [language] - 語言代碼，若不提供則使用當前語言
 * @returns {string} 翻譯文本
 */
export const t = (key, language = null) => {
  try {
    const currentLang = language || getLanguage();
    console.log(`Translation: key=${key}, language=${currentLang}`);
    
    const langData = translations[currentLang] || translations['zh-Hant'];
    
    if (!langData) {
      console.error(`No translation data for language: ${currentLang}`);
      return key;
    }
    
    const rawValue = langData[key];
    
    if (rawValue === undefined) {
      console.error(`Translation key not found: ${key}`);
      return key;
    }
    
    if (Array.isArray(rawValue)) {
      // 若是陣列（如引言），隨機返回一個
      const array = rawValue;
      if (array.length === 0) {
        console.error(`Empty array for translation key: ${key}`);
        return key;
      }
      
      const randomIndex = Math.floor(Math.random() * array.length);
      console.log(`Selecting random item [${randomIndex}] from array of length ${array.length}`);
      return array[randomIndex] || key;
    }
    
    return rawValue;
  } catch (error) {
    console.error(`Translation error for key "${key}":`, error);
    return key;
  }
};

/**
 * 獲取隨機勞基法引言
 * @returns {string} 隨機引言
 */
export const getRandomQuote = () => {
  try {
    const quote = t('labor_law_quotes');
    console.log('Generated random quote:', quote);
    if (!quote) {
      console.error('Empty quote returned from t()');
      return '勞動法規定，每週工作時間不得超過40小時';
    }
    return quote;
  } catch (error) {
    console.error('Error getting random quote:', error);
    return '勞動法規定，每週工作時間不得超過40小時';
  }
};

/**
 * 檢查當前是否為繁體中文
 * @returns {boolean} 是否為繁體中文
 */
export const isTraditionalChinese = () => {
  return getLanguage() === 'zh-Hant';
};

/**
 * 切換語言
 * @returns {string} 切換後的語言代碼
 */
export const toggleLanguage = () => {
  const currentLang = getLanguage();
  const newLang = currentLang === 'zh-Hant' ? 'en' : 'zh-Hant';
  return newLang;
}; 