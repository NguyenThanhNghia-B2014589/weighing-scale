import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useNotification } from '../ui/Notification/useNotification';
import Notification from '../ui/Notification/Notification';
import { useAuth } from '../../context/useAuth';
import { mockUsers } from '../../data/users';

function LoginPage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const { notificationMessage, notificationType, showNotification } = useNotification();
  
  const navigate = useNavigate();
  const { login } = useAuth();

   const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 3. Tìm kiếm người dùng trong mảng mockUsers
    const foundUser = mockUsers.find(
      (user) => user.userID === userID && user.password === password
    );

    // 4. Kiểm tra kết quả tìm kiếm
    if (foundUser) {
      // Nếu tìm thấy người dùng, đăng nhập với thông tin của người đó
      showNotification(`Chào mừng ${foundUser.userName}!`, 'success');
      login(foundUser); // Truyền toàn bộ object người dùng đã tìm thấy vào context
      
      setTimeout(() => {
        navigate('/WeighingStation'); // Điều hướng đến trang chủ
      }, 1500); // 1.5 giây

    } else {
      showNotification('UserID hoặc mật khẩu không đúng!', 'error');
    }
  };

  return (
    <div className="min-h-auto flex items-center justify-center bg-sky-200 p-[200px]">
      
      <Notification message={notificationMessage} type={notificationType} />

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          {/* --- Ô nhập UserID --- */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
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