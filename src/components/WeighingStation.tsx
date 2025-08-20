function WeighingStation() {
  // Dữ liệu giả lập
  const weightData = {
    current: "0.0",
    standard: "0.0",
    deviation: "0%",
    min: 0,
    max: 0,
  };

  const tableHeaders = [
    "Tên phôi keo", "Số Lô", "Số Máy", "Khối lượng mẻ (kg)", "Người Thao Tác", "Thời gian trộn"
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* --- KHU VỰC HIỂN THỊ TRỌNG LƯỢNG --- */}
      <div className="flex justify-between items-start mb-8">
        {/* Thông tin bên trái */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">
            <span className="text-yellow-500">Trọng lượng:</span>
            <span className="ml-4 bg-gray-500 text-yellow-400 font-mono px-4 py-1 rounded">
              {weightData.current}
            </span>
          </h1>
          <p className="text-lg font-semibold text-black">
            Trọng lượng tiêu chuẩn: <span className="text-green-600 font-bold">{weightData.standard}</span>
            <span className="ml-8">Chênh lệch tối đa: <span className="text-green-600 font-bold">{weightData.deviation}</span></span>
          </p>
          <p className="text-lg font-semibold text-black">
            MIN: {weightData.min}
            <span className="ml-16">MAX: {weightData.max}</span>
          </p>
        </div>
        {/* Nút Hoàn tất bên phải */}
        <div>
          <button className="bg-[#00446e] text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-[#003a60] transition-colors">
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
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-100 h-20 border-t border-l border-gray-300">
              {/* Nội dung sẽ được điền vào đây */}
            </div>
          ))}
        </div>
      </div>

      {/* --- KHU VỰC QUÉT MÃ --- */}
      <div className="flex items-center gap-6">
        <div className="flex-grow border-2 border-green-500 rounded-md p-4 text-center text-gray-400 text-2xl font-mono">
          CODE HERE
        </div>
        <button className="bg-green-500 text-white font-bold px-12 py-4 rounded-md text-xl hover:bg-green-600 transition-colors">
          Scan
        </button>
      </div>
    </div>
  );
}

export default WeighingStation;