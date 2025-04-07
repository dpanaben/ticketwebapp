/**
 * 加班計算工具
 * 實現與 iOS 應用程式相同的加班計算邏輯
 */

// 工作時間預設值
const DEFAULT_SETTINGS = {
  workStartHour: 8,
  workStartMinute: 0,
  workEndHour: 17,
  workEndMinute: 0,
  ignoreFirst30Minutes: false,
  hourlyRate: 190 // 勞基法基本時薪(2025年)
};

/**
 * 檢查是否為假日（週六、週日）
 * @returns {boolean} 是否為假日
 */
export const isHoliday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 是星期日，6 是星期六
};

/**
 * 獲取加班開始時間
 * @param {Object} params - 參數對象
 * @param {boolean} params.isHoliday - 是否為假日
 * @param {number} params.workStartHour - 上班小時
 * @param {number} params.workStartMinute - 上班分鐘
 * @param {number} params.workEndHour - 下班小時
 * @param {number} params.workEndMinute - 下班分鐘
 * @param {boolean} params.ignoreFirst30Minutes - 是否忽略下班後30分鐘
 * @returns {Date} 加班開始時間
 */
export const getOvertimeStartTime = ({
  isHoliday,
  workStartHour,
  workStartMinute,
  workEndHour,
  workEndMinute,
  ignoreFirst30Minutes
}) => {
  const now = new Date();
  const overtimeDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    isHoliday ? workStartHour : workEndHour,
    isHoliday ? workStartMinute : workEndMinute,
    0
  );
  
  // 平日且需忽略前30分鐘，加班時間延後30分鐘
  if (!isHoliday && ignoreFirst30Minutes) {
    overtimeDate.setMinutes(overtimeDate.getMinutes() + 30);
  }
  
  return overtimeDate;
};

/**
 * 計算工作日和加班時間、薪資
 * @param {Object} settings - 工作設定
 * @returns {Object} 計算結果
 */
export const calculateWorkdayAndOvertime = (settings = DEFAULT_SETTINGS) => {
  const {
    workStartHour,
    workStartMinute,
    workEndHour,
    workEndMinute,
    ignoreFirst30Minutes,
    hourlyRate
  } = settings;
  
  const now = new Date();
  const isWeekend = isHoliday();
  
  // 計算上班時間
  const workStartTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    workStartHour,
    workStartMinute,
    0
  );
  
  // 計算下班時間
  const workEndTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    workEndHour,
    workEndMinute,
    0
  );
  
  // 計算午休時間（12:00-13:00）
  const lunchStartTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    12,
    0,
    0
  );
  
  const lunchEndTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    13,
    0,
    0
  );
  
  // 計算正常工時
  let elapsedWorkSeconds = 0;
  if (!isWeekend) {
    elapsedWorkSeconds = Math.max(
      0,
      Math.min(
        Math.floor((now - workStartTime) / 1000),
        Math.floor((workEndTime - workStartTime) / 1000)
      )
    );
    
    // 扣除午休時間
    if (now > lunchStartTime) {
      const lunchDeduction = Math.min(
        Math.floor((now - lunchStartTime) / 1000),
        Math.floor((lunchEndTime - lunchStartTime) / 1000)
      );
      elapsedWorkSeconds = Math.max(0, elapsedWorkSeconds - lunchDeduction);
    }
  }
  
  // 計算正常工時和薪資
  const workdayMinutes = Math.floor(elapsedWorkSeconds / 60);
  const workdayPay = (elapsedWorkSeconds / 3600) * hourlyRate;
  
  // 計算加班時間
  const overtimeStartTime = getOvertimeStartTime({
    isHoliday: isWeekend,
    workStartHour,
    workStartMinute,
    workEndHour,
    workEndMinute,
    ignoreFirst30Minutes
  });
  
  const totalOvertimeSeconds = Math.max(0, Math.floor((now - overtimeStartTime) / 1000));
  const overtimeMinutes = Math.floor(totalOvertimeSeconds / 60);
  
  // 計算加班上限（假日12小時，平日4小時）
  const maxOvertimeSeconds = isWeekend ? 720 * 60 : 240 * 60;
  const finalOvertimeSeconds = Math.min(totalOvertimeSeconds, maxOvertimeSeconds);
  const overtimeHours = finalOvertimeSeconds / 3600;
  
  // 根據勞基法計算加班費
  const firstTwoHours = Math.min(overtimeHours, 2); // 前2小時 1.34倍
  const afterTwoHours = Math.max(0, overtimeHours - 2); // 之後 1.67倍
  
  const overtimePay = 
    (firstTwoHours * hourlyRate * 1.34) + 
    (afterTwoHours * hourlyRate * 1.67);
  
  // 檢查是否達到加班上限
  const isOvertimeLimitReached = isWeekend 
    ? overtimeMinutes >= 720  // 假日加班上限12小時
    : overtimeMinutes >= 240; // 平日加班上限4小時
  
  return {
    workdayMinutes,
    workdayPay,
    overtimeMinutes,
    overtimePay,
    isOvertimeLimitReached,
    isHoliday: isWeekend
  };
};

/**
 * 根據加班分鐘數格式化時間顯示
 * @param {number} minutes - 分鐘數
 * @returns {string} 格式化的時間字串（例：2小時30分）
 */
export const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}分鐘`;
  } else {
    return `${hours}小時${mins > 0 ? `${mins}分鐘` : ''}`;
  }
};

/**
 * 格式化金額顯示
 * @param {number} amount - 金額
 * @returns {string} 格式化的金額字串
 */
export const formatCurrency = (amount) => {
  return `NT$ ${amount.toFixed(2)}`;
};

/**
 * 保存加班記錄
 * @param {Object} record - 加班記錄
 */
export const saveOvertimeRecord = (record) => {
  const records = getOvertimeRecords();
  records.push({
    ...record,
    id: Date.now(),
    date: new Date().toISOString()
  });
  
  localStorage.setItem('overtimeRecords', JSON.stringify(records));
};

/**
 * 獲取所有加班記錄
 * @returns {Array} 加班記錄列表
 */
export const getOvertimeRecords = () => {
  try {
    const records = localStorage.getItem('overtimeRecords');
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Error getting overtime records:', error);
    return [];
  }
};

/**
 * 清除所有加班記錄
 */
export const clearOvertimeRecords = () => {
  localStorage.removeItem('overtimeRecords');
}; 