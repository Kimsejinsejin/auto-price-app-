import React from 'react';

export const APP_STORAGE_KEY = 'auto-price-app-data';

// 특정 키의 데이터를 localStorage 로컬 캐시에 저장합니다.
export const saveToLocalStorage = (key: string, data: any) => {
  try {
    const existing = localStorage.getItem(APP_STORAGE_KEY);
    const parsed = existing ? JSON.parse(existing) : {};
    parsed[key] = data;
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

// 특정 키의 데이터를 불러옵니다. 없을 경우 기본값을 반환합니다.
export const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const existing = localStorage.getItem(APP_STORAGE_KEY);
    if (!existing) return defaultValue;
    const parsed = JSON.parse(existing);
    return parsed[key] !== undefined ? parsed[key] : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage', error);
    return defaultValue;
  }
};

// localStorage 전체 데이터를 JSON 파일로 다운로드합니다.
export const exportDataToJSON = () => {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  if (!data) {
    alert('내보낼 데이터가 존재하지 않습니다. 먼저 설정을 저장해주세요.');
    return;
  }
  
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `auto-price-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// JSON 파일을 업로드하여 localStorage 데이터로 복원합니다.
export const importDataFromJSON = (event: React.ChangeEvent<HTMLInputElement>, onComplete: () => void) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const result = e.target?.result as string;
      JSON.parse(result); // 유효한 JSON인지 검증
      localStorage.setItem(APP_STORAGE_KEY, result);
      alert('데이터가 성공적으로 복구되었습니다! 적용을 위해 새로고침됩니다.');
      onComplete(); // 새로고침 함수 발생
    } catch (error) {
      alert('유효하지 않은 업로드 파일입니다. 백업된 JSON 파일만 사용해주세요.');
      console.error(error);
    }
  };
  reader.readAsText(file);
};
