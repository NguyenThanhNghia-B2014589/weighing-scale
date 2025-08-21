import React, { useState, useEffect } from 'react';

  // Dữ liệu giả lập
  const testData = {
    code: "123",
    name: "Phôi keo A",
    solo: "Lô 1",
    somay: "Máy 1",
    weight: 55.0,
    user: "Nguyễn Văn A",
    time: "12:00 01/01/2025"
  };

  type WeighingData = typeof testData | null;

function WeighingStation() {

  // Sử dụng useState để quản lý dữ liệu
  const [standardWeight, setStandardWeight] = useState(0.0);  //Lưu khối lượng tiêu chuẩn dưới dạng số (8.0 kg)
  const [deviationPercent, setDeviationPercent] = useState(3); // Lưu chênh lệch tối đa dưới dạng số (%)
  const [currentWeight, setCurrentWeight] = useState(''); // Lưu trọng lượng hiện tại dưới dạng số (8.8 kg)
  const [scannedCode, setScannedCode] = useState(''); // Lưu mã đã quét dưới dạng chuỗi
  const [tableData, setTableData] = useState<WeighingData>(null); // Lưu dữ liệu bảng
  const [isWeightValid, setIsWeightValid] = useState(false); // Kiểm tra tính hợp lệ của trọng lượng

  // --- PHẦN LOGIC TÍNH TOÁN TỰ ĐỘNG ---
  // Tính toán giá trị chênh lệch thực tế
  const deviationAmount = standardWeight * (deviationPercent / 100);

  // Tính toán MIN và MAX dựa trên các giá trị trên
  const minWeight = standardWeight - deviationAmount;
  const maxWeight = standardWeight + deviationAmount;

  // Tạo hàm này để cập nhật state mỗi khi người dùng gõ phím
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScannedCode(event.target.value);
  };

  const handleCurentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentWeight(event.target.value);
  }
  //const handleCurentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //setCurrentWeight(event.target.value ? parseFloat(event.target.value) : 0.0);
  //};

  // Kiểm tra tính hợp lệ của trọng lượng hiện tại
  // Sử dụng useEffect để thực hiện
  useEffect(() => {
    // Chuyển đổi giá trị input thành số
    const numericCurrentWeight = parseFloat(currentWeight);

    // Kiểm tra xem có phải là số hợp lệ và đã có dữ liệu tiêu chuẩn chưa
    if (!isNaN(numericCurrentWeight) && tableData) {
      // Nếu nằm trong khoảng, set state thành true
      if (numericCurrentWeight >= minWeight && numericCurrentWeight <= maxWeight) {
        setIsWeightValid(true);
      } else {
        // Nếu nằm ngoài khoảng, set state thành false
        setIsWeightValid(false);
      }
    } else {
      // Nếu không phải số hoặc chưa có dữ liệu, coi như không hợp lệ
      setIsWeightValid(false);
    }
    // Mảng phụ thuộc: Hook này sẽ chạy lại mỗi khi `currentWeight`, `minWeight`, hoặc `maxWeight` thay đổi
  }, [currentWeight, minWeight, maxWeight, tableData]);

  //  Xác định class màu sắc dựa trên state isWeightValid
  const weightColorClass = tableData && currentWeight !== ''
    ? (isWeightValid ? 'text-green-500' : 'text-red-500')
    : 'text-yellow-400';

  // Tạo mảng chứa các giá trị của bảng, nếu không có dữ liệu thì sẽ là mảng rỗng
  // Mảng này sẽ chứa các giá trị tương ứng với tiêu đề bảng
  // Nếu không có dữ liệu, sẽ hiển thị các ô trống
  const tableValues = tableData 
    ? [tableData.name, tableData.solo, tableData.somay, tableData.weight.toFixed(1), tableData.user, tableData.time]
    : Array(6).fill('');


  // Tạo hàm xử lý khi nhấn nút "Scan"
  const handleScan = () => {
    // So sánh code người dùng nhập với code trong dữ liệu giả lập
    if (scannedCode === testData.code) {
      // Nếu đúng, cập nhật state của bảng với dữ liệu mới
      setTableData(testData);
      // Cập nhật Trọng lượng tiêu chuẩn từ dữ liệu mới
      setStandardWeight(testData.weight);
    } else {
      // Nếu sai, thông báo cho người dùng và xóa dữ liệu bảng (nếu có)
      alert("Mã không hợp lệ! Vui lòng thử lại.");
      setTableData(null);
    }
  };

  // Tạo hàm xử lý khi nhấn nút "Hoàn tất"
  const handleSunmit = () => {
    // Kiểm tra tính hợp lệ của trọng lượng
    if (isWeightValid && tableData) {
      // Nếu hợp lệ, thông báo thành công
      alert("Trọng lượng hợp lệ! Dữ liệu đã được lưu.");
      // Reset các trường nhập liệu
      setCurrentWeight('');
      setScannedCode('');
      setTableData(null);
    } else {
      // Nếu không hợp lệ, thông báo lỗi
      alert("Trọng lượng không hợp lệ! Vui lòng kiểm tra lại.");
    }
  };
  
  // Tạo mảng tiêu đề bảng
  const tableHeaders = [
    "Tên phôi keo", "Số Lô", "Số Máy", "Khối lượng mẻ (kg)", "Người Thao Tác", "Thời gian trộn"
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* --- KHU VỰC HIỂN THỊ TRỌNG LƯỢNG --- */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">
            <span className="text-yellow-500">Trọng lượng:</span>
            < input
              type='number' 
              className={`ml-4 bg-gray-500 font-mono px-4 py-1 rounded w-48 text-center ${weightColorClass}`}
              placeholder="0.0"
              value={currentWeight}
              step="0.1"
              onChange={handleCurentChange}
            />
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
            onClick={handleSunmit}
          >
            Hoàn tất
          </button>
        </div>
      </div>

      {/* --- BẢNG THÔNG TIN --- */}
      <div className="mb-8">
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
      <div className="flex items-center gap-6">
        <input
          type="text"
          className="flex-grow border-2 border-green-500 rounded-md p-4 text-center text-2xl font-mono bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
          placeholder="CODE HERE"
          value={scannedCode}
          onChange={handleCodeChange}
        />
        <button 
          onClick={handleScan}
          className="bg-green-600 text-white font-bold px-12 py-4 rounded-md text-xl hover:bg-green-800 transition-colors"
        >
          Scan
        </button>
      </div>
    </div>
  );
}

export default WeighingStation;