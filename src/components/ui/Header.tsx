// src/components/ui/Header.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import logoIcon from '../../assets/logo.png';

function Header() {
  const userName = "Nguyen Van A";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate(); // 2. Khởi tạo hook

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 3. Tạo hàm xử lý sự kiện đăng xuất
  const handleLogout = () => {
    console.log('Đăng xuất...');
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
        <h1 className="text-white text-2xl font-bold tracking-wide" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
          LƯU TRÌNH CAO SU XƯỞNG ĐẾ
        </h1>
      </div>

      <div className="relative" ref={menuRef}>
        <div 
          className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-white/10 transition-colors"
          onClick={toggleMenu}
        >
          <span className="text-white font-medium">{userName}</span>
          <span className="text-white">▼</span>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-xl p-2 z-50 ring-1 ring-black ring-opacity-5">
            {/* 4. Gắn hàm handleLogout vào sự kiện onClick của nút */}
            <button 
              className="w-full text-left px-4 py-2 text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;