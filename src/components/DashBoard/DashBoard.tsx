// src/components/DashBoard/DashBoard.tsx

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';

function DashboardPage() {
  const {
    setSelectedDate,
    selectedDate,
    hourlyWeighingData,
    glueTypeData,
    weighingTrendData,
    COLORS,
    // Refresh functionality
    refreshData,
    isAutoRefresh,
    setIsAutoRefresh,
    formatLastRefresh, // Sử dụng hàm format từ hook
  } = useDashboard();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  return (
    <div className="px-8 py-4">
      {/* HEADER VỚI REFRESH CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard - Tổng Quan</h1>
        
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          {/* Thông tin refresh cuối */}
          <span className="text-sm text-gray-500">
            Cập nhật lần cuối: {formatLastRefresh()}
          </span>
          
          {/* Nút refresh thủ công */}
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
          
          {/* Nút cài đặt */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cài đặt
          </button>
        </div>
      </div>

      {/* MODAL CÀI ĐẶT REFRESH */}
      {showSettingsModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowSettingsModal(false)}
          ></div>
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cài đặt làm mới dữ liệu
                </h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nội dung Modal */}
              <div className="p-6 space-y-6">
                {/* Toggle Auto Refresh */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tự động làm mới
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      Dashboard sẽ tự động cập nhật dữ liệu mỗi 5 phút
                    </p>
                  </div>
                  <div className="relative ml-4 flex-shrink-0">
                    <input
                      type="checkbox"
                      id="auto-refresh-modal"
                      checked={isAutoRefresh}
                      onChange={(e) => setIsAutoRefresh(e.target.checked)}
                      className="sr-only"
                    />
                    <label
                      htmlFor="auto-refresh-modal"
                      className={`flex items-center cursor-pointer transition-colors duration-200 ease-in-out ${
                        isAutoRefresh ? 'bg-blue-500' : 'bg-gray-300'
                      } relative inline-block w-12 h-6 rounded-full`}
                    >
                      <span
                        className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                          isAutoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}
                      />
                    </label>
                  </div>
                </div>

                {/* Thông tin trạng thái */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {isAutoRefresh ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">
                          Đang tự động làm mới (mỗi 5 phút)
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-600">
                          Tạm dừng tự động làm mới
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Lần cập nhật cuối: {formatLastRefresh()}
                  </p>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    refreshData(); // Làm mới ngay khi lưu cài đặt
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu & Làm mới
                </button>
              </div>
            </div>
          </div>
        </>
      )}
        
      {/* KHU VỰC BIỂU ĐỒ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Biểu đồ cột */}
        <div className="bg-white p-6 rounded-xl shadow">
          
          {/* --- KHU VỰC TIÊU ĐỀ VÀ BỘ LỌC NGÀY --- */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-bold mb-2 sm:mb-0">
              Tổng Khối Lượng Theo Giờ
            </h2>
            <div className="relative">
              <input
                type="date"
                id="date-filter"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
              />
            </div>
          </div>
          
          {/* Biểu đồ không đổi */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyWeighingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)} g`, "Khối lượng"]} />
              <Legend />
              <Bar dataKey="Tổng khối lượng" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ tròn */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Tỷ Lệ Các Loại Phôi Keo</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={glueTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {glueTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ xu hướng theo thời gian */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Xu Hướng Cân Theo Thời gian</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weighingTrendData}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Số lần cân" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>  
      </div>
    </div>
  );
}

export default DashboardPage;