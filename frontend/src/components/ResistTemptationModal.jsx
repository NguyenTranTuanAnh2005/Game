import React, { useState } from 'react';
import { resistTemptation } from '../api';
import { playCheckInSound } from '../utils/audio';

export default function ResistTemptationModal({ isOpen, onClose, status, onSuccess }) {
  const [selectedItem, setSelectedItem] = useState('Ly trà sữa trân châu');
  const [amount, setAmount] = useState(35000);
  const [customItem, setCustomItem] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const popularTemptations = [
    { name: 'Ly trà sữa trân châu', amount: 35000, icon: '🥤', note: 'Bớt ngọt, dáng thon, heo đất béo tròn' },
    { name: 'Trà đào cam sả', amount: 30000, icon: '🍑', note: 'Tự pha nước detox tại nhà' },
    { name: 'Bánh tráng / Ăn vặt chiều', amount: 25000, icon: '🍿', note: 'Ăn lành mạnh, tiết kiệm túi tiền' },
    { name: 'Mua Shopee bốc đồng', amount: 100000, icon: '🛍️', note: 'Thưởng ngay 1 Khiên chuỗi 🛡️!' },
    { name: 'Cà phê ngoài tiệm', amount: 35000, icon: '☕', note: 'Tự pha cà phê thơm tại nhà' },
    { name: 'Đồ ăn đêm GrabFood', amount: 60000, icon: '🍔', note: 'Đi ngủ sớm, da đẹp dáng xinh' },
  ];

  const handleSelectPreset = (item) => {
    setIsCustom(false);
    setSelectedItem(item.name);
    setAmount(item.amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalItem = isCustom ? (customItem.trim() || 'Món đồ chi tiêu linh tinh') : selectedItem;
    const finalAmount = isCustom ? (parseFloat(customAmount) || 30000) : amount;

    try {
      setLoading(true);
      const res = await resistTemptation(finalItem, finalAmount);
      playCheckInSound();
      setSuccessMsg(res.message);
      if (onSuccess) onSuccess(res.status);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2500);
    } catch (err) {
      alert(err.message || 'Lỗi khi ghi nhận kiềm chế cám dỗ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] border-4 border-[#FFE5EC] shadow-[0_20px_50px_rgba(255,182,193,0.4)] p-5 sm:p-6 flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#FFF0F3]">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-wiggle">🍭</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#5C4B47] tracking-tight">
                Kiềm Chế Cám Dỗ • Nuôi Heo Đất
              </h3>
              <p className="text-xs text-[#8C7A75] font-semibold">
                Nhịn chi tiêu thừa thãi, nạp năng lượng Aura phát sáng 3D! 🌟
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#8C3A52] font-black flex items-center justify-center transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Thông báo thành công */}
        {successMsg ? (
          <div className="my-6 p-4 rounded-3xl bg-[#D8F3DC] border-2 border-[#95D5B2] text-center animate-bounce-gentle">
            <span className="text-4xl block mb-2">🎉</span>
            <p className="text-sm font-black text-[#1B4332]">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Banner năng lượng & Khiên */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FFF5F7] via-[#FFF9F6] to-[#F0FDF4] border-2 border-[#FFD1DC] flex items-center justify-between text-xs font-bold text-[#5C4B47]">
              <div className="flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Khiên bảo vệ: <strong>{status?.streak_freeze_count ?? 1}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#B45309]">
                <span>🌟</span>
                <span>Aura hiện tại: <strong>+{status?.glow_energy || 0}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#2D6A4F]">
                <span>💰</span>
                <span>Đã nhịn: <strong>{(status?.temptation_saved || 0).toLocaleString('vi-VN')} đ</strong></span>
              </div>
            </div>

            {/* Danh sách các cám dỗ thường gặp */}
            <div>
              <label className="block text-xs font-extrabold text-[#5C4B47] mb-2">
                🧁 Chọn món bạn vừa xuất sắc cưỡng lại cám dỗ:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {popularTemptations.map((item, idx) => {
                  const isChosen = !isCustom && selectedItem === item.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(item)}
                      className={`p-2.5 rounded-2xl border-2 text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between ${
                        isChosen
                          ? 'bg-[#FFE5EC] border-[#FF8E9E] shadow-sm ring-2 ring-[#FFD1DC]'
                          : 'bg-[#FFFDF9] border-[#FFE5EC] hover:bg-[#FFF5F7]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs font-black text-[#FF6B8B]">
                          +{item.amount.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-[#5C4B47] leading-snug">
                        {item.name}
                      </div>
                      <span className="text-[10px] text-[#8C7A75] font-semibold truncate mt-0.5">
                        {item.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hoặc tự nhập món khác */}
            <div className="pt-2 border-t border-[#FFE5EC]">
              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className="text-xs font-bold text-[#FF6B8B] hover:underline flex items-center gap-1 cursor-pointer mb-2"
              >
                <span>{isCustom ? '▼ Chọn từ danh sách có sẵn' : '✏️ Hoặc tự nhập món cám dỗ khác'}</span>
              </button>

              {isCustom && (
                <div className="space-y-2.5 p-3 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFD1DC] animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5C4B47] mb-1">
                      Tên món bạn vừa nhịn:
                    </label>
                    <input
                      type="text"
                      value={customItem}
                      onChange={(e) => setCustomItem(e.target.value)}
                      placeholder="Ví dụ: Cốc sinh tố bơ, trà sữa nướng..."
                      className="w-full bg-white border border-[#FFCCD5] rounded-xl px-3 py-2 text-xs text-[#5C4B47] focus:outline-none focus:border-[#FF8E9E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#5C4B47] mb-1">
                      Số tiền món đó (VNĐ):
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="35000"
                      className="w-full bg-white border border-[#FFCCD5] rounded-xl px-3 py-2 text-xs text-[#5C4B47] focus:outline-none focus:border-[#FF8E9E]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Nút hành động Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-squishy w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#FF94B8] via-[#FF8E9E] to-[#FF6B8B] text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,148,184,0.38)] cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang nạp năng lượng...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">💖</span>
                    <span>
                      Bé Kiềm Chế Thành Công! (+{(isCustom ? (parseFloat(customAmount) || 0) : amount).toLocaleString('vi-VN')} đ)
                    </span>
                    <span className="text-base">🌟</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

