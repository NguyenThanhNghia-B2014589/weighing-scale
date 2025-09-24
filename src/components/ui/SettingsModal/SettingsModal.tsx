// src/components/ui/SettingsModal/SettingsModal.tsx

import React from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { useDashboard } from '../../../hooks/useDashboard';

function SettingsModal() {
  const { showSettingsModal, closeSettingsModal } = useSettings();
  const {
    isAutoRefresh,
    setIsAutoRefresh,
    refreshData,
    formatLastRefresh,
  } = useDashboard();

  if (!showSettingsModal) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeSettingsModal}
      ></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
          {/* Header Modal */}
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Cài đặt Dashboard
            </h3>
            <button
              onClick={closeSettingsModal}
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

            {/* Thêm các cài đặt khác trong tương lai */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Cài đặt khác</h4>
              <div className="text-sm text-gray-500">
                Các tùy chọn cài đặt khác sẽ được thêm vào đây...
              </div>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={closeSettingsModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                closeSettingsModal();
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
  );
}

export default SettingsModal;