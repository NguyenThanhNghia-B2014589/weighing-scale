// src/components/ui/Header.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../assets/logo.png';
import { useAuth } from '../../context/useAuth'; // 1. Import Custom Hook

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 3. Tạo hàm xử lý sự kiện đăng xuất
  const handleLogout = () => {
    console.log('Đăng xuất...');
    logout();
    // Trong một ứng dụng thực tế, bạn sẽ xóa token/session của người dùng ở đây
    // Ví dụ: localStorage.removeItem('userToken');
    
    navigate('/login'); // Điều hướng về trang đăng nhập
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

   return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-[#064469] z-50 flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center gap-4">
        <img src={logoIcon} alt="Logo" className="h-[35px]" />
        <h1 className="text-white text-2xl font-bold tracking-wide">LƯU TRÌNH CAO SU XƯỞNG ĐẾ</h1>
      </div>

      {/* 4. HIỂN THỊ CÓ ĐIỀU KIỆN */}
      {user ? (
        // Nếu user tồn tại (đã đăng nhập)
        <div className="relative" ref={menuRef}>
          <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-white/10" onClick={toggleMenu}>
            <span className="text-white font-medium">{user.userName}</span>
            <span className="text-white">▼</span>
          </div>
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-xl p-2 z-50 ring-1 ring-black ring-opacity-5">
              <button className="w-full text-left px-4 py-2 text-gray-800 rounded-md hover:bg-gray-100" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        // Nếu user là null (chưa đăng nhập), không hiển thị gì cả
        null
      )}
    </header>
  );
}

export default Header;