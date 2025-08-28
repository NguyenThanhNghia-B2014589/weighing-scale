import React from "react";
import { List, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";

import HistoryCard from "../ui/Card/HistoryCard";
import AdminPageSkeleton from "./AdminPageSkeleton";
import type { ListRowProps } from "react-virtualized";
import { useAdminPageLogic } from "../../hooks/useAdminPage";

function AdminPage() {
  const {
    searchTerm,
    setSearchTerm,
    isPageLoading,
    filteredHistory,
    rowHeight,
  } = useAdminPageLogic();

  if (isPageLoading) return <AdminPageSkeleton />;

  const rowRenderer = ({ index, key, style }: ListRowProps) => (
    <div key={key} style={style} className="p-2">
      <HistoryCard data={filteredHistory[index]} />
    </div>
  );

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
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 flex-1 min-h-[780px]">
        {filteredHistory.length > 0 ? (
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={filteredHistory.length}
                rowHeight={rowHeight}
                rowRenderer={rowRenderer}
                className="no-scrollbar"
              />
            )}
          </AutoSizer>
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
