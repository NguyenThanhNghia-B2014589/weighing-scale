// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Header và các trang
import Header from './components/ui/Header';
import LoginPage from './components/LoginPage/LoginPage';
import WeighingStation from './components/WeighingStation/WeighingStation';

function App() {
  return (
    // Đây là layout chung cho TOÀN BỘ ứng dụng
    <div className="min-h-screen bg-sky-200 flex flex-col">
      <Header />
      
      {/* Thẻ <main> sẽ chiếm toàn bộ không gian còn lại */}
      <main className="flex-grow pt-[70px]">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/WeighingStation" element={<WeighingStation />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;