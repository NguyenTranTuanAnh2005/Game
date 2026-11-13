import React from 'react';

export default function StreakTracker({ status }) {
  const currentStreak = status?.current_streak || 0;
  const progressPercent = Math.min(100, Math.round((currentStreak / 7) * 100));

  // 7 biểu tượng mầm cây nở hoa theo ngày
  const dayIcons = [
    { seed: '🌱', bloomed: '🌸', name: 'Gieo hạt' },
    { seed: '🌿', bloomed: '🌷', name: 'Nảy mầm' },
    { seed: '🍃', bloomed: '🌼', name: 'Chồi biếc' },
    { seed: '🌾', bloomed: '🌻', name: 'Đón nắng' },
    { seed: '🎋', bloomed: '🌺', name: 'Vươn cao' },
    { seed: '🪴', bloomed: '💐', name: 'Kết hoa' },
    { seed: '✨', bloomed: '👑', name: 'Trọn vẹn' },
  ];

  return (
    <div className="kawaii-card p-4 sm:p-6 mb-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-[#FF6B8B] tracking-wide flex items-center gap-1">
              <span>🌈</span>
              <span>Hành trình 7 ngày chăm chỉ</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF3B0] text-[#705800] font-bold border border-[#FFE494]">
              {currentStreak === 7 ? 'Hoàn thành 100% 💖' : `Đã hoàn thành ${currentStreak}/7 ngày`}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-[#5C4B47] tracking-tight">
              {currentStreak}
            </span>
            <span className="text-[#8C7A75] text-sm font-bold">
              / 7 ngày nở hoa
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right bg-[#FFF0F5] px-4 py-2 rounded-2xl border border-[#FFCCD5]">
          <span className="text-xs font-bold text-[#8C7A75]">Bức tranh hé lộ</span>
          <div className="text-lg font-black text-[#FF6B8B]">{progressPercent}% ✨</div>
        </div>
      </div>

      {/* Marshmallow Chubby Progress Bar */}
      <div className="w-full h-4 bg-[#FFF0F3] rounded-full overflow-hidden p-0.5 border-2 border-[#FFCCD5] mb-5 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FFF3B0] via-[#FFB7C5] to-[#BFF0EA] transition-all duration-700 ease-out relative shadow-sm"
          style={{ width: `${progressPercent}%` }}
        >
          {progressPercent > 0 && (
            <div className="absolute inset-0 bg-white/40 animate-pulse rounded-full" />
          )}
        </div>
      </div>

      {/* 7 Days Kawaii Blooming Steps */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {status?.days?.map((day, idx) => {
          const isDone = day.status === 'completed';
          const isCurrent = day.status === 'current';
          const iconPair = dayIcons[idx] || { seed: '🌱', bloomed: '🌸', name: `Ngày ${day.day_number}` };

          return (
            <div
              key={day.day_number}
              className={`flex flex-col items-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all text-center ${
                isDone
                  ? 'bg-[#E8F8F5] border-[#95D5B2] shadow-sm'
                  : isCurrent
                  ? 'bg-[#FFF8E7] border-[#FFD166] ring-3 ring-[#FFE494]/60 animate-bounce-gentle'
                  : 'bg-white/60 border-[#FFE5EC] opacity-75'
              }`}
            >
              {/* Cute Chibi Icon (Seed or Bloom) */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-lg sm:text-xl mb-1 transition-all ${
                  isDone
                    ? 'bg-[#D8F3DC] border border-[#95D5B2] shadow-sm animate-wiggle'
                    : isCurrent
                    ? 'bg-[#FFF3B0] border border-[#FFD166] shadow-sm animate-pulse'
                    : 'bg-[#FFF0F3] border border-[#FFD1DC] text-slate-400'
                }`}
              >
                {isDone ? iconPair.bloomed : isCurrent ? '✨' : iconPair.seed}
              </div>

              {/* Day Label */}
              <span className={`text-[11px] sm:text-xs font-bold leading-tight ${
                isDone ? 'text-[#2D6A4F]' : isCurrent ? 'text-[#705800]' : 'text-[#8C7A75]'
              }`}>
                Ngày {day.day_number}
              </span>

              {/* Status Hint */}
              <span className="text-[10px] hidden sm:block text-[#A3928E] font-semibold mt-0.5">
                {isDone ? 'Đã nở hoa' : isCurrent ? 'Hôm nay' : iconPair.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
