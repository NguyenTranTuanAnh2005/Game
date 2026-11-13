import React, { useState } from 'react';
import PostcardModal from './PostcardModal';

export default function PictureReveal({ status, theme, useCustomImage }) {
  const currentStreak = status?.current_streak || 0;
  const isCompleted = currentStreak >= 7;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPostcardModal, setShowPostcardModal] = useState(false);

  // Chọn nguồn ảnh (theme chính hoặc ảnh tùy chỉnh)
  const imageSrc = useCustomImage
    ? '/static/images/download.jpg'
    : theme?.image_url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80';

  // Chibi mascots cho 7 mảnh ghép khi đang ngủ say
  const tileMascots = [
    { icon: '🐱', sleeping: 'Mèo con ngủ say', cuteTag: 'Chờ xoa đầu' },
    { icon: '🐰', sleeping: 'Thỏ bông mơ mộng', cuteTag: 'Chờ cà rốt' },
    { icon: '🐻', sleeping: 'Gấu con cuộn tròn', cuteTag: 'Chờ mật ong' },
    { icon: '🐥', sleeping: 'Vịt con tắm mát', cuteTag: 'Chờ bong bóng' },
    { icon: '🐹', sleeping: 'Chuột hamster má phúng', cuteTag: 'Chờ hạt dẻ' },
    { icon: '🐼', sleeping: 'Panda tròn xoe', cuteTag: 'Chờ lá trúc' },
    { icon: '🦄', sleeping: 'Kỳ lân bảy sắc', cuteTag: 'Phép màu cuối' },
  ];

  // 7 mảnh ghép theo lưới 6 cột (2 - 3 - 2)
  const tileLayouts = [
    { id: 1, colSpan: 'col-span-3' },
    { id: 2, colSpan: 'col-span-3' },
    { id: 3, colSpan: 'col-span-2' },
    { id: 4, colSpan: 'col-span-2' },
    { id: 5, colSpan: 'col-span-2' },
    { id: 6, colSpan: 'col-span-3' },
    { id: 7, colSpan: 'col-span-3' },
  ];

  return (
    <div className="relative mb-6">
      {/* Khung viền mây tròn bồng bềnh */}
      <div
        className={`relative rounded-[2.5rem] p-3 sm:p-4 transition-all duration-700 bg-white border-4 ${
          isCompleted
            ? 'border-[#FFB7C5] shadow-[0_15px_40px_rgba(255,183,197,0.45)] ring-4 ring-[#FFE5EC]'
            : 'border-[#FFE5EC] shadow-[0_12px_32px_rgba(255,192,203,0.22)]'
        }`}
      >
        {/* Aspect Ratio Box chứa ảnh */}
        <div className="relative w-full h-[440px] sm:h-[520px] md:h-[560px] rounded-[2rem] overflow-hidden bg-[#FFF5F7] select-none">
          {/* Skeleton Loader dễ thương */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF8F0]">
              <div className="text-4xl animate-bounce-gentle">🌸</div>
              <span className="text-xs text-[#8C7A75] font-bold mt-2">
                Đang chuẩn bị bức tranh kẹo ngọt...
              </span>
            </div>
          )}

          {/* Ảnh kiệt tác dưới lớp phủ */}
          <img
            src={imageSrc}
            alt={theme?.title || 'Kiệt tác tháng'}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80';
            }}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isCompleted ? 'scale-105' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Lưới 7 ô mảnh ghép bong bóng bí ẩn */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-2 sm:gap-2.5 p-2 sm:p-3 pointer-events-none">
            {tileLayouts.map((tile, idx) => {
              const dayData = status?.days?.find((d) => d.day_number === tile.id);
              const isRevealed = tile.id <= currentStreak;
              const isNext = tile.id === currentStreak + 1;
              const mascot = tileMascots[idx] || { icon: '🌸', sleeping: 'Đang ngủ say', cuteTag: 'Chờ mở' };

              return (
                <div
                  key={tile.id}
                  className={`relative rounded-3xl transition-all duration-700 ease-out flex flex-col items-center justify-center ${tile.colSpan} ${
                    isRevealed
                      ? 'opacity-0 pointer-events-none scale-75 rotate-6'
                      : 'opacity-100 pointer-events-auto bg-[#FFFDF9]/92 backdrop-blur-md border-2 border-dashed border-[#FFCCD5] shadow-sm'
                  } ${
                    isNext
                      ? 'border-[#FF94B8] ring-4 ring-[#FFD1DC]/80 bg-[#FFF5F7] animate-bounce-gentle'
                      : ''
                  }`}
                >
                  {/* Nội dung mảnh ghép khi chưa mở */}
                  {!isRevealed && (
                    <div className="p-2 sm:p-3 text-center flex flex-col items-center justify-center max-w-[95%]">
                      {/* Chibi Icon Mascot */}
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-1 transition-all ${
                          isNext
                            ? 'bg-[#FFE5EC] border-2 border-[#FF8E9E] shadow-sm animate-wiggle'
                            : 'bg-[#FFF0F3] border border-[#FFCAD4]'
                        }`}
                      >
                        {isNext ? '✨' : mascot.icon}
                      </div>

                      {/* Tiêu đề mảnh ghép */}
                      <div className="text-xs sm:text-sm font-extrabold text-[#5C4B47] tracking-tight">
                        Mảnh ghép #{tile.id}
                      </div>

                      {/* Dòng chữ miêu tả nhẹ nhàng */}
                      <div className="text-[11px] font-bold text-[#FF6B8B] mt-0.5 line-clamp-1">
                        {isNext ? '✨ Sẵn sàng mở nè!' : dayData?.title || mascot.sleeping}
                      </div>

                      {/* Cute Pill Tag */}
                      <span
                        className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isNext
                            ? 'bg-[#FF94B8] text-white shadow-sm'
                            : 'bg-[#FFE5EC] text-[#8C3A52]'
                        }`}
                      >
                        {isNext ? 'Chờ bé bấm 💖' : mascot.cuteTag}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Watermark góc nhỏ nhắn */}
          <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#FFCCD5] text-xs font-bold text-[#5C4B47] flex items-center gap-1.5 shadow-sm z-20">
            <span className="text-sm">🌸</span>
            <span>Đã hé lộ {currentStreak}/7 góc nhỏ</span>
          </div>

          {/* Popup chúc mừng khi đủ 7 ngày */}
          {isCompleted && (
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-20 flex flex-col items-center text-center animate-fadeIn">
              <span className="text-3xl sm:text-4xl animate-bounce-gentle">👑 🌸 💖</span>
              <h3 className="text-lg sm:text-2xl font-black text-[#FF6B8B] tracking-tight mt-1">
                Ôi tuyệt quá! Bé đã mở trọn vẹn bức tranh rồi!
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4B47] font-semibold max-w-md mt-0.5 mb-3">
                7 ngày chăm chỉ ngọt ngào đã đơm hoa kết trái. Cùng ngắm nhìn kiệt tác{' '}
                <strong className="text-[#E76F51]">{theme?.title}</strong> nhé!
              </p>

              {/* Button mở Postcard Modal chuẩn đẹp */}
              <button
                type="button"
                onClick={() => setShowPostcardModal(true)}
                className="btn-squishy pointer-events-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF94B8] via-[#FF8E9E] to-[#FF6B8B] text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>💌</span>
                <span>Xem & Lưu Bưu Thiếp Kỷ Niệm (PNG Siêu Nét)</span>
                <span>✨</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Bưu Thiếp Kỷ Niệm Chuẩn High-DPI & Text Fitting */}
      <PostcardModal
        isOpen={showPostcardModal}
        onClose={() => setShowPostcardModal(false)}
        status={status}
        theme={theme}
        useCustomImage={useCustomImage}
      />
    </div>
  );
}
