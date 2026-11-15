import React, { useState } from 'react';
import Scene3D from './Scene3D';

export default function Savings3DViewer({ status, coinActive, selectedMonth }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [envPreset, setEnvPreset] = useState('spring');
  const [inspectedDay, setInspectedDay] = useState(null);

  const currentStreak = status?.current_streak || 0;
  const modelData = status?.model_3d;
  const month = selectedMonth || modelData?.month || 11;
  const renderProgress = status?.render_progress || 0;
  const percent = Math.round(renderProgress * 100);
  const tierLevel = status?.tier_level || 1;
  const tierName = status?.tier_name || 'Tier 1: Mô hình nguyên bản';
  const tierDesc = status?.tier_description || '';
  const glowEnergy = status?.glow_energy || 0;

  const envStyles = {
    spring: 'bg-gradient-to-b from-[#FFF5F7] via-[#FFF9F6] to-[#F0FDF4]',
    galaxy: 'bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#311042]',
    sunset: 'bg-gradient-to-b from-[#FFF7ED] via-[#FED7AA] to-[#FBCFE8]',
  };

  const inspectedPart = inspectedDay
    ? modelData?.sub_parts?.find((p) => p.day === inspectedDay)
    : null;

  return (
    <div className="kawaii-card p-4 sm:p-5 mb-6 relative overflow-hidden">
      {/* Header thanh điều khiển 3D Photorealistic */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-[#FFE5EC] text-[#8C3A52] border border-[#FFCAD4] inline-flex items-center gap-1 shadow-sm">
              <span>💎</span>
              <span>Photorealistic PBR • Tuần #{status?.week_in_month || 1}</span>
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-[#E0E7FF] text-[#3730A3] border border-[#C7D2FE] inline-flex items-center gap-1 shadow-sm">
              <span>⭐</span>
              <span>{tierName}</span>
            </span>
            <span className="text-xs font-extrabold text-[#705800] bg-[#FFF3B0] px-2.5 py-0.5 rounded-full border border-[#FFD166]">
              {percent}% Full PBR Color
            </span>
            {glowEnergy > 0 && (
              <span className="text-xs font-black text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FCD34D] animate-bounce-gentle inline-flex items-center gap-1">
                <span>🌟</span>
                <span>+{glowEnergy} Aura Năng Lượng</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#5C4B47] tracking-tight mt-1">
            {modelData?.name || 'Mô hình 3D Sự Kiện Tháng'}
          </h3>
          <p className="text-xs sm:text-sm text-[#8C7A75] font-semibold">
            {modelData?.description} • <span className="text-[#FF6B8B] font-bold">{tierDesc}</span>
          </p>
        </div>

        {/* Studio Lighting & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Environment Presets */}
          <div className="flex items-center bg-white/80 p-1 rounded-2xl border border-[#FFCAD4]">
            <button
              type="button"
              onClick={() => setEnvPreset('spring')}
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                envPreset === 'spring' ? 'bg-[#FFD1DC] text-[#7A263D] shadow-xs' : 'text-[#8C7A75]'
              }`}
              title="Studio Mùa Xuân"
            >
              🌸
            </button>
            <button
              type="button"
              onClick={() => setEnvPreset('galaxy')}
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                envPreset === 'galaxy' ? 'bg-[#312E81] text-white shadow-xs' : 'text-[#8C7A75]'
              }`}
              title="Studio Ngân Hà"
            >
              🌌
            </button>
            <button
              type="button"
              onClick={() => setEnvPreset('sunset')}
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                envPreset === 'sunset' ? 'bg-[#FB923C] text-white shadow-xs' : 'text-[#8C7A75]'
              }`}
              title="Studio Hoàng Hôn"
            >
              🌇
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
              autoRotate ? 'bg-[#D8F3DC] text-[#2D6A4F] border-[#95D5B2]' : 'bg-white text-[#5C4B47] border-[#FFE5EC]'
            }`}
          >
            <span>{autoRotate ? '⏸️ Tạm dừng' : '▶️ Tự xoay 3D'}</span>
          </button>
        </div>
      </div>

      {/* Khung Canvas Three.js Photorealistic với EffectComposer */}
      <div className={`relative w-full h-[420px] sm:h-[490px] rounded-3xl overflow-hidden ${envStyles[envPreset]} border-3 border-[#FFE5EC] shadow-inner select-none cursor-grab active:cursor-grabbing`}>
        <Scene3D
          month={month}
          streak={currentStreak}
          tier={tierLevel}
          glowEnergy={glowEnergy}
          coinActive={coinActive}
          autoRotate={autoRotate}
          envPreset={envPreset}
          onSelectDay={(dayNum) => setInspectedDay(dayNum)}
        />

        {/* Hướng dẫn tương tác */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#FFD1DC] text-[11px] font-bold text-[#5C4B47] flex items-center gap-1.5 shadow-sm pointer-events-none">
          <span>🖐️</span>
          <span>Bấm vào bộ phận 3D để xem chi tiết • Kéo xoay 360° Studio</span>
        </div>

        {/* Floating Inspector Card khi bấm vào 1 bộ phận */}
        {inspectedPart && (
          <div className="absolute top-3 left-3 max-w-[270px] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-[#FFD1DC] shadow-lg animate-fadeIn text-xs z-30">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#FFE5EC]">
              <span className="font-black text-[#FF6B8B] flex items-center gap-1">
                <span>📦</span>
                <span>Ngày #{inspectedPart.day}</span>
              </span>
              <button
                type="button"
                onClick={() => setInspectedDay(null)}
                className="w-5 h-5 rounded-full bg-[#FFF0F3] text-[#8C3A52] font-black flex items-center justify-center cursor-pointer"
              >
                ×
              </button>
            </div>
            <h4 className="font-black text-sm text-[#5C4B47] mb-1">
              {inspectedPart.part_name}
            </h4>
            <p className="text-[11px] text-[#8C7A75] font-semibold mb-2">
              {inspectedPart.description}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white shadow-sm inline-block"
                style={{ backgroundColor: inspectedPart.color }}
              />
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                inspectedPart.day <= currentStreak ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'bg-slate-100 text-slate-500'
              }`}>
                {inspectedPart.day <= currentStreak ? '✓ Đã mở khóa PBR' : '🔒 Thạch cao mờ'}
              </span>
            </div>
          </div>
        )}

        {/* Badge tiến độ */}
        <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-[#FFD1DC] flex items-center gap-2 shadow-sm pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF8E9E] animate-ping" />
          <span className="text-xs font-black text-[#FF6B8B]">
            Đã lên màu: {currentStreak}/7 bộ phận
          </span>
        </div>
      </div>

      {/* Danh sách 7 bộ phận 3D hé lộ theo ngày */}
      <div className="mt-4 pt-3 border-t-2 border-[#FFF0F3]">
        <span className="text-xs font-extrabold text-[#5C4B47] mb-2 block">
          📦 Bấm chọn bộ phận để soi chi tiết trên vật thể 3D:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {modelData?.sub_parts?.map((part) => {
            const isUnlocked = part.day <= currentStreak;
            const isNext = part.day === currentStreak + 1;
            const isSelected = inspectedDay === part.day;

            return (
              <div
                key={part.day}
                onClick={() => setInspectedDay(part.day)}
                className={`p-2 rounded-2xl border text-center transition-all cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'ring-3 ring-[#FF8E9E] bg-[#FFE5EC] border-[#FF8E9E] shadow-sm'
                    : isUnlocked
                    ? 'bg-[#D8F3DC]/70 border-[#95D5B2] shadow-sm hover:bg-[#D8F3DC]'
                    : isNext
                    ? 'bg-[#FFF3B0]/80 border-[#FFD166] ring-2 ring-[#FFE494] animate-bounce-gentle'
                    : 'bg-white/50 border-[#FFE5EC] opacity-60'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span
                    className="w-3 h-3 rounded-full border border-white shadow-xs inline-block"
                    style={{ backgroundColor: isUnlocked ? part.color : '#94A3B8' }}
                  />
                  <span className="text-[10px] font-extrabold text-[#5C4B47]">Ngày {part.day}</span>
                </div>
                <div className="text-[11px] font-bold text-[#5C4B47] truncate" title={part.part_name}>
                  {part.part_name}
                </div>
                <span className={`text-[9px] font-bold block mt-0.5 ${
                  isUnlocked ? 'text-[#2D6A4F]' : isNext ? 'text-[#705800]' : 'text-[#8C7A75]'
                }`}>
                  {isUnlocked ? '✓ Đã tô màu PBR' : isNext ? '✨ Mở hôm nay' : 'Khóa'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
