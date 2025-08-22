// src/components/useWeighingStation.ts

import { useState, useMemo } from 'react';
import { useNotification } from '../ui/Notification/useNotification';

// --- DỮ LIỆU GIẢ LẬP VÀ TYPES (Giữ nguyên ở đây hoặc chuyển ra file riêng) ---
const mockApiData = {
  "123": { code: "123", name: "Phôi keo A", solo: "Lô 1", somay: "Máy 1", weight: 55.0, user: "Nguyễn Văn A", time: "12:00 01/01/2025" },
  "456": { code: "456", name: "Phôi keo B", solo: "Lô 2", somay: "Máy 3", weight: 62.5, user: "Trần Thị B", time: "14:30 02/01/2025" }
};

type WeighingData = {
  code: string; name: string; solo: string; somay: string; weight: number; user: string; time: string;
};

// --- ĐỊNH NGHĨA CUSTOM HOOK ---
export function useWeighingStation() {
  // --- TẤT CẢ STATE ĐƯỢC CHUYỂN VÀO ĐÂY ---
  const [standardWeight, setStandardWeight] = useState(0.0);
  const [deviationPercent, setDeviationPercent] = useState(3);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [scannedCode, setScannedCode] = useState('');
  const [tableData, setTableData] = useState<WeighingData | null>(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const { showNotification, notificationMessage, notificationType } = useNotification();

  // --- TẤT CẢ LOGIC TÍNH TOÁN (useMemo) ĐƯỢC CHUYỂN VÀO ĐÂY ---
  const { minWeight, maxWeight } = useMemo(() => {
    const deviationAmount = standardWeight * (deviationPercent / 100);
    const min = standardWeight - deviationAmount;
    const max = standardWeight + deviationAmount;
    return { minWeight: min, maxWeight: max };
  }, [standardWeight, deviationPercent]);

  const isWeightValid = useMemo(() => {
    if (currentWeight === null || !tableData) return false;
    return currentWeight >= minWeight && currentWeight <= maxWeight;
  }, [currentWeight, minWeight, maxWeight, tableData]);

  

  // --- TẤT CẢ CÁC HÀM XỬ LÝ SỰ KIỆN ĐƯỢC CHUYỂN VÀO ĐÂY ---
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScannedCode(event.target.value);
  };

  const handleCurrentWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrentWeight(value === '' ? null : parseFloat(value));
  };

  const handleScan = () => {
    const foundData = mockApiData[scannedCode as keyof typeof mockApiData];
    if (foundData) {
      setTableData(foundData);
      setStandardWeight(foundData.weight);
      //showNotification('Quét mã thành công!', 'success');
    } else {
      setTableData(null);
      setStandardWeight(0);
      //showNotification('Mã không hợp lệ!', 'error');
    }
  };

  const handleSubmit = () => {
    if (isWeightValid && tableData) {
       showNotification('Lưu thành công!', 'success');
      setCurrentWeight(null);
      setScannedCode('');
      setTableData(null);
      setStandardWeight(0);
    } else {
      showNotification('Trọng lượng không hợp lệ!', 'error');
    }
  };
  
  // --- TRẢ VỀ MỘT OBJECT CHỨA TẤT CẢ NHỮNG GÌ COMPONENT UI CẦN ---
  return {
    // State values
    standardWeight,
    deviationPercent,
    currentWeight,
    scannedCode,
    tableData,
    notification,
    // Derived values
    minWeight,
    maxWeight,
    isWeightValid,
    notificationMessage,
    notificationType,
    // Handlers
    handleCodeChange,
    handleCurrentWeightChange,
    handleScan,
    handleSubmit,
    setNotification, // Trả về hàm này để component UI có thể xóa thông báo
  };
}