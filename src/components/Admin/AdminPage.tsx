// src/components/AdminPage/AdminPage.tsx

import React, { useMemo } from 'react';
import { mockApiData } from '../../data/weighingData';
import HistoryCard from '../Card/HistoryCard'; 

function AdminPage() {
  // Chuyển đổi object dữ liệu thành một mảng
  const weighingHistory = useMemo(() => Object.values(mockApiData), []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Trang Quản Trị - Lịch Sử Cân</h1>
      
      {/* 2. Thay thế bảng cũ bằng một danh sách các HistoryCard */}
      <div className="flex flex-col gap-6">
        {weighingHistory.map((item, index) => (
          <HistoryCard key={item.code + index} data={item} />
        ))}
      </div>
    </div>
  );
}

export default AdminPage;