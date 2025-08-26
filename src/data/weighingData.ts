// src/data/weighingData.ts

// 1. Định nghĩa và export kiểu dữ liệu
export type WeighingData = {
  code: string;
  name: string;
  solo: string;
  somay: string;
  weight: number;
  user: string;
  time: string;
};

// 2. Định nghĩa và export dữ liệu giả lập
export const mockApiData: Record<string, WeighingData> = {
  "123": {
    code: "123",
    name: "Phôi keo A",
    solo: "Lô 1",
    somay: "Máy 1",
    weight: 55.0,
    user: "Nguyễn Văn A",
    time: "10 phút 30 giây"
  },
  "456": {
    code: "456",
    name: "Phôi keo B",
    solo: "Lô 2",
    somay: "Máy 3",
    weight: 62.5,
    user: "Trần Thị B",
    time: "12 phút 15 giây"
  }
};