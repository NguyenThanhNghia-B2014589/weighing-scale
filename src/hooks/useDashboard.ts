import {mockApiRandomData} from "../data/weighingData";
import {useMemo, useState, useEffect, useCallback} from "react";

function getTodayString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function useDashboard () {
    // State cho dữ liệu và refresh
    const [weighingHistory, setWeighingHistory] = useState(() => Object.values(mockApiRandomData));
    const [isAutoRefresh, setIsAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(300); // giây (5 phút mặc định)
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(getTodayString());

    // Hàm làm mới dữ liệu thủ công
    const refreshData = useCallback(() => {
        setWeighingHistory(Object.values(mockApiRandomData));
        setLastRefresh(new Date());
    }, []);

    // Auto refresh effect
    useEffect(() => {
        if (!isAutoRefresh) return;

        const interval = setInterval(() => {
            refreshData();
        }, refreshInterval * 1000);

        return () => clearInterval(interval);
    }, [isAutoRefresh, refreshInterval, refreshData]);

    // --- LOGIC XỬ LÝ DỮ LIỆU CHO BIỂU ĐỒ ---

    // 2. Dữ liệu cho biểu đồ cột: Tính tổng khối lượng cân theo từng khung giờ
    const hourlyWeighingData = useMemo(() => {
        // 1. Lọc dữ liệu theo ngày đã chọn
        const dailyData = weighingHistory.filter(item => {
            // Chuyển đổi "09:35 15/06/2025" thành một đối tượng Date để so sánh
            const [, dateStr] = item.time.split(' ');
            const [day, month, year] = dateStr.split('/');
            const itemDate = new Date(`${year}-${month}-${day}`);
            
            return itemDate.toDateString() === new Date(selectedDate).toDateString();
        });

        // 2. Nhóm dữ liệu đã lọc theo giờ và tính tổng khối lượng
        const hourlyTotals = dailyData.reduce((acc, item) => {
            const [hour] = item.time.split(':'); // Lấy giờ từ "09:35"
            const hourKey = `${hour}:00`;

            acc[hourKey] = (acc[hourKey] || 0) + item.finalWeight;
            return acc;
        }, {} as Record<string, number>);

        // 3. Tạo dữ liệu cho biểu đồ, đảm bảo có đủ các giờ trong ngày làm việc
        const workHours = Array.from({ length: 11 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`); // 07:00 -> 17:00
        
        return workHours.map(hour => ({
            hour,
            'Tổng khối lượng': hourlyTotals[hour] || 0,
        }));

    }, [weighingHistory, selectedDate]);

    // 3. Dữ liệu cho biểu đồ tròn: Đếm số lần cân của mỗi loại phôi keo
    const glueTypeData = useMemo(() => {
        const glueCounts = weighingHistory.reduce((acc, item) => {
            acc[item.name] = (acc[item.name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(glueCounts).map(([name, value]) => ({name, value}));
    }, [weighingHistory]);

    // 1. DỮ LIỆU MỚI: Xu hướng số lần cân theo thời gian
    const weighingTrendData = useMemo(() => {
        // Nhóm các bản ghi theo tháng/năm
        const monthlyCounts = weighingHistory.reduce((acc, item) => {
            const datePart = item.time.split(' ')[1]; // Lấy phần "01/01/2024"
            const [ , month, year] = datePart.split('/');
            const monthYear = `${month}/${year}`; // Tạo key là "Tháng/Năm"

            acc[monthYear] = (acc[monthYear] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Chuyển đổi thành mảng và sắp xếp theo thời gian
        return Object.entries(monthlyCounts)
            .map(([date, count]) => ({date, "Số lần cân": count}))
            .sort((a, b) => {
                const [monthA, yearA] = a.date.split('/');
                const [monthB, yearB] = b.date.split('/');
                return new Date(`${yearA}-${monthA}-01`).getTime() - new Date(`${yearB}-${monthB}-01`).getTime();
            });
    }, [weighingHistory]);

    const COLORS = ['#0088FE', '#B93992FF', '#00C49F', '#FFBB28', '#FF8042'];

    return {
        // Dữ liệu gốc
        setSelectedDate,
        selectedDate,
        hourlyWeighingData,
        glueTypeData,
        weighingTrendData,
        COLORS,
        
        // Refresh functionality
        refreshData,
        isAutoRefresh,
        setIsAutoRefresh,
        refreshInterval,
        setRefreshInterval,
        lastRefresh,
    };
}