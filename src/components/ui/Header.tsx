// src/components/ui/Header.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

import logoIcon from '../../assets/logo.png';
import adminIcon from '../../assets/admin.png';
import logoutIcon from '../../assets/logout.png';
import homeIcon from '../../assets/home.svg'
import gridPenIcon from '../../assets/grid_pen.svg'
import controlPanelIcon from '../../assets/control_panel.svg'

// --- COMPONENT CON CHO CÁC ICON ĐIỀU HƯỚNG ---
function NavLink({ to, title, children }: { to: string; title: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} title={title} className={`relative px-3 py-2 transition-colors ${isActive ? '' : 'hover:text-sky-300'}`}>
      {children}
      {isActive && (
        // 2. DIV NỀN TRƯỢT SẼ NẰM Ở ĐÂY
        <motion.div
          className="absolute inset-0 bg-sky-500 rounded-md z-0"
          layoutId="active-nav-link" // Đây là "phép màu"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
    </Link>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // đóng menu khi logout
    navigate('/login');
  };

  // Click ra ngoài menu thì đóng
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

  // Reset menu về false mỗi khi user thay đổi (login/logout)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [user]);

 return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-[#064469] z-50 flex items-center justify-between px-6 shadow-lg">
      <Link to="/WeighingStationNew" className="flex items-center gap-4">
        <img src={logoIcon} alt="Logo" className="h-[35px]" />
        <h1 className="text-white text-2xl font-bold tracking-wide">LƯU TRÌNH CÂN KEO XƯỞNG ĐẾ</h1>
      </Link>

      {/* 2. TÁI CẤU TRÚC TOÀN BỘ PHẦN BÊN PHẢI */}
      {user && (
        <div className="flex items-center gap-6">
          {/* --- KHU VỰC CÁC ICON ĐIỀU HƯỚNG --- */}
          <nav className="flex items-center gap-5">
            
            {/* Icon Home (luôn hiển thị) */}
            <NavLink to="/WeighingStationNew" title="Trạm Cân">
              <span className="relative z-10">
                <img src={homeIcon} alt="Trang chủ" className="h-6 w-6 brightness-0 invert" />
              </span>
            </NavLink>

            {/* Icons chỉ dành cho Admin */}
            {user.role === 'admin' && (
              <>
                <NavLink to="/dashboard" title="Dashboard">
                  <span className="relative z-10">
                    <img src={controlPanelIcon} alt="Dashboard" className="h-6 w-6 brightness-0 invert" />
                  </span>
                </NavLink>
                <NavLink to="/admin" title="Lịch sử cân">
                  <span className="relative z-10">
                    <img src={gridPenIcon} alt="Lịch sử cân" className="h-6 w-6 brightness-0 invert" />
                  </span>
                </NavLink>
              </>
            )}
          </nav>

          {/* --- KHU VỰC TÊN NGƯỜỜI DÙNG VÀ DROPDOWN --- */}
          <div className="relative" ref={menuRef}>
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-white/10" onClick={toggleMenu}>
              <span className="text-white font-medium">{user.userName}</span>
              <span className="text-white text-xs">▼</span>
            </div>

            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-xl p-2 z-50 ring-1 ring-black ring-opacity-5 flex flex-col gap-1">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="w-full text-left px-4 py-2 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img src={adminIcon} alt="Admin" className="h-5 w-5 mr-3" />
                  Trang Admin
                </Link>
              )}

                <button 
                className="w-full text-left px-4 py-2 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                  onClick={handleLogout}
                >
                  <img src={logoutIcon} alt="Đăng xuất" className="h-5 w-5 mr-3" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
