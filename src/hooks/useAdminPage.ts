// src/hooks/useAdminPage.ts

import { useState, useEffect, useMemo, useRef } from "react";
import { mockApiRandomData } from "../data/weighingData";
import { CellMeasurerCache } from 'react-virtualized';
import { Variants } from 'framer-motion';

export function useAdminPageLogic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  
  // DI CHUYỂN CACHE VÀO useRef ĐỂ TRÁNH TẠO LẠI
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 320 // Chiều cao mặc định ban đầu
    })
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fake loading
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Data
  const weighingHistory = useMemo(() => Object.values(mockApiRandomData), []);

  // Filtered data
  const filteredHistory = useMemo(() => {
    if (!debouncedTerm) return weighingHistory;
    const lower = debouncedTerm.toLowerCase();
    return weighingHistory.filter((item) =>
      [item.code, item.name, item.solo, item.somay, item.user]
        .some((field) => field.toLowerCase().includes(lower))
    );
  }, [debouncedTerm, weighingHistory]);

  // LOGIC ANIMATION
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        mass: 0.8,         // Giảm khối lượng nhẹ hơn một chút, có thể nhanh hơn
        stiffness: 150,    // Tăng độ cứng để nhanh chóng đến đích hơn
        damping: 18,       // Tăng lực cản để giảm độ nảy thừa
        bounce: 0.2,       // Giảm độ nảy (nếu muốn ít nảy hơn)
        // duration: 0.8 // Với spring, duration không phải lúc nào cũng trực tiếp kiểm soát, mà là sự kết hợp của mass, stiffness, damping
      } 
    },
  };

  // TRẢ VỀ CÁC GIÁ TRỊ VÀ HÀM CẦN THIẾT
  return {
    searchTerm,
    setSearchTerm,
    isPageLoading,
    filteredHistory,
    cache: cache.current, 
    cardVariants, 
  };
}