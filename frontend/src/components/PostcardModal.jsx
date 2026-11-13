import React, { useState } from 'react';
import html2canvas from 'html2canvas';

export default function PostcardModal({ isOpen, onClose, status, theme, useCustomImage }) {
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [placedStickers, setPlacedStickers] = useState([]);

  if (!isOpen) return null;

  // Xử lý nguồn ảnh: Nếu là URL ngoài, dùng proxy backend để loại bỏ hoàn toàn lỗi CORS
  const rawImageSrc = useCustomImage
    ? '/static/images/download.jpg'
    : theme?.image_url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80';

  const safeImageSrc = rawImageSrc.startsWith('http')
    ? `/api/proxy-image?url=${encodeURIComponent(rawImageSrc)}`
    : rawImageSrc;

  // Câu danh ngôn và tính toán font size tự động
  const quoteText = theme?.quote || 'Kỷ luật và kiên trì nhỏ bé mỗi ngày sẽ tạo nên kỳ tích phi thường.';
  
  // Font size cho bản Export chuẩn 1200x800
  const getExportQuoteFontSize = (text) => {
    if (text.length > 120) return '19px';
    if (text.length > 80) return '22px';
    if (text.length > 50) return '25px';
    return '28px';
  };

  // Font size cho bản Preview Responsive
  const getPreviewQuoteFontSize = (text) => {
    if (text.length > 120) return 'text-xs sm:text-sm';
    if (text.length > 80) return 'text-xs sm:text-sm';
    return 'text-sm sm:text-base';
  };

  // Danh mục sticker dễ thương
  const availableStickers = ['🎀', '🍓', '⭐', '🌸', '🐾', '💖', '👑', '🌈', '🍒', '🧸', '🍩', '✨'];

  // Thêm sticker vào bưu thiếp
  const handleAddSticker = (emoji) => {
    const newSticker = {
      id: Date.now() + Math.random(),
      emoji,
      // Tỉ lệ % để đồng bộ hoàn hảo giữa Preview và Export
      xPercent: 12 + Math.random() * 76,
      yPercent: 15 + Math.random() * 65,
      rotate: (Math.random() - 0.5) * 30, // xoay nhẹ -15 đến 15 độ
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
  };

  const handleRemoveSticker = (id) => {
    setPlacedStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // Hàm xuất ảnh chuẩn xác 100% không bị lệch, không bị co nhỏ
  const handleSavePostcard = async () => {
    if (exporting) return;

    try {
      setExporting(true);

      // 1. Chờ font Quicksand & Nunito tải xong hoàn toàn
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // 2. Chờ 1 nhịp ngắn để layout ổn định
      await new Promise((resolve) => setTimeout(resolve, 250));

      const targetElement = document.getElementById('postcard-export-node');
      if (!targetElement) {
        throw new Error('Không tìm thấy khung xuất ảnh');
      }

      // 3. Chụp trực tiếp từ khung ẩn 1200x800 (Không có transform scale từ phần tử cha)
      const canvas = await html2canvas(targetElement, {
        scale: 2, // Xuất độ phân giải 2400x1600 (High-DPI Retina)
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#FFF9F6',
        logging: false,
        width: 1200,
        height: 800,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      });

      // 4. Tải file PNG
      const imageURL = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const filename = `Buu-Thiep-7-Ngay-Thang-${theme?.month || 11}-${new Date().toISOString().split('T')[0]}.png`;
      link.download = filename;
      link.href = imageURL;
      link.click();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4500);
    } catch (err) {
      console.error('Lỗi khi lưu bưu thiếp:', err);
      alert('Đã có lỗi nhỏ khi xuất ảnh. Bạn thử bấm lại một lần nữa nhé!');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-white rounded-[2.5rem] border-4 border-[#FFE5EC] shadow-[0_20px_50px_rgba(255,182,193,0.4)] p-4 sm:p-6 flex flex-col items-center">
        
        {/* Header Modal */}
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b-2 border-[#FFF0F3]">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-wiggle">💌</span>
            <div>
              <h3 className="text-base sm:text-xl font-extrabold text-[#5C4B47] tracking-tight">
                Bưu Thiếp Kỷ Niệm 7 Ngày Chăm Chỉ
              </h3>
              <p className="text-xs text-[#8C7A75] font-semibold">
                Xem trước bưu thiếp và dán thêm sticker xinh nha! 🌸
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#8C3A52] font-extrabold text-base flex items-center justify-center transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ============================================================== */}
        {/* 1. KHUNG PREVIEW TRỰC TIẾP (RESPONSIVE 100%, KHÔNG DÙNG TRANSFORM) */}
        {/* ============================================================== */}
        <div className="w-full my-2">
          <div className="relative w-full rounded-3xl bg-[#FFF9F6] border-4 border-[#FFB7C5] p-3 sm:p-4 shadow-sm flex flex-col justify-between overflow-hidden select-none">
            
            {/* Header bưu thiếp preview */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-dashed border-[#FFCCD5]">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFE5EC] text-[#8C3A52] border border-[#FFCAD4] inline-flex items-center gap-1">
                  <span>🌸</span>
                  <span>{theme?.month_name || 'Tháng 11'}</span>
                </span>
                <h4 className="text-base sm:text-xl font-black text-[#5C4B47] tracking-tight mt-1 leading-snug">
                  {theme?.title || 'Kiệt Tác Tháng'}
                </h4>
              </div>

              {/* Tem bưu chính Kawaii Stamp */}
              <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl bg-[#FFF3B0] border-2 border-dashed border-[#FFD166] shadow-sm transform rotate-1">
                <span className="text-sm">🏆</span>
                <span className="text-[10px] font-black text-[#705800] uppercase tracking-wider">
                  7-DAY STREAK
                </span>
              </div>
            </div>

            {/* Ảnh trung tâm Preview */}
            <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#FFE5EC] shadow-sm bg-[#FFF5F7] mb-2.5">
              <img
                src={safeImageSrc}
                alt={theme?.title || 'Kiệt tác'}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-[#FFD1DC] flex items-center gap-1.5 shadow-sm text-xs font-extrabold text-[#FF6B8B]">
                <span>✨</span>
                <span>Mở trọn vẹn 7/7 mảnh ghép bí ẩn</span>
              </div>
            </div>

            {/* Câu quote truyền cảm hứng */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFF8F0] border-2 border-[#FFE494] shadow-sm mb-2">
              <p className={`font-bold text-[#5C4B47] italic text-center break-words ${getPreviewQuoteFontSize(quoteText)}`}>
                "{quoteText}"
              </p>
            </div>

            {/* Footer nhỏ */}
            <div className="flex items-center justify-between text-[11px] font-bold text-[#8C7A75] pt-1 border-t border-[#FFE5EC]">
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>Hoàn thành: {status?.today || new Date().toISOString().split('T')[0]}</span>
              </div>
              <div className="flex items-center gap-1 text-[#FF6B8B]">
                <span>🌸 Bé Chăm Chỉ 💖</span>
              </div>
            </div>

            {/* Hiển thị các sticker đã dán trên bản Preview */}
            {placedStickers.map((stk) => (
              <div
                key={stk.id}
                onClick={() => handleRemoveSticker(stk.id)}
                style={{
                  position: 'absolute',
                  left: `${stk.xPercent}%`,
                  top: `${stk.yPercent}%`,
                  transform: `translate(-50%, -50%) rotate(${stk.rotate}deg)`,
                  fontSize: '26px',
                  cursor: 'pointer',
                  zIndex: 20,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                }}
                title="Bấm vào để gỡ sticker này"
              >
                {stk.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Khay Sticker Trang Trí Kawaii */}
        <div className="w-full mt-1 p-3 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE5EC]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-extrabold text-[#5C4B47] flex items-center gap-1">
              <span>🎀</span>
              <span>Bấm sticker để dán lên bưu thiếp:</span>
            </span>
            {placedStickers.length > 0 && (
              <button
                type="button"
                onClick={() => setPlacedStickers([])}
                className="text-[11px] font-bold text-[#E76F51] hover:underline cursor-pointer"
              >
                Gỡ hết sticker
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {availableStickers.map((em, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddSticker(em)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border-2 border-[#FFD1DC] hover:bg-[#FFE5EC] flex items-center justify-center text-base sm:text-lg shadow-sm transition-all active:scale-90 cursor-pointer"
                title={`Dán ${em} lên bưu thiếp`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* Thông báo xuất thành công */}
        {exportSuccess && (
          <div className="mt-2.5 px-4 py-2 rounded-2xl bg-[#D8F3DC] border-2 border-[#95D5B2] text-xs font-bold text-[#2D6A4F] flex items-center gap-2 animate-bounce-gentle">
            <span>🎉</span>
            <span>Bưu thiếp đã được lưu về máy thành công với độ phân giải siêu nét (2400x1600)!</span>
          </div>
        )}

        {/* Nút bấm hành động */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-3 pt-2.5 border-t-2 border-[#FFF0F3]">
          <button
            type="button"
            onClick={handleSavePostcard}
            disabled={exporting}
            className="btn-squishy w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF94B8] via-[#FF8E9E] to-[#FF6B8B] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,148,184,0.4)] cursor-pointer"
          >
            {exporting ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý ảnh siêu nét...</span>
              </>
            ) : (
              <>
                <span className="text-lg">📥</span>
                <span>Tải Bưu Thiếp Về Máy (PNG 2400x1600)</span>
                <span className="text-lg">✨</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#8C3A52] font-extrabold text-sm transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. KHUNG RENDER NGẦM CỐ ĐỊNH 1200x800 DÀNH RIÊNG ĐỂ HTML2CANVAS CHỤP */}
      {/* (Nằm ngoài màn hình, KHÔNG CÓ BẤT KỲ TRANSFORM NÀO, ĐỘ NÉT TUYỆT ĐỐI) */}
      {/* ============================================================== */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '1200px',
          height: '800px',
          overflow: 'hidden',
          zIndex: -100,
          pointerEvents: 'none',
        }}
      >
        <div
          id="postcard-export-node"
          style={{
            width: '1200px',
            height: '800px',
            boxSizing: 'border-box',
            fontFamily: '"Quicksand", "Nunito", sans-serif',
            backgroundColor: '#FFF9F6',
            position: 'relative',
            overflow: 'hidden',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Viền đôi Pastel & Nền trắng */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '32px',
              backgroundColor: '#FFFFFF',
              border: '6px solid #FFB7C5',
              padding: '24px 28px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header bưu thiếp: Tên tháng & Tem 7-Day */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '2px dashed #FFCCD5',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    backgroundColor: '#FFE5EC',
                    color: '#8C3A52',
                    border: '1px solid #FFCAD4',
                    fontSize: '15px',
                    fontWeight: 700,
                  }}
                >
                  🌸 {theme?.month_name || 'Tháng 11'}
                </div>
                <div
                  style={{
                    fontSize: '34px',
                    fontWeight: 900,
                    color: '#5C4B47',
                    marginTop: '6px',
                    lineHeight: '40px',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {theme?.title || 'Kiệt Tác Tháng'}
                </div>
              </div>

              {/* Tem bưu chính 7-Day */}
              <div
                style={{
                  width: '150px',
                  height: '74px',
                  borderRadius: '16px',
                  backgroundColor: '#FFF3B0',
                  border: '2px dashed #FFD166',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(1.5deg)',
                }}
              >
                <div style={{ fontSize: '18px' }}>🏆</div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#705800',
                    letterSpacing: '1px',
                  }}
                >
                  7-DAY STREAK
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#8C7A75' }}>
                  CHINH PHỤC 100%
                </div>
              </div>
            </div>

            {/* Khung ảnh trung tâm */}
            <div
              style={{
                width: '100%',
                height: '410px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '4px solid #FFE5EC',
                position: 'relative',
                boxSizing: 'border-box',
                backgroundColor: '#FFF5F7',
              }}
            >
              <img
                src={safeImageSrc}
                alt={theme?.title || 'Kiệt tác'}
                crossOrigin="anonymous"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  padding: '8px 18px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #FFD1DC',
                  fontSize: '15px',
                  fontWeight: 900,
                  color: '#FF6B8B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>✨</span>
                <span>Mở trọn vẹn 7/7 mảnh ghép bí ẩn</span>
              </div>
            </div>

            {/* Khung danh ngôn truyền cảm hứng */}
            <div
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '18px',
                backgroundColor: '#FFF8F0',
                border: '2px solid #FFE494',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  color: '#5C4B47',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  textAlign: 'center',
                  fontSize: getExportQuoteFontSize(quoteText),
                  lineHeight: '32px',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  width: '100%',
                }}
              >
                "{quoteText}"
              </div>
            </div>

            {/* Footer nhỏ */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #FFE5EC',
                fontSize: '13px',
                fontWeight: 700,
                color: '#8C7A75',
              }}
            >
              <div>
                📅 Hoàn thành: {status?.today || new Date().toISOString().split('T')[0]} | 🏆 Chu kỳ: #{status?.total_cycles_completed || 1}
              </div>
              <div style={{ color: '#FF6B8B', fontWeight: 900 }}>
                🌸 Bé Chăm Chỉ • Daily Habit Tracker 💖
              </div>
            </div>

            {/* Render các sticker đã dán lên bản xuất */}
            {placedStickers.map((stk) => (
              <div
                key={stk.id}
                style={{
                  position: 'absolute',
                  left: `${stk.xPercent}%`,
                  top: `${stk.yPercent}%`,
                  transform: `translate(-50%, -50%) rotate(${stk.rotate}deg)`,
                  fontSize: '54px',
                  zIndex: 25,
                  filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.15))',
                }}
              >
                {stk.emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
