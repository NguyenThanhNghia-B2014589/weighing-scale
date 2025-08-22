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
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1500); // Ẩn dần sau 2.5 giây
      const clearTimer = setTimeout(() => {
        onClear();
      }, 1500); // Clear state sau 3 giây
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [message, onClear]);


  if (!message) return null;

  // Lớp Tailwind CSS cho thông báo
  const baseClasses = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 rounded-xl text-white font-bold text-center shadow-lg transition-transform duration-500 z-50 flex flex-col items-center justify-center min-w-[300px]";
  const animationClass = isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90';

  // Định nghĩa màu nền và biểu tượng dựa trên loại thông báo
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

function WeighingStation() {
  // --- QUẢN LÝ STATE ---
  const [standardWeight, setStandardWeight] = useState(0.0);
  const [deviationPercent, setDeviationPercent] = useState(3);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null); // Lưu trọng lượng hiện tại dưới dạng số hoặc null (khi trống) để tính toán dễ dàng hơn
  const [scannedCode, setScannedCode] = useState('');
  const [tableData, setTableData] = useState<WeighingData | null>(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const [isUiDisabled, setIsUiDisabled] = useState(false);

  // --- TÍNH TOÁN CÁC GIÁ TRỊ PHÁI SINH BẰNG `useMemo` ĐỂ TỐI ƯU HIỆU NĂNG ---
  // Các giá trị này chỉ được tính toán lại khi standardWeight hoặc deviationPercent thay đổi
  const { minWeight, maxWeight } = useMemo(() => {
    const deviationAmount = standardWeight * (deviationPercent / 100);
    const min = standardWeight - deviationAmount;
    const max = standardWeight + deviationAmount;
    return { minWeight: min, maxWeight: max };
  }, [standardWeight, deviationPercent]);

  // --- KIỂM TRA TÍNH HỢP LỆ CỦA TRỌNG LƯỢNG ---
  // `useMemo` cũng rất phù hợp ở đây, nó sẽ tính toán lại khi các giá trị phụ thuộc thay đổi
  const isWeightValid = useMemo(() => {
    if (currentWeight === null || !tableData) {
      return false;
    }
    return currentWeight >= minWeight && currentWeight <= maxWeight;
  }, [currentWeight, minWeight, maxWeight, tableData]);

  // --- XÁC ĐỊNH MÀU SẮC CHO Ô NHẬP TRỌNG LƯỢNG ---
  const weightColorClass = currentWeight !== null && tableData
    ? (isWeightValid ? 'text-green-400' : 'text-red-400')
    : 'text-yellow-400'; // Màu mặc định khi chưa nhập

  // --- XỬ LÝ SỰ KIỆN ---
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScannedCode(event.target.value);
  };

  const handleCurrentWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Nếu ô input trống, set state là null. Nếu không, chuyển thành số.
    setCurrentWeight(value === '' ? null : parseFloat(value));
  };

  // Xử lý sự kiện khi người dùng quét mã
  const handleScan = () => {
    // Tìm kiếm dữ liệu dựa trên mã đã quét
    const foundData = mockApiData[scannedCode as keyof typeof mockApiData];

    if (foundData) {
      setTableData(foundData);
      setStandardWeight(foundData.weight);
      setNotification({ message: 'Quét mã thành công!', type: 'success' });
    } else {
      setTableData(null);
      setStandardWeight(0);
      setNotification({ message: 'Mã không hợp lệ! Vui lòng thử lại.', type: 'error' });
    }
    setIsUiDisabled(true);
  };
  // Xử lý sự kiện khi người dùng nhấn nút "Hoàn tất"
  const handleSubmit = () => {
    if (isWeightValid && tableData) {
      setNotification({ message: 'Trọng lượng hợp lệ! Dữ liệu đã được lưu.', type: 'success' });
      // Reset lại trạng thái sau khi hoàn tất
      setCurrentWeight(null);
      setScannedCode('');
      setTableData(null);
      setStandardWeight(0);
    } else {
      setNotification({ message: 'Trọng lượng không hợp lệ!', type: 'error' });
    }
    setIsUiDisabled(true);
  };

  // --- CHUẨN BỊ DỮ LIỆU CHO BẢNG ---
  const tableHeaders = ["Tên phôi keo", "Số Lô", "Số Máy", "Khối lượng mẻ (kg)", "Người Thao Tác", "Thời gian trộn"];
  const tableValues = tableData
    ? [tableData.name, tableData.solo, tableData.somay, tableData.weight.toFixed(1), tableData.user, tableData.time]
    : Array(tableHeaders.length).fill('');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Notification 
        message={notification.message}
        type={notification.type}
        onClear={() => {
          setNotification({ message: '', type: 'success' });
          setIsUiDisabled(false);
        }}
      />
      {isUiDisabled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"></div>
      )}
      {/* --- KHU VỰC HIỂN THỊ TRỌNG LƯỢNG --- */}
      <div className={`flex justify-between items-start mb-8 ${isUiDisabled ? 'pointer-events-none' : ''}`}>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">
            <span className="text-yellow-500">Trọng lượng:</span>
            < input
              type='number' 
              className={`ml-4 bg-gray-500 font-mono px-4 py-1 rounded w-48 text-center ${weightColorClass}`}
              placeholder="0.0"
              value={currentWeight === null ? '' : currentWeight}
              step="0.1"
              onChange={handleCurrentWeightChange}
              disabled={isUiDisabled}
            />
            <span className="text-3xl ml-2 text-gray-500">Kg</span>
          </h1>

          {/* Hiển thị các giá trị từ state và tính toán */}
          <p className="text-lg font-bold text-black ">
            Trọng lượng tiêu chuẩn: <span className="inline-block w-16 text-green-600">{standardWeight.toFixed(1)}</span>
            <span className="ml-8">Chênh lệch tối đa: <span className="inline-block w-16 text-green-600">{deviationPercent}%</span></span>
          </p>
          <p className="text-lg font-bold text-black">
              MIN: <span className="inline-block w-16 font-normal">{minWeight.toFixed(1)}</span>
            <span className="ml-16">
              MAX: <span className="inline-block w-16 font-normal">{maxWeight.toFixed(1)}</span>
            </span>
          </p>
        </div>  
        <div>
          <button 
            className="bg-[#00446e] text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-[#003a60] transition-colors"
            onClick={handleSubmit}
            disabled={!tableData || isUiDisabled}
          >
            Hoàn tất
          </button>
        </div>
      </div>

      {/* --- BẢNG THÔNG TIN --- */}
      <div className={`mb-8 ${isUiDisabled ? 'pointer-events-none' : ''}`}>
        <div className="grid grid-cols-6 border border-gray-300">
          {/* Tiêu đề bảng */}
          {tableHeaders.map((header) => (
            <div key={header} className="bg-sky-400 text-black font-semibold text-center p-3 border-l border-gray-300">
              {header}
            </div>
          ))}
          {/* Các ô dữ liệu (6 ô trống) */}
          {tableValues.map((value, index) => (
            <div key={index} className="bg-gray-100 h-20 border-b border-l border-gray-300 flex items-center justify-center font-medium text-gray-800">
              {value}
            </div>
          ))}
        </div>
      </div>

      {/* --- KHU VỰC QUÉT MÃ --- */}
      <div className={`flex items-center gap-6 ${isUiDisabled ? 'pointer-events-none' : ''}`}>
        <input
          type="text"
          className="flex-grow border-2 border-green-500 rounded-md p-4 text-center text-2xl font-mono bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
          placeholder="CODE HERE"
          value={scannedCode}
          onChange={handleCodeChange}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
        />
        <button
          onClick={handleScan}
          className="bg-green-600 text-white font-bold px-12 py-4 rounded-md text-xl hover:bg-green-700 transition-colors"
          disabled={isUiDisabled}
        >
          Scan
        </button>
      </div>
    </div>
  );
}

export default WeighingStation;