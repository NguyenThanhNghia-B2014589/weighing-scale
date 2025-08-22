import React, { useState, useEffect, useMemo } from 'react';

// --- DỮ LIỆU GIẢ LẬP ---
const mockApiData = {
  "123": {
    code: "123",
    name: "Phôi keo A",
    solo: "Lô 1",
    somay: "Máy 1",
    weight: 55.0,
    user: "Nguyễn Văn A",
    time: "12:00 01/01/2025"
  },
  "456": {
    code: "456",
    name: "Phôi keo B",
    solo: "Lô 2",
    somay: "Máy 3",
    weight: 62.5,
    user: "Trần Thị B",
    time: "14:30 02/01/2025"
  }
};

// --- ĐỊNH NGHĨA TYPE CHO DỮ LIỆU ---
type WeighingData = {
  code: string;
  name: string;
  solo: string;
  somay: string;
  weight: number;
  user: string;
  time: string;
};

// --- COMPONENT THÔNG BÁO ---
function Notification({ message, type, onClear }: { message: string; type: 'success' | 'error'; onClear: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      // Bắt đầu animation ẩn sau một khoảng thời gian
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 1500);

      // Xóa state sau khi animation đã hoàn thành (1500ms hiển thị + 500ms animation)
      const clearTimer = setTimeout(() => {
        onClear();
      }, 1500); 

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [message, onClear]);

  if (!message) return null;

  const baseClasses = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 rounded-xl text-white font-bold text-center shadow-lg transition-all duration-500 z-50 flex flex-col items-center justify-center min-w-[300px]";
  const animationClass = isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none';
  const bgColor = type === 'success' ? 'bg-[#B4D080]' : 'bg-[#F97316]';
  const icon = type === 'success'
    ? (
      <svg className="h-16 w-16 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
    : (
      <svg className="h-16 w-16 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.332 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );

  return (
    <div className={`${baseClasses} ${bgColor} ${animationClass}`}>
      {icon}
      <span className="text-2xl">{message}</span>
    </div>
  );
}

// --- COMPONENT CHÍNH ---
function WeighingStation() {
  // --- QUẢN LÝ STATE ---
  const [standardWeight, setStandardWeight] = useState(0.0);
  const [deviationPercent, setDeviationPercent] = useState(3);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [scannedCode, setScannedCode] = useState('');
  const [tableData, setTableData] = useState<WeighingData | null>(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' as 'success' | 'error' });

  // --- BIẾN PHÁI SINH (Derived State) ---
  // Giao diện bị vô hiệu hóa KHI VÀ CHỈ KHI có thông báo
  const isUiDisabled = !!notification.message;

  // --- TÍNH TOÁN CÁC GIÁ TRỊ PHÁI SINH BẰNG `useMemo` ---
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

  // --- XÁC ĐỊNH MÀU SẮC CHO Ô NHẬP TRỌNG LƯỢNG ---
  const weightColorClass = currentWeight !== null && tableData
    ? (isWeightValid ? 'text-green-400' : 'text-red-400')
    : 'text-yellow-400';

  // --- XỬ LÝ SỰ KIỆN ---
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
      setNotification({ message: 'Quét mã thành công!', type: 'success' });
    } else {
      setTableData(null);
      setStandardWeight(0);
      setNotification({ message: 'Mã không hợp lệ!', type: 'error' });
    }
  };

  const handleSubmit = () => {
    if (isWeightValid && tableData) {
      setNotification({ message: 'Lưu thành công!', type: 'success' });
      setCurrentWeight(null);
      setScannedCode('');
      setTableData(null);
      setStandardWeight(0);
    } else {
      setNotification({ message: 'Trọng lượng không hợp lệ!', type: 'error' });
    }
  };

  // --- CHUẨN BỊ DỮ LIỆU CHO BẢNG ---
  const tableHeaders = ["Tên phôi keo", "Số Lô", "Số Máy", "Khối lượng mẻ (kg)", "Người Thao Tác", "Thời gian trộn"];
  const tableValues = tableData
    ? [tableData.name, tableData.solo, tableData.somay, tableData.weight.toFixed(1), tableData.user, tableData.time]
    : Array(tableHeaders.length).fill('');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto relative">
      <Notification 
        message={notification.message}
        type={notification.type}
        onClear={() => setNotification({ message: '', type: 'success' })}
      />
      {isUiDisabled && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40"></div>
      )}
      
      <div className={isUiDisabled ? 'pointer-events-none opacity-50' : ''}>
        {/* --- KHU VỰC HIỂN THỊ TRỌNG LƯỢỢNG --- */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="space-y-3 w-full">
            <h1 className="text-3xl md:text-4xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-yellow-500">Trọng lượng:</span>
              <span>
                <input
                  type='number' 
                  className={`bg-gray-500 font-mono px-4 py-1 rounded w-5/6 sm:w-48 text-left sm:text-center ${weightColorClass}`}
                  placeholder="0.0"
                  value={currentWeight === null ? '' : currentWeight}
                  step="0.1"
                  onChange={handleCurrentWeightChange}
                />
                <span className="text-2xl ml-2 text-gray-700">Kg</span>
              </span>    
            </h1>

            <div className="flex flex-col md:flex-row text-base md:text-lg font-bold text-black">
              <div className="md:w-1/2">
                <span>Trọng lượng tiêu chuẩn:
                  <span className="pl-3 text-2xl md:text-3xl text-green-600 font-bold mt-1">{standardWeight.toFixed(1)}</span>
                </span>
              </div>
              <div className="md:w-1/2 mt-2 md:mt-0">
                <span>Chênh lệch tối đa:
                  <span className="pl-3 text-2xl md:text-3xl text-green-600 font-bold mt-1">{deviationPercent}%</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row text-base md:text-lg font-bold text-black">
              <div className="md:w-1/2">
                <span>MIN:
                  <span className="pl-3 text-2xl md:text-3xl text-black font-bold mt-1">{minWeight.toFixed(1)}</span>
                </span>
              </div>
              <div className="md:w-1/2 mt-2 md:mt-0">
                <span>MAX:
                  <span className="pl-3 text-2xl md:text-3xl text-black font-bold mt-1">{maxWeight.toFixed(1)}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <button 
              className="bg-[#00446e] text-white font-bold w-full md:w-auto px-8 py-3 rounded-lg shadow-md hover:bg-[#003a60] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!isWeightValid || !tableData}
            >
              Hoàn tất
            </button>
          </div>
        </div>

        {/* --- BẢNG THÔNG TIN --- */}
        <div className="mb-8">
          <div className="hidden md:grid grid-cols-6 border-t border-r border-gray-300">
            {tableHeaders.map((header) => ( <div key={header} className="bg-sky-400 text-black font-semibold text-center p-3 border-b border-l border-gray-300">{header}</div> ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 border-r border-b border-gray-300 md:border-t-0">
            {tableValues.map((value, index) => (
              <div key={index} className="bg-gray-100 p-3 md:h-20 border-t border-l border-gray-300 md:border-t-0 flex items-center justify-start md:justify-center font-medium text-gray-800">
                <span className="font-bold md:hidden mr-2">{tableHeaders[index]}: </span>
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* --- KHU VỰC QUÉT MÃ --- */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            className="w-full md:flex-grow border-2 border-green-500 rounded-md p-4 text-center text-2xl font-mono bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
            placeholder="CODE HERE"
            value={scannedCode}
            onChange={handleCodeChange}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          />
          <button
            onClick={handleScan}
            className="bg-green-600 text-white font-bold w-full md:w-auto px-12 py-4 rounded-md text-xl hover:bg-green-700 transition-colors"
          >
            Scan
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeighingStation;