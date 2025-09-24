// src/components/DashBoard/DashBoard.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';
import SettingsModal from '../ui/SettingsModal/SettingsModal';

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
    formatLastRefresh,
  } = useDashboard();
  
  return (
    <div className="px-8 py-4">
      {/* Settings Modal - sử dụng component riêng biệt */}
      <SettingsModal />

      {/* HEADER ĐƯỢC ĐƠN GIẢN HÓA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard - Tổng Quan</h1>
        
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          {/* Thông tin refresh cuối */}
          <span className="text-sm text-gray-500">
            Cập nhật lần cuối: {formatLastRefresh()}
          </span>
          
          {/* Chỉ còn nút refresh thủ công */}
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
        </div>
      </div>
        
      {/* KHU VỰC BIỂU ĐỒ - KHÔNG THAY ĐỔI */}
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