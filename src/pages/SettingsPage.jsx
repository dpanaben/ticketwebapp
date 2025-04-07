import React, { useState, useEffect } from 'react';
import {
  Page,
  Navbar,
  List,
  ListItem,
  ListInput,
  Toggle,
  Block,
  Button,
  Icon,
  f7
} from 'framework7-react';

import { isHoliday } from '../utils/OvertimeModel';
import { getSettings, saveSettings, getImage, saveImage, deleteImage } from '../utils/SettingsStore';
import { t } from '../utils/i18n';

const SettingsPage = () => {
  const [settings, setSettings] = useState(getSettings());
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // 初始化設定
  useEffect(() => {
    // 載入圖片
    const image = getImage();
    if (image) {
      setUploadedImage(image);
    }
  }, []);
  
  // 處理設定變更
  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };
  
  // 增加數值
  const incrementValue = (key, maxValue = 23) => {
    const newValue = (settings[key] + 1) % (maxValue + 1);
    handleSettingChange(key, newValue);
  };
  
  // 減少數值
  const decrementValue = (key, maxValue = 23) => {
    const newValue = (settings[key] - 1 + (maxValue + 1)) % (maxValue + 1);
    handleSettingChange(key, newValue);
  };
  
  // 處理圖片上傳
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 檢查文件類型
    if (!file.type.match('image.*')) {
      f7.dialog.alert(t('error') + ': ' + t('upload_photo_error'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const imageData = event.target.result;
      setUploadedImage(imageData);
      saveImage(imageData);
      
      f7.toast.show({
        text: t('upload_success'),
        position: 'center',
        closeTimeout: 2000,
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  // 刪除上傳的圖片
  const handleDeleteImage = () => {
    f7.dialog.confirm(
      t('confirm_delete_photo'),
      t('confirm'),
      () => {
        setUploadedImage(null);
        deleteImage();
        
        f7.toast.show({
          text: t('delete_success'),
          position: 'center',
          closeTimeout: 2000,
        });
      }
    );
  };
  
  // 格式化時間顯示
  const formatTime = (hour, minute) => {
    return `${hour}:${minute < 10 ? '0' + minute : minute}`;
  };

  return (
    <Page name="settings">
      <Navbar title={t('settings')} backLink={t('back')} />
      
      <Block>
        <h2 className="text-align-center">
          {isHoliday() ? t('today_is_holiday') : t('today_is_weekday')}
        </h2>
      </Block>
      
      <List>
        <ListItem header={t('work_hours')} groupTitle />
        
        {/* 工作開始時間設定 */}
        <ListItem title={t('work_start')}>
          <div slot="after" className="stepper-container">
            <Button small onClick={() => decrementValue('workStartHour')}>
              <Icon f7="minus" />
            </Button>
            <span className="time-display">{formatTime(settings.workStartHour, settings.workStartMinute)}</span>
            <Button small onClick={() => incrementValue('workStartHour')}>
              <Icon f7="plus" />
            </Button>
          </div>
        </ListItem>
        
        {/* 工作結束時間設定 */}
        <ListItem title={t('work_end')}>
          <div slot="after" className="stepper-container">
            <Button small onClick={() => decrementValue('workEndHour')}>
              <Icon f7="minus" />
            </Button>
            <span className="time-display">{formatTime(settings.workEndHour, settings.workEndMinute)}</span>
            <Button small onClick={() => incrementValue('workEndHour')}>
              <Icon f7="plus" />
            </Button>
          </div>
        </ListItem>
        
        {/* 忽略下班後30分鐘設定 */}
        <ListItem>
          <span>{t('ignore_first_30_minutes')}</span>
          <Toggle 
            checked={settings.ignoreFirst30Minutes}
            onChange={(e) => handleSettingChange('ignoreFirst30Minutes', e.target.checked)}
          />
        </ListItem>
      </List>
      
      <List>
        <ListItem header={t('salary_settings')} groupTitle />
        
        {/* 每小時薪資設定 */}
        <ListItem>
          <ListInput
            label={t('hourly_rate')}
            type="number"
            placeholder="0.00"
            value={settings.hourlyRate}
            onInput={(e) => handleSettingChange('hourlyRate', parseFloat(e.target.value) || 0)}
          />
        </ListItem>
      </List>
      
      <List>
        <ListItem header={t('emotional_release')} groupTitle />
        
        <Block className="photo-upload-container">
          {uploadedImage && (
            <div className="uploaded-image-container">
              <img 
                src={uploadedImage}
                alt="Upload" 
                className="uploaded-image"
              />
              <Button fill color="red" onClick={handleDeleteImage}>
                {t('delete_photo')}
              </Button>
            </div>
          )}
          
          {!uploadedImage && (
            <div className="upload-button-container">
              <label className="custom-file-upload">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <Button fill>
                  <Icon f7="camera" />
                  <span>{t('upload_photo')}</span>
                </Button>
              </label>
            </div>
          )}
        </Block>
      </List>
    </Page>
  );
};

export default SettingsPage; 