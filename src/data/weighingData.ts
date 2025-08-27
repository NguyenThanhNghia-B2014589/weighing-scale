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
  "1": {
    code: "123",
    name: "Phôi keo A",
    solo: "Lô 1",
    somay: "Máy 1",
    weight: 550.0,
    user: "Nguyễn Văn A",
    time: "8:20 01/01/2024"
  },
  "2": {
    code: "456",
    name: "Phôi keo B",
    solo: "Lô 2",
    somay: "Máy 3",
    weight: 620.5,
    user: "Trần Thị B",
    time: "8:20 01/01/2024"
  },
  "3": {
    code: "789",
    name: "Phôi keo A",
    solo: "Lô 1",
    somay: "Máy 1",
    weight: 550.0,
    user: "Nguyễn Văn A",
    time: "8:20 01/01/2024"
  },
  "4": {
    code: "abc",
    name: "Phôi keo B",
    solo: "Lô 2",
    somay: "Máy 3",
    weight: 620.5,
    user: "Trần Thị B",
    time: "8:20 01/01/2024"
  },
  "5": {
    code: "cba",
    name: "Phôi keo A",
    solo: "Lô 1",
    somay: "Máy 1",
    weight: 550.0,
    user: "Nguyễn Văn A",
    time: "8:20 01/01/2024"
  },
  "6": {
    code: "321",
    name: "Phôi keo B",
    solo: "Lô 2",
    somay: "Máy 3",
    weight: 620.5,
    user: "Trần Thị B",
    time: "8:20 01/01/2024"
  },
  "7": {
    code: "654",
    name: "Phôi keo A",
    solo: "Lô 1",
    somay: "Máy 1",
    weight: 550.0,
    user: "Nguyễn Văn A",
    time: "8:20 01/01/2024"
  },
  "8": {
    code: "987",
    name: "Phôi keo B",
    solo: "Lô 2",
    somay: "Máy 3",
    weight: 620.5,
    user: "Trần Thị B",
    time: "8:20 01/01/2024"
  },
  "9": {
    code: "987",
    name: "Phôi keo B",
    solo: "Lô 2",
    somay: "Máy 3",
    weight: 620.5,
    user: "Trần Thị B",
    time: "8:20 01/01/2024"
  },
  "10": {
    code: "987",
    name: "Phôi keo B",
    solo: "Lô 2",
    somay: "Máy 3",
    weight: 620.5,
    user: "Trần Thị B",
    time: "8:20 01/01/2024"
  },
  "11": {
    code: "987",
    name: "Phôi keo B",
    solo: "Lô 2",
    somay: "Máy 3",
    weight: 620.5,
    user: "Trần Thị B",
    time: "8:20 01/01/2024"
  },
};