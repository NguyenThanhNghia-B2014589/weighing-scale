import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import WeighingStation from './components/WeighingStation/WeighingStation';
import Header from './components/ui/Header';

function App() {
  return (
    // Div này sẽ là layout chung cho toàn bộ ứng dụng
    <div className="min-h-screen bg-sky-200">
      <Header />
      <main className="pt-[70px]"> {/* Padding để nội dung không bị Header che */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/WeighingStation" element={<WeighingStation />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;