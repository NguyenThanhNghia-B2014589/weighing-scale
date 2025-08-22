import { useState, useEffect, useRef } from 'react';

import logoIcon from '../../assets/logo.png';

function Header() {
  const userName = "Nguyen Van A";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-[#064469] z-50 flex items-center justify-between px-6 shadow-lg">
      
      {/* Phần bên trái */}
      <div className="flex items-center gap-4"> {/* Dùng gap-4 để tạo khoảng cách */}
        <img src={logoIcon} alt="Logo" className="h-[35px]" />
        <h1 className="text-white text-2xl font-bold tracking-wide" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
          LƯU TRÌNH CAO SU XƯỞNG ĐẾ
        </h1>
      </div>

      {/* Phần bên phải */}
      <div className="relative" ref={menuRef}>
        <div 
          className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-white/10 transition-colors"
          onClick={toggleMenu}
        >
          <span className="text-white font-medium">{userName}</span>
          <span className="text-white">▼</span>
        </div>

        {/* Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-xl p-2 z-50 ring-2 ring-black ring-opacity-5">
            <button className="w-full px-4 py-2 text-gray-800 rounded-md hover:bg-gray-100 transition-colors">
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;