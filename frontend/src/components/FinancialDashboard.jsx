import React, { useState } from 'react';

export default function FinancialDashboard({ status, historyLogs }) {
  const [monthlyTarget, setMonthlyTarget] = useState(1500000);
  const [editingTarget, setEditingTarget] = useState(false);
  const [newTargetInput, setNewTargetInput] = useState(1500000);

  const totalSaved = status?.total_money_saved || 0;
  const monthlySaved = status?.monthly_money_saved || 0;
  const weeklySaved = status?.weekly_money_saved || 0;
  const streak = status?.current_streak || 0;

  // Tính cấp độ Heo Đất dựa trên tổng tiền tích lũy
  const getPiggyLevel = (amount) => {
    if (amount >= 2500000) return { level: 5, title: 'Heo Vàng Vĩ Đại', icon: '👑', nextMilestone: 5000000, color: '#EAB308', prev: 2500000 };
    if (amount >= 1000000) return { level: 4, title: 'Heo Đất Triệu Phú', icon: '💎', nextMilestone: 2500000, color: '#06B6D4', prev: 1000000 };
    if (amount >= 500000) return { level: 3, title: 'Heo Đất Thông Thái', icon: '🥇', nextMilestone: 1000000, color: '#F59E0B', prev: 500000 };
    if (amount >= 200000) return { level: 2, title: 'Heo Đất Chăm Chỉ', icon: '🥈', nextMilestone: 500000, color: '#EC4899', prev: 200000 };
    return { level: 1, title: 'Heo Đất Nhí', icon: '🐷', nextMilestone: 200000, color: '#FF8E9E', prev: 0 };
  };

  const piggy = getPiggyLevel(totalSaved);
  const xpPercent = Math.min(100, Math.max(0, Math.round(((totalSaved - piggy.prev) / (piggy.nextMilestone - piggy.prev)) * 100)));
  const goalPercent = Math.min(100, Math.round((monthlySaved / (monthlyTarget || 1)) * 100));

  // Dữ liệu biểu đồ 7 ngày trong tuần
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const weeklyData = [
    { day: 'T2', amount: streak >= 1 ? 50000 : 0 },
    { day: 'T3', amount: streak >= 2 ? 50000 : 0 },
    { day: 'T4', amount: streak >= 3 ? 50000 : 0 },
    { day: 'T5', amount: streak >= 4 ? 50000 : 0 },
    { day: 'T6', amount: streak >= 5 ? 50000 : 0 },
    { day: 'T7', amount: streak >= 6 ? 50000 : 0 },
    { day: 'CN', amount: streak >= 7 ? 50000 : 0 },
  ];

  const maxVal = 60000;

  const handleSaveTarget = (e) => {
    e.preventDefault();
    setMonthlyTarget(Number(newTargetInput));
    setEditingTarget(false);
  };

  return (
    <div className="kawaii-card p-4 sm:p-6 mb-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#FFF0F3]">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-wiggle">📊</span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#5C4B47] tracking-tight">
              Bảng Thống Kê Tài Chính & Heo Đất Của Bé
            </h3>
            <p className="text-xs text-[#8C7A75] font-semibold">
              Biến từng khoản tiết kiệm nhỏ thành thành quả lớn ✨
            </p>
          </div>
        </div>
      </div>

      {/* Grid 2 cột: Cấp độ Heo Đất & Mục Tiêu Tháng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        
        {/* Card 1: Heo Đất Level & XP System */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#FFF5F7] via-white to-[#FFF0F5] border-2 border-[#FFD1DC] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE5EC] border-2 border-[#FFB7C5] flex items-center justify-center text-2xl shadow-sm animate-bounce-gentle">
                {piggy.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B8B] bg-white px-2 py-0.5 rounded-full border border-[#FFCAD4]">
                  Cấp Độ #{piggy.level}
                </span>
                <h4 className="text-sm sm:text-base font-black text-[#5C4B47] mt-0.5">
                  {piggy.title}
                </h4>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[#8C7A75]">Tổng tích lũy</span>
              <div className="text-sm sm:text-base font-black text-[#2D6A4F]">
                {totalSaved.toLocaleString('vi-VN')} đ
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-[#8C7A75] mb-1">
              <span>Kinh nghiệm lên cấp:</span>
              <span className="text-[#FF6B8B]">{xpPercent}%</span>
            </div>
            <div className="w-full h-3 bg-[#FFF0F3] rounded-full overflow-hidden p-0.5 border border-[#FFCCD5]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF94B8] to-[#FF6B8B] transition-all duration-700 shadow-sm"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-[#A3928E] font-semibold mt-1 text-right">
              Còn {(piggy.nextMilestone - totalSaved).toLocaleString('vi-VN')} đ để chạm mốc Cấp kế tiếp
            </p>
          </div>
        </div>

        {/* Card 2: Mục Tiêu Tháng & Thanh Tiến Độ */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#FFF9F0] via-white to-[#F0FDF4] border-2 border-[#FFE494] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🎯</span>
                <span className="text-xs font-black text-[#5C4B47]">Mục tiêu tiết kiệm tháng</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg sm:text-xl font-black text-[#E76F51]">
                  {monthlySaved.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-xs text-[#8C7A75] font-bold">
                  / {monthlyTarget.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Edit Target Button */}
            <div>
              {!editingTarget ? (
                <button
                  type="button"
                  onClick={() => {
                    setNewTargetInput(monthlyTarget);
                    setEditingTarget(true);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#FFD166] text-[11px] font-bold text-[#705800] hover:bg-[#FFF3B0] transition-all cursor-pointer"
                >
                  ✏️ Đổi mục tiêu
                </button>
              ) : (
                <form onSubmit={handleSaveTarget} className="flex items-center gap-1">
                  <input
                    type="number"
                    value={newTargetInput}
                    onChange={(e) => setNewTargetInput(e.target.value)}
                    className="w-24 px-2 py-0.5 text-xs font-bold border border-[#FFD166] rounded-lg"
                    step="50000"
                  />
                  <button type="submit" className="text-xs bg-[#D8F3DC] px-2 py-0.5 rounded-lg font-bold text-[#2D6A4F]">
                    Lưu
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Goal Progress Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-[#8C7A75] mb-1">
              <span>Đã hoàn thành:</span>
              <span className="text-[#2D6A4F] font-black">{goalPercent}%</span>
            </div>
            <div className="w-full h-3 bg-[#FFF8E7] rounded-full overflow-hidden p-0.5 border border-[#FFE494]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FACC15] via-[#4ADE80] to-[#22C55E] transition-all duration-700 shadow-sm"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-[#A3928E] font-semibold mt-1">
              {goalPercent >= 100 ? '🎉 Đạt mục tiêu tháng rồi! Bé đỉnh quá!' : `Còn ${(monthlyTarget - monthlySaved > 0 ? monthlyTarget - monthlySaved : 0).toLocaleString('vi-VN')} đ để cán đích`}
            </p>
          </div>
        </div>
      </div>

      {/* Biểu Đồ Cột 7 Ngày Tiết Kiệm Trong Tuần */}
      <div className="p-4 rounded-3xl bg-white border-2 border-[#FFE5EC]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-[#5C4B47] flex items-center gap-1">
            <span>📈</span>
            <span>Biểu đồ tích lũy chu kỳ 7 ngày tuần này:</span>
          </span>
          <span className="text-xs font-black text-[#FF6B8B] bg-[#FFF0F3] px-2.5 py-0.5 rounded-full border border-[#FFCCD5]">
            Tuần này: {weeklySaved.toLocaleString('vi-VN')} đ
          </span>
        </div>

        {/* SVG/HTML Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-28 pt-4 px-2 sm:px-6">
          {weeklyData.map((d, i) => {
            const barHeight = d.amount > 0 ? Math.round((d.amount / maxVal) * 85) : 8;
            const isToday = i === streak - 1;

            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                {/* Tooltip on hover */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-extrabold text-[#FF6B8B] bg-[#FFF0F3] px-1.5 py-0.5 rounded-md border border-[#FFCCD5] pointer-events-none mb-1">
                  {d.amount > 0 ? `${d.amount / 1000}k` : '0đ'}
                </span>

                {/* Animated Bar */}
                <div
                  className={`w-full max-w-[36px] rounded-xl transition-all duration-500 ${
                    d.amount > 0
                      ? isToday
                        ? 'bg-gradient-to-t from-[#FF8E9E] to-[#FFD1DC] shadow-md border border-white'
                        : 'bg-gradient-to-t from-[#95D5B2] to-[#D8F3DC] border border-white/60'
                      : 'bg-[#FFF0F3] border border-[#FFE5EC]'
                  }`}
                  style={{ height: `${barHeight}%` }}
                />

                {/* Day label */}
                <span className={`text-[11px] font-extrabold mt-1 ${d.amount > 0 ? 'text-[#2D6A4F]' : 'text-[#8C7A75]'}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

