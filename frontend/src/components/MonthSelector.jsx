import React from 'react';

export default function MonthSelector({
  currentMonth,
  selectedMonth,
  onSelectMonth,
  allThemes,
  theme,
  useCustomImage,
  setUseCustomImage,
}) {
  return (
    <div className="kawaii-card p-4 sm:p-5 mb-5 relative overflow-hidden">
      {/* Decorative cute corner bubbles */}
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#FFD1DC]/40 pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-[#D8F3DC]/50 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month info & cute quote */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#FFD1DC] text-[#8C3A52] border border-[#FFB7C5] inline-flex items-center gap-1 shadow-sm">
              <span>🌸</span>
              <span>{theme?.month_name}</span>
            </span>
            {selectedMonth !== currentMonth && (
              <span className="text-[11px] font-bold text-[#E76F51] bg-[#FFE5D9] px-2.5 py-0.5 rounded-full border border-[#F4A261]/40">
                (Đang ngắm thử nè ✨)
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#5C4B47] tracking-tight">
            {theme?.title} 🌷
          </h2>
          <p className="text-xs sm:text-sm text-[#8C7A75] font-semibold mt-1 italic">
            "{theme?.quote}"
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Custom image toggle */}
          <button
            type="button"
            onClick={() => setUseCustomImage(!useCustomImage)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border-2 ${
              useCustomImage
                ? 'bg-[#FFD1DC] text-[#7A263D] border-[#FF8E9E] shadow-sm'
                : 'bg-white/80 text-[#5C4B47] border-[#FFE5EC] hover:bg-[#FFF0F3]'
            } active:scale-95`}
          >
            <span>{useCustomImage ? '🎀' : '🖼️'}</span>
            <span>{useCustomImage ? 'Đang xem ảnh của tớ' : 'Đổi ảnh của tớ'}</span>
          </button>

          {/* Month selector dropdown */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => onSelectMonth(Number(e.target.value))}
              aria-label="Chọn tháng dễ thương"
              className="appearance-none bg-white border-2 border-[#FFCAD4] text-[#5C4B47] text-xs sm:text-sm font-bold rounded-2xl px-4 py-2 pr-9 focus:outline-none focus:ring-3 focus:ring-[#FFD1DC] cursor-pointer shadow-sm"
            >
              {allThemes?.map((t) => (
                <option key={t.month} value={t.month}>
                  {t.month === currentMonth ? `💖 ${t.month_name} (Hiện tại)` : `🌸 ${t.month_name}`}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#FF8E9E]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
