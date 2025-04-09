import React, { useState, useEffect, useContext } from 'react';
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
import { ImageContext } from '../App';

import { isHoliday } from '../utils/OvertimeModel';
import { getSettings, saveSettings, getImage, saveImage, deleteImage } from '../utils/SettingsStore';
import { t } from '../utils/i18n';

const SettingsPage = () => {
  const [settings, setSettings] = useState(getSettings());
  const { uploadedImage, setUploadedImage } = useContext(ImageContext);
  
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
  
  // 調整分鐘
  const incrementMinuteValue = (key) => {
    let newValue = settings[key] + 5;
    if (newValue >= 60) newValue = 0;
    handleSettingChange(key, newValue);
  };
  
  const decrementMinuteValue = (key) => {
    let newValue = settings[key] - 5;
    if (newValue < 0) newValue = 55;
    handleSettingChange(key, newValue);
  };
  
  // 處理圖片上傳
  const handleImageUpload = (e) => {
    console.log('Image upload triggered');
    try {
      const file = e.target.files[0];
      if (!file) {
        console.log('No file selected');
        return;
      }
      
      console.log('File selected:', file.name, file.type, file.size);
      
      // 檢查文件類型
      if (!file.type.match('image.*')) {
        console.error('Invalid file type:', file.type);
        f7.dialog.alert(t('error') + ': ' + t('upload_photo_error'));
        return;
      }
      
      // 檢查文件大小 (限制在10MB以內)
      if (file.size > 10 * 1024 * 1024) {
        console.error('File too large:', file.size);
        f7.dialog.alert(t('error') + ': ' + t('file_too_large'));
        return;
      }
      
      f7.dialog.preloader(t('uploading'));
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const imageData = event.target.result;
          console.log('Image data loaded, length:', imageData.length);
          setUploadedImage(imageData);
          saveImage(imageData);
          
          f7.dialog.close();
          f7.toast.show({
            text: t('upload_success'),
            position: 'center',
            closeTimeout: 2000,
          });
        } catch (error) {
          console.error('Error in reader.onload:', error);
          f7.dialog.close();
          f7.dialog.alert(t('error') + ': ' + error.message);
        }
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        f7.dialog.close();
        f7.dialog.alert(t('error') + ': ' + t('read_file_error'));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      f7.dialog.alert(t('error') + ': ' + error.message);
    }
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
      
      <div className="settings-list-label">{isHoliday() ? t('today_is_holiday') : t('today_is_weekday')}</div>
      
      <List inset className="ios-card">
        <ListItem header={t('work_hours')} groupTitle />
        
        {/* 工作開始時間設定 */}
        <ListItem title={t('work_start')}>
          <div slot="after" className="time-control">
            <button className="time-adjust-button" onClick={() => decrementValue('workStartHour')}>
              <Icon material="remove" />
            </button>
            <span className="time-value">{settings.workStartHour}</span>
            <button className="time-adjust-button" onClick={() => incrementValue('workStartHour')}>
              <Icon material="add" />
            </button>

            <span style={{ margin: '0 8px' }}>:</span>
            
            <button className="time-adjust-button" onClick={() => decrementMinuteValue('workStartMinute')}>
              <Icon material="remove" />
            </button>
            <span className="time-value">
              {settings.workStartMinute < 10 ? '0' + settings.workStartMinute : settings.workStartMinute}
            </span>
            <button className="time-adjust-button" onClick={() => incrementMinuteValue('workStartMinute')}>
              <Icon material="add" />
            </button>
          </div>
        </ListItem>
        
        {/* 工作結束時間設定 */}
        <ListItem title={t('work_end')}>
          <div slot="after" className="time-control">
            <button className="time-adjust-button" onClick={() => decrementValue('workEndHour')}>
              <Icon material="remove" />
            </button>
            <span className="time-value">{settings.workEndHour}</span>
            <button className="time-adjust-button" onClick={() => incrementValue('workEndHour')}>
              <Icon material="add" />
            </button>

            <span style={{ margin: '0 8px' }}>:</span>
            
            <button className="time-adjust-button" onClick={() => decrementMinuteValue('workEndMinute')}>
              <Icon material="remove" />
            </button>
            <span className="time-value">
              {settings.workEndMinute < 10 ? '0' + settings.workEndMinute : settings.workEndMinute}
            </span>
            <button className="time-adjust-button" onClick={() => incrementMinuteValue('workEndMinute')}>
              <Icon material="add" />
            </button>
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
      
      <div className="settings-list-label">{t('salary_settings')}</div>
      
      <List inset className="ios-card">
        {/* 每小時薪資設定 */}
        <ListItem>
          <ListInput
            label={t('hourly_rate')}
            type="number"
            placeholder="0.00"
            value={settings.hourlyRate}
            onInput={(e) => handleSettingChange('hourlyRate', parseFloat(e.target.value) || 0)}
            inputClassName="hourly-rate-input"
          />
        </ListItem>
      </List>
      
      <div className="settings-list-label">{t('emotional_release')}</div>
      
      <List inset>
        <Block strong>
          <p>{t('settings_description')}</p>
        </Block>
        
        {/* Photo Upload Section */}
        <div className="ios-card">
          <div className="photo-upload-container">
            <h3>{t('emotional_release')}</h3>
            
            {uploadedImage ? (
              <div className="uploaded-image-container">
                <img src={uploadedImage} alt={t('uploaded_photo')} className="uploaded-image" />
                <button className="delete-image-button" onClick={handleDeleteImage}>
                  <Icon material="close" />
                </button>
              </div>
            ) : (
              <div className="upload-button-container">
                <label className="upload-photo-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-photo-button">
                    <Icon material="add_photo_alternate" />
                    <span>{t('upload_photo')}</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </List>
    </Page>
  );
};

export default SettingsPage; 