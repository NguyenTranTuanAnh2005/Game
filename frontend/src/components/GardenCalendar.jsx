import React from 'react';

export default function GardenCalendar({ status, historyLogs }) {
  // Lấy số ngày trong tháng hiện tại
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const todayDateNumber = now.getDate();

  // Tạo tập hợp các ngày đã điểm danh từ log
  const checkedInDates = new Set();
  if (status?.last_check_in) {
    checkedInDates.add(status.last_check_in);
  }
  historyLogs?.forEach((log) => {
    if (log.check_in_date) {
      checkedInDates.add(log.check_in_date);
    }
  });

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="kawaii-card p-4 sm:p-5 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-[#5C4B47] flex items-center gap-1.5">
          <span>🪴</span>
          <span>Khu vườn thói quen tháng {currentMonth + 1}</span>
        </h3>
        <span className="text-[11px] font-bold text-[#8C7A75] bg-[#FFF0F3] px-2.5 py-0.5 rounded-full border border-[#FFCCD5]">
          Mỗi ngày nở một bông hoa 🌸
        </span>
      </div>

      {/* Grid of days in month */}
      <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-1.5 sm:gap-2">
        {daysArray.map((dayNum) => {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isDone = checkedInDates.has(dateStr);
          const isToday = dayNum === todayDateNumber;
          const isFuture = dayNum > todayDateNumber;

          return (
            <div
              key={dayNum}
              className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-2xl border transition-all text-center ${
                isDone
                  ? 'bg-[#D8F3DC]/70 border-[#95D5B2] shadow-sm'
                  : isToday
                  ? 'bg-[#FFF3B0]/70 border-[#FFD166] ring-2 ring-[#FFE494] animate-bounce-gentle'
                  : isFuture
                  ? 'bg-white/40 border-[#FFE5EC] opacity-60'
                  : 'bg-white/70 border-[#FFE5EC]'
              }`}
              title={isDone ? `Ngày ${dayNum}: Đã nở hoa 🌸` : isToday ? `Hôm nay: Ngày ${dayNum}` : `Ngày ${dayNum}`}
            >
              <span className="text-xs sm:text-sm">
                {isDone ? '🌸' : isToday ? '✨' : isFuture ? '🌱' : '🍃'}
              </span>
              <span className={`text-[10px] font-bold mt-0.5 ${
                isDone ? 'text-[#2D6A4F]' : isToday ? 'text-[#705800]' : 'text-[#8C7A75]'
              }`}>
                {dayNum}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

