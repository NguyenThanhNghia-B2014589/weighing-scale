// src/components/AdminPage/AdminPage.tsx

import React, { useMemo, useState } from 'react';
import { mockApiData } from '../../data/weighingData';
import HistoryCard from '../ui/Card/HistoryCard'

function AdminPage() {
  // 1. Thêm state để quản lý nội dung ô tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy toàn bộ dữ liệu gốc
  const weighingHistory = useMemo(() => Object.values(mockApiData), []);

  // 2. Lọc dữ liệu dựa trên searchTerm
  const filteredHistory = useMemo(() => {
    // Nếu ô tìm kiếm rỗng, trả về toàn bộ lịch sử
    if (!searchTerm) {
      return weighingHistory;
    }
    
    const lowercasedFilter = searchTerm.toLowerCase();

    // Lọc qua mảng, giữ lại những mục thỏa mãn điều kiện
    return weighingHistory.filter(item => {
      // Tìm kiếm trong nhiều trường dữ liệu khác nhau
      return (
        item.code.toLowerCase().includes(lowercasedFilter) ||
        item.name.toLowerCase().includes(lowercasedFilter) ||
        item.solo.toLowerCase().includes(lowercasedFilter) ||
        item.somay.toLowerCase().includes(lowercasedFilter) ||
        item.user.toLowerCase().includes(lowercasedFilter)
      );
    });
  }, [searchTerm, weighingHistory]); // Tính toán lại khi searchTerm hoặc dữ liệu gốc thay đổi

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Trang Quản Trị - Lịch Sử Cân
        </h1>
        
        {/* 3. THÊM Ô INPUT TÌM KIẾM */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên, lô, máy..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* 4. HIỂN THỊ DANH SÁCH ĐÃ ĐƯỢC LỌC */}
      <div className="flex flex-col gap-6">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item, index) => (
            <HistoryCard 
              key={item.code + index} 
              data={item}
              searchTerm={searchTerm} // 5. Truyền searchTerm xuống component con
            />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">Không tìm thấy kết quả nào.</p>
        )}
      </div>
    </div>
  );
}

export default AdminPage;