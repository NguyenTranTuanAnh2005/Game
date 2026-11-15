import React, { useState } from 'react';
import { toggleSound, isSoundEnabled } from '../utils/audio';

export default function Header({ status, theme }) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/90 backdrop-blur-md border-b-2 border-[#FFE5EC] shadow-[0_4px_16px_rgba(255,182,193,0.12)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFD1DC] via-[#FFE5EC] to-[#FFF0F5] border-2 border-[#FFB7C5] flex items-center justify-center shadow-sm text-2xl animate-float">
            🐷
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xl font-extrabold text-[#5C4B47] tracking-tight">
                Tiết Kiệm 3D
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FFD1DC] text-[#9A4C62] border border-[#FFB7C5]/50">
                Nuôi Heo Đất 3D 🌸
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-extrabold bg-[#E0E7FF] text-[#3730A3] border border-[#C7D2FE]">
                {status?.tier_name?.split(':')[0] || 'Tier 1'}
              </span>
            </div>
            <p className="text-xs text-[#8C7A75] font-semibold mt-0.5">
              Tích lũy 7 ngày tô màu mô hình sự kiện tháng ✨
            </p>
          </div>
        </div>

        {/* Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Khiên bảo vệ chuỗi (Streak Freeze) */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-[#E0F2FE] border-2 border-[#BAE6FD] text-xs font-black text-[#0369A1] shadow-xs"
            title="Khiên bảo vệ chuỗi: Tự động cứu bạn khi lỡ 1 ngày điểm danh"
          >
            <span>🛡️</span>
            <span>Khiên: {status?.streak_freeze_count ?? 1}</span>
          </div>

          {/* Năng lượng Aura phát sáng */}
          {status?.glow_energy > 0 && (
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-[#FEF3C7] border-2 border-[#FDE68A] text-xs font-black text-[#92400E] shadow-xs animate-bounce-gentle"
              title="Năng lượng phát sáng từ việc kiềm chế cám dỗ"
            >
              <span>🌟</span>
              <span>Aura: +{status?.glow_energy}</span>
            </div>
          )}

          {/* Tổng tiền tiết kiệm */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#D8F3DC]/80 border-2 border-[#95D5B2] text-xs font-bold text-[#2D6A4F]">
            <span>💰</span>
            <span>
              Tổng: <strong className="font-black text-[#1B4332]">{formatCurrency(status?.total_money_saved)}</strong>
            </span>
          </div>

          {/* Tuần này */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF3B0]/80 border-2 border-[#FFE494] text-xs font-bold text-[#705800]">
            <span>✨</span>
            <span>
              Tuần #{status?.week_in_month || 1}: <strong className="font-black text-[#705800]">{formatCurrency(status?.weekly_money_saved)}</strong>
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="w-9 h-9 rounded-2xl bg-[#E8D7F1]/70 hover:bg-[#E8D7F1] border-2 border-[#D8B4E2] text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundOn ? '🔔' : '🔕'}
          </button>
        </div>
      </div>
    </header>
  );
}
