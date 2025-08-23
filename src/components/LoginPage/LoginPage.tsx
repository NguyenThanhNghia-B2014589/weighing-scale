import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useNotification } from '../ui/Notification/useNotification';
import Notification from '../ui/Notification/Notification';
import { useAuth } from '../../context/useAuth';

// Dữ liệu người dùng giả lập để kiểm tra
const mockUser = {
  userID: 'admin',
  password: '123',
  userName: 'Nguyen Van A',
  role: 'admin',
};

function LoginPage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const { notificationMessage, notificationType, showNotification } = useNotification();
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userID === mockUser.userID && password === mockUser.password) {
      showNotification('Đăng nhập thành công!', 'success');
      login({ 
        userID: mockUser.userID,
        userName: mockUser.userName,
        role: mockUser.role
      });
      
      // 3. Điều hướng sau một khoảng trễ nhỏ để người dùng kịp thấy thông báo
      setTimeout(() => {
        navigate('/WeighingStation'); // Điều hướng đến trang chủ
      }, 1500); // 1.5 giây

    } else {
      showNotification('UserID hoặc mật khẩu không đúng!', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Notification message={notificationMessage} type={notificationType} />

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          {/* --- Ô nhập UserID --- */}
          <div className="mb-4">
            <label  className="block text-gray-700 font-bold mb-2">
              UserID
            </label>
            <input
              id="userID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Nhập UserID của bạn"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              required
            />
          </div>

          {/* --- Ô nhập Mật khẩu --- */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* --- Nút Đăng nhập --- */}
          <button
            type="submit"
            className="w-full bg-[#00446e] text-white font-bold py-3 rounded-lg hover:bg-[#003a60] transition-colors"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;