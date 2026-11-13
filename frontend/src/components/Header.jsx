import React, { useState } from 'react';
import { toggleSound, isSoundEnabled } from '../utils/audio';

export default function Header({ status, theme }) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        weekday: 'long',
        month: 'numeric',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/85 backdrop-blur-md border-b-2 border-[#FFE5EC] shadow-[0_4px_16px_rgba(255,182,193,0.12)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFD1DC] via-[#FFE5EC] to-[#FFF0F5] border-2 border-[#FFB7C5] flex items-center justify-center shadow-sm text-2xl animate-float">
            🐷
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold text-[#5C4B47] tracking-tight">
                Tiết Kiệm 3D
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FFD1DC] text-[#9A4C62] border border-[#FFB7C5]/50">
                Nuôi Heo Đất 3D 🌸
              </span>
            </div>
            <p className="text-xs text-[#8C7A75] font-semibold mt-0.5">
              Tích lũy 7 ngày tô màu mô hình sự kiện tháng ✨
            </p>
          </div>
        </div>

        {/* Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Tổng tiền tiết kiệm */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#D8F3DC]/70 border-2 border-[#95D5B2] text-xs font-bold text-[#2D6A4F]">
            <span>💰</span>
            <span>
              Tổng tích lũy: <strong className="font-black text-[#1B4332]">{formatCurrency(status?.total_money_saved)}</strong>
            </span>
          </div>

          {/* Tuần này */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF3B0]/70 border-2 border-[#FFE494] text-xs font-bold text-[#705800]">
            <span>✨</span>
            <span>
              Tuần #{status?.week_in_month || 1}: <strong className="font-black text-[#705800]">{formatCurrency(status?.weekly_money_saved)}</strong>
            </span>
          </div>

          {/* Chu kỳ đã hoàn thành */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#D0E8FF]/60 border-2 border-[#A0C4FF] text-xs font-bold text-[#2A5C99]">
            <span>🏆</span>
            <span>
              Tuần xong: <strong className="font-extrabold text-[#1E457A]">{status?.total_cycles_completed || 0}</strong>
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="w-9 h-9 rounded-2xl bg-[#E8D7F1]/70 hover:bg-[#E8D7F1] border-2 border-[#D8B4E2] text-sm flex items-center justify-center transition-all active:scale-90"
            title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundOn ? '🔔' : '🔕'}
          </button>
        </div>
      </div>
    </header>
  );
}
