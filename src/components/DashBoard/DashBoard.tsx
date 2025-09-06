// src/components/DashboardPage/DashboardPage.tsx

import React, { useMemo } from 'react';
import { mockApiData } from '../../data/weighingData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

function DashboardPage() {
  const weighingHistory = useMemo(() => Object.values(mockApiData), []);

  // --- LOGIC XỬ LÝ DỮ LIỆU CHO BIỂU ĐỒ ---

  // 1. Dữ liệu cho biểu đồ cột: Đếm số lần cân của mỗi người dùng
  const userPerformanceData = useMemo(() => {
    const userCounts = weighingHistory.reduce((acc, item) => {
      acc[item.user] = (acc[item.user] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(userCounts).map(([name, count]) => ({ name, 'Số lần cân': count }));
  }, [weighingHistory]);

  // 2. Dữ liệu cho biểu đồ tròn: Đếm số lần cân của mỗi loại phôi keo
  const glueTypeData = useMemo(() => {
    const glueCounts = weighingHistory.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(glueCounts).map(([name, value]) => ({ name, value }));
  }, [weighingHistory]);

    // 3. DỮ LIỆU MỚI: Xu hướng số lần cân theo thời gian
  const weighingTrendData = useMemo(() => {
    // Nhóm các bản ghi theo tháng/năm
    const monthlyCounts = weighingHistory.reduce((acc, item) => {
      const datePart = item.time.split(' ')[1]; // Lấy phần "01/01/2024"
      const [day, month, year] = datePart.split('/');
      const monthYear = `${month}/${year}`; // Tạo key là "Tháng/Năm"
      
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Chuyển đổi thành mảng và sắp xếp theo thời gian
    return Object.entries(monthlyCounts)
      .map(([date, count]) => ({ date, "Số lần cân": count }))
      .sort((a, b) => {
        const [monthA, yearA] = a.date.split('/');
        const [monthB, yearB] = b.date.split('/');
        return new Date(`${yearA}-${monthA}-01`).getTime() - new Date(`${yearB}-${monthB}-01`).getTime();
      });
  }, [weighingHistory]);

  const COLORS = ['#0088FE','#B93992FF' ,'#00C49F', '#FFBB28', '#FF8042'];

  return(
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard - Tổng Quan</h1>
        
      {/* KHU VỰC BIỂU ĐỒ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Biểu đồ xu hướng theo thời gian */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Xu Hướng Cân Theo Thời Gian</h2>
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
            
        {/* Biểu đồ cột */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Năng Suất Theo Người Dùng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Số lần cân" fill="#8884d8" />
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
        
      </div>
    </div>
  );
}

export default DashboardPage;