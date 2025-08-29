// src/components/WeighingStation/WeighingStationModern.tsx

import React, { useMemo } from "react";
import { useWeighingStation } from "../../hooks/useWeighingStation"; // 1. Import hook chính
import { useAuth } from "../../hooks/useAuth";

// --- COMPONENT GIAO DIỆN MỚI ---
function WeighingStationNew() {
  // 2. SỬ DỤNG HOOK ĐỂ LẤY LOGIC VÀ STATE
  const {
    currentWeight,
    standardWeight,
    deviationPercent,
    scannedCode,
    tableData,
    minWeight,
    maxWeight,
    isWeightValid,
    isLoading,
    mixingTime,
    handleCurrentWeightChange,
    handleCodeChange,
    handleScan,
    handleSubmit,
  } = useWeighingStation();

  const { user } = useAuth(); // Lấy thông tin người dùng

  // --- CÁC GIÁ TRỊ PHÁI SINH (Sử dụng dữ liệu từ hook) ---
  const deviationPct = useMemo(() => {
    if (standardWeight === 0 || currentWeight === null) return 0;
    return +(((currentWeight - standardWeight) / standardWeight) * 100).toFixed(1);
  }, [currentWeight, standardWeight]);

  return (
    <div className="bg-sky text-slate-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title Row */}
        

        {/* Weight + Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Big weight card */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-md p-5 sm:p-6"> 
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Trọng lượng hiện tại</p>
                  <div className="mt-1 flex items-end gap-3">
                    <span className={`text-5xl sm:text-6xl font-black tabular-nums leading-none ${
                      currentWeight !== null && tableData ? (isWeightValid ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-800'
                    }`}>
                      {(currentWeight ?? 0).toFixed(1)}
                    </span>
                    <span className="pb-1 text-lg font-semibold text-slate-500">g</span>
                  </div>
                </div>
                
                <label className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Nhập cân nặng:</span>
                  <input
                    type="number"
                    step="0.1"
                    value={currentWeight ?? ''}
                    onChange={handleCurrentWeightChange}
                    className="w-36 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-sky-400"
                    disabled={!tableData || isLoading}
                  />
                </label>
              </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    isWeightValid ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200"
                  }`}
                >
                  Chênh lệch: {deviationPct}%
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={(isWeightValid ? "bg-emerald-400" : "bg-rose-400") + " h-full transition-all"}
                    style={{ width: `${Math.min(100, Math.abs((deviationPct / deviationPercent) * 50 + 50))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
            <StatCard label="Tiêu chuẩn" value={`${standardWeight.toFixed(1)} g`} />
            <StatCard label="% tối đa" value={`${deviationPercent}%`} />
            <StatCard label="MIN" value={`${minWeight.toFixed(1)} g`} subtle />
            <StatCard label="MAX" value={`${maxWeight.toFixed(1)} g`} subtle />
          </div>
        </section>
        
        <div className="flex items-center justify-end mb-6">
          <button
            className="w-full md:w-auto rounded-xl bg-slate-200 px-40 py-3 text-slate-700 font-semibold hover:bg-slate-300 transition-colors shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    //flex flex-col sm:flex-row rounded-xl border bg-[#00446e] px-16 py-3 text-sm font-semibold text-white   
                    //hover:bg-[#0b7abe] hover:shadow transition disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!isWeightValid || !tableData || isLoading}
          >
            {isLoading ? "Đang lưu..." : "Hoàn tất"}
          </button>
        </div>

        {/* Detail table */}
        <section className="rounded-2xl bg-white shadow-md overflow-hidden mb-6">
          <div >
            <table className="min-w-full">
              <thead>
                <tr className="bg-sky-100 text-sky-900">
                  <Th> Tên Phôi Keo </Th>
                  <Th> Số Lô </Th>
                  <Th> Số Máy </Th>
                  <Th> Khối Lượng Mẻ (g) </Th>
                  <Th> Người Thao Tác </Th>
                  <Th> Thời Gian Cân </Th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100 h-16">
                  {tableData ? (
                    <>
                      <Td>{tableData.name}</Td>
                      <Td>{tableData.solo}</Td>
                      <Td>{tableData.somay}</Td>
                      <Td className="tabular-nums">{tableData.weight.toFixed(1)}</Td>
                      <Td>{user?.userName}</Td>
                      <Td>{mixingTime || '---' }</Td>
                    </>
                  ) : (
                    <td colSpan={6} className="text-center text-slate-400 py-4">Vui lòng quét mã để hiển thị thông tin</td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Scan area */}
        <section className="rounded-2xl bg-white shadow-md p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              placeholder="Nhập mã tại đây..."
              className="flex-1 rounded-xl border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-slate-800 placeholder:italic focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={scannedCode}
              onChange={handleCodeChange}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              disabled={isLoading}
            />
            <button
              className="shrink-0 rounded-xl bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 active:scale-[.99] transition shadow-sm disabled:bg-gray-400 disabled:cursor-wait"
              onClick={handleScan}
              disabled={isLoading}
            >
              {isLoading ? "Đang quét..." : "Scan"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- CÁC COMPONENT PHỤ (giữ nguyên từ code của bạn) ---

function StatCard({ label, value, subtle = false }: { label: string; value: string | number; subtle?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 shadow-md border ${subtle ? "bg-white border-slate-100" : "bg-gradient-to-br from-sky-50 to-white border-sky-100"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left text-sm font-semibold tracking-wide px-4 py-3">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={"px-4 py-3 text-sm " + className}>{children}</td>;
}

export default WeighingStationNew;