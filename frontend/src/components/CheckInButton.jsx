import React, { useState } from 'react';
import { playCheckInSound } from '../utils/audio';

export default function CheckInButton({
  status,
  onCheckIn,
  onReset,
  onSimulateDay,
  loading,
  feedback,
}) {
  const [amount, setAmount] = useState(50000);
  const [note, setNote] = useState('');
  const canCheckIn = status?.can_check_in;
  const currentStreak = status?.current_streak || 0;
  const nextDayNumber = currentStreak < 7 ? currentStreak + 1 : 1;
  const nextPartName = status?.model_3d?.sub_parts?.[nextDayNumber - 1]?.part_name || `Bộ phận #${nextDayNumber}`;

  const presetAmounts = [20000, 50000, 100000, 200000];

  const handleCheckInSubmit = (e) => {
    e.preventDefault();
    if (!canCheckIn || loading) return;
    playCheckInSound();
    onCheckIn(amount, note);
    setNote('');
  };

  return (
    <div className="kawaii-card p-5 sm:p-6 mb-6">
      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div
          className={`mb-4 p-3.5 rounded-2xl border-2 text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
            feedback.type === 'error'
              ? 'bg-[#FFE5D9] border-[#F4A261] text-[#9D4B28]'
              : 'bg-[#D8F3DC] border-[#95D5B2] text-[#2D6A4F]'
          }`}
        >
          <span className="text-xl">
            {feedback.type === 'error' ? '🥺' : '🌸'}
          </span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Savings Check-In Form */}
      <form onSubmit={handleCheckInSubmit} className="space-y-4">
        {canCheckIn && (
          <>
            {/* Quick Amount Selector */}
            <div>
              <label className="block text-xs font-extrabold text-[#5C4B47] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>💰</span>
                  <span>Số tiền bạn tiết kiệm hôm nay:</span>
                </span>
                <span className="text-sm font-black text-[#FF6B8B]">
                  {amount.toLocaleString('vi-VN')} đ
                </span>
              </label>

              <div className="grid grid-cols-4 gap-2 mb-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-2xl text-xs font-extrabold transition-all border-2 active:scale-95 ${
                      amount === amt
                        ? 'bg-[#FFD1DC] text-[#7A263D] border-[#FF8E9E] shadow-sm'
                        : 'bg-white text-[#5C4B47] border-[#FFE5EC] hover:bg-[#FFF0F3]'
                    }`}
                  >
                    +{(amt / 1000).toLocaleString('vi-VN')}k
                  </button>
                ))}
              </div>
            </div>

            {/* Note input */}
            <div>
              <label className="block text-xs font-extrabold text-[#5C4B47] mb-1.5 flex items-center gap-1.5">
                <span>📝</span>
                <span>Mục tiêu / Nguồn tiết kiệm (Tùy chọn):</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Bớt 1 ly trà sữa, tự nấu ăn trưa, tiền thưởng nhỏ..."
                className="w-full bg-white border-2 border-[#FFCCD5] rounded-2xl px-4 py-3 text-sm text-[#5C4B47] placeholder-[#B5A4A0] focus:outline-none focus:border-[#FF8E9E] focus:ring-3 focus:ring-[#FFD1DC] transition-all shadow-sm"
              />
            </div>
          </>
        )}

        {/* Squishy Chubby Marshmallow Button */}
        <div>
          <button
            type="submit"
            disabled={!canCheckIn || loading}
            className={`btn-squishy w-full py-4 px-6 rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-3 cursor-pointer select-none ${
              canCheckIn
                ? 'bg-gradient-to-r from-[#FF94B8] via-[#FF8E9E] to-[#FFB7C5] text-white border-2 border-white/60 shadow-[0_12px_24px_rgba(255,148,184,0.38)]'
                : 'bg-[#E8F8F5] text-[#2D6A4F] border-2 border-[#95D5B2] cursor-not-allowed shadow-none'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang nuôi heo đất 3D...</span>
              </>
            ) : canCheckIn ? (
              <>
                <span className="text-2xl animate-wiggle">🐷</span>
                <span>
                  Bỏ Heo +{amount.toLocaleString('vi-VN')} đ (Tô màu {nextPartName})
                </span>
                <span className="text-xl">✨</span>
              </>
            ) : (
              <>
                <span className="text-2xl">🌱</span>
                <span>Hôm nay bạn đã hoàn thành tiết kiệm rồi! Hẹn gặp lại ngày mai</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Developer / Demo Quick Testing Section */}
      <div className="mt-5 pt-4 border-t-2 border-[#FFF0F3]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A75]">
            <span>🪄</span>
            <span>Công cụ kiểm thử 3D:</span>
            <span className="font-semibold text-[#A3928E] hidden sm:inline">(Trải nghiệm chu kỳ 7 ngày ngay)</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onSimulateDay}
              disabled={loading}
              className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-2xl bg-[#FFF3B0] hover:bg-[#FFE494] border-2 border-[#FFD166] text-xs font-extrabold text-[#705800] transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>⏩</span>
              <span>Tua nhanh +1 ngày (50k)</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              disabled={loading}
              className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-2xl bg-[#FFE5EC] hover:bg-[#FFCCD5] border-2 border-[#FFB7C5] text-xs font-extrabold text-[#8C3A52] transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🔄</span>
              <span>Reset tuần này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
