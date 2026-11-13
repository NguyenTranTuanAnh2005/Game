import React, { useState } from 'react';

export default function AchievementBadges({ status }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const streak = status?.current_streak || 0;
  const cycles = status?.total_cycles_completed || 0;
  const totalMoney = status?.total_money_saved || 0;
  const totalCheckIns = status?.total_check_ins || 0;

  const badges = [
    {
      id: 'first_step',
      name: 'Hạt Mầm Đầu Tiên',
      icon: '🌱',
      condition: 'Điểm danh tiết kiệm ngày đầu tiên',
      unlocked: totalCheckIns >= 1 || streak >= 1,
      tag: 'Bắt đầu',
      rewardText: 'Mỗi vĩ đại đều bắt đầu từ một bước chân nhỏ bé.',
    },
    {
      id: 'streak_3',
      name: 'Ý Chí Kiên Định',
      icon: '🔥',
      condition: 'Đạt chuỗi 3 ngày liên tục',
      unlocked: streak >= 3 || cycles >= 1,
      tag: 'Chuỗi 3 ngày',
      rewardText: 'Bạn đã chiến thắng sự trì hoãn 3 ngày liên tiếp!',
    },
    {
      id: 'master_7',
      name: 'Bậc Thầy 7 Ngày',
      icon: '👑',
      condition: 'Hoàn thành trọn vẹn mô hình 3D 7 ngày',
      unlocked: streak >= 7 || cycles >= 1,
      tag: 'Chu kỳ 1 tuần',
      rewardText: 'Mô hình 3D bừng sáng 100% màu sắc rực rỡ!',
    },
    {
      id: 'money_200k',
      name: 'Heo Đất Căng Tròn',
      icon: '💰',
      condition: 'Tổng tiền tiết kiệm đạt mốc 200.000 đ',
      unlocked: totalMoney >= 200000,
      tag: 'Tích lũy 200k',
      rewardText: 'Hũ tiền heo đất bắt đầu kêu leng keng rồi nè!',
    },
    {
      id: 'money_1m',
      name: 'Triệu Phú Tí Hon',
      icon: '💎',
      condition: 'Tổng tiền tiết kiệm đạt mốc 1.000.000 đ',
      unlocked: totalMoney >= 1000000,
      tag: 'Mốc 1 Triệu',
      rewardText: 'Một triệu đồng đầu tiên được tích lũy kỷ luật!',
    },
    {
      id: 'cycles_2',
      name: 'Kỷ Luật Vàng',
      icon: '🌟',
      condition: 'Hoàn thành 2 chu kỳ tuần liên tục',
      unlocked: cycles >= 2,
      tag: '2 Tuần liên tục',
      rewardText: 'Thói quen tài chính đã trở thành bản năng thứ hai của bạn.',
    },
    {
      id: 'blooming_garden',
      name: 'Bảo Mẫu Vườn Hoa',
      icon: '🌸',
      condition: 'Điểm danh tích lũy từ 10 ngày trở lên',
      unlocked: totalCheckIns >= 10,
      tag: '10 Ngày chăm chỉ',
      rewardText: 'Khu vườn thói quen của bạn ngập tràn hương sắc rạng ngời.',
    },
    {
      id: 'legend_3d',
      name: 'Huyền Thoại 3D',
      icon: '🏆',
      condition: 'Hoàn thành đủ 4 tuần trong cả tháng',
      unlocked: cycles >= 4,
      tag: 'Cả tháng xuất sắc',
      rewardText: 'Bạn là bậc thầy tự chủ tài chính đáng ngưỡng mộ!',
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="kawaii-card p-4 sm:p-6 mb-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#FFF0F3]">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-wiggle">🏅</span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#5C4B47] tracking-tight">
              Phòng Truyền Thống & Bộ Sưu Tập Huy Hiệu
            </h3>
            <p className="text-xs text-[#8C7A75] font-semibold">
              Mở khóa những cột mốc vinh danh kiên trì của bé 🌸
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFD1DC] text-[#8C3A52] border border-[#FFCAD4] shadow-sm">
          Đã mở: {unlockedCount}/{badges.length} Huy hiệu
        </span>
      </div>

      {/* Grid 8 Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBadge(b)}
            className={`p-3 rounded-3xl border-2 transition-all flex flex-col items-center text-center cursor-pointer select-none ${
              b.unlocked
                ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FFF0F5] border-[#FFB7C5] shadow-[0_6px_16px_rgba(255,182,193,0.3)] hover:scale-105 active:scale-95'
                : 'bg-white/40 border-[#FFE5EC] opacity-60 grayscale hover:grayscale-0'
            }`}
          >
            {/* Badge Icon */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-2 transition-all ${
                b.unlocked
                  ? 'bg-gradient-to-tr from-[#FFE5EC] to-[#FFF3B0] border-2 border-[#FFD166] shadow-sm animate-bounce-gentle'
                  : 'bg-[#F1F5F9] border border-[#CBD5E1]'
              }`}
            >
              {b.icon}
            </div>

            {/* Name */}
            <h4 className="text-xs font-black text-[#5C4B47] line-clamp-1">
              {b.name}
            </h4>

            {/* Status tag */}
            <span
              className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                b.unlocked
                  ? 'bg-[#D8F3DC] text-[#2D6A4F] border border-[#95D5B2]'
                  : 'bg-[#F1F5F9] text-[#94A3B8]'
              }`}
            >
              {b.unlocked ? '✓ Đã nhận' : 'Khóa'}
            </span>
          </div>
        ))}
      </div>

      {/* Modal chi tiết Huy hiệu khi bấm vào */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] border-4 border-[#FFE5EC] shadow-[0_20px_50px_rgba(255,182,193,0.4)] p-6 flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#8C3A52] font-black flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-3 shadow-md ${
                selectedBadge.unlocked
                  ? 'bg-gradient-to-tr from-[#FFE5EC] via-[#FFD1DC] to-[#FFF3B0] border-3 border-[#FFD166] animate-wiggle'
                  : 'bg-slate-100 border-2 border-slate-300 grayscale'
              }`}
            >
              {selectedBadge.icon}
            </div>

            <h3 className="text-lg font-black text-[#5C4B47]">
              {selectedBadge.name}
            </h3>
            <span className="text-xs font-extrabold text-[#FF6B8B] bg-[#FFF0F3] px-3 py-0.5 rounded-full border border-[#FFCCD5] my-1">
              {selectedBadge.tag}
            </span>

            <p className="text-xs text-[#8C7A75] font-semibold mt-2">
              <strong>Điều kiện mở khóa:</strong> {selectedBadge.condition}
            </p>

            <div className="mt-3 p-3 rounded-2xl bg-[#FFF8F0] border border-[#FFE494] text-xs font-bold text-[#705800] italic w-full">
              "{selectedBadge.rewardText}"
            </div>

            <div className="mt-4">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-black ${
                  selectedBadge.unlocked
                    ? 'bg-[#D8F3DC] text-[#2D6A4F] border border-[#95D5B2]'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {selectedBadge.unlocked ? '🎉 Đã mở khóa vào bộ sưu tập' : '🔒 Chưa đủ điều kiện mở khóa'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

