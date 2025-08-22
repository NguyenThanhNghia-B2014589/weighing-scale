import { Routes, Route, Navigate } from 'react-router-dom';

// Import các "trang" của bạn
import LoginPage from './components/LoginPage/LoginPage';
import WeighingStation from './components/WeighingStation/WeighingStation';
import Header from './components/ui/Header'; // Import Header để dùng cho trang chính

function App() {
  return (
    <Routes>
      {/* Tuyến đường 1: Khi URL là "/login", hiển thị trang đăng nhập */}
      <Route  path="/login" element={<LoginPage />} />

      {/* Tuyến đường 2: Khi URL là "/", hiển thị trang chính */}
      <Route 
        path="/WeighingStation"
        element={
          <div className="min-h-screen bg-sky-200">
            <Header />
            <main className="pt-[70px]">
              <WeighingStation />
            </main>
          </div>
        } 
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;