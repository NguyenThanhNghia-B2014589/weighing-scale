// src/components/AdminPage/AdminPage.tsx

import React, { useMemo, useState, useEffect } from 'react';
import { mockApiData } from '../../data/weighingData';
import HistoryCard from '../ui/Card/HistoryCard';
import AdminPageSkeleton from './AdminPageSkeleton';

function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const weighingHistory = useMemo(() => Object.values(mockApiData), []);

  const filteredHistory = useMemo(() => {
    if (!searchTerm) return weighingHistory;
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

  if (isPageLoading) return <AdminPageSkeleton />;

  return (
  <div className="pl-4 pr-4 pb-4 h-full flex flex-col">
    {/* Header sticky */}
    <div className="sticky top-[70px] bg-sky-200 py-4 z-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Trang Quản Trị - Lịch Sử Cân
        </h1>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên, lô, máy..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-sky-500"
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
    </div>

    {/* List */}
    <div className="mt-4 flex-1 overflow-y-auto">
      {filteredHistory.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredHistory.map((item, index) => (
            <HistoryCard key={item.code + index} data={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          Không tìm thấy kết quả nào.
        </p>
      )}
    </div>
  </div>
);
}

export default AdminPage;