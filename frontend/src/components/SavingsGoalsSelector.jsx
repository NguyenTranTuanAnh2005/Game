import React, { useState } from 'react';

export default function SavingsGoalsSelector({ onSelectGoal }) {
  const [goals, setGoals] = useState([
    { id: 'travel', name: 'Du Lịch Mùa Hè', emoji: '🏝️', target: 3000000, color: 'from-[#FFD1DC] to-[#FFE5EC]' },
    { id: 'laptop', name: 'Đổi Laptop / Đồ Công Nghệ', emoji: '💻', target: 10000000, color: 'from-[#D0E8FF] to-[#EAF4FF]' },
    { id: 'gift', name: 'Món Quà Cho Người Thân', emoji: '🎁', target: 1000000, color: 'from-[#FFF3B0] to-[#FFF9E6]' },
    { id: 'emergency', name: 'Quỹ An Tâm Khẩn Cấp', emoji: '🛡️', target: 5000000, color: 'from-[#D8F3DC] to-[#E8F8F5]' },
  ]);

  const [activeGoalId, setActiveGoalId] = useState('travel');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState(2000000);
  const [newEmoji, setNewEmoji] = useState('🎯');

  const activeGoal = goals.find((g) => g.id === activeGoalId) || goals[0];

  const handleSelect = (goal) => {
    setActiveGoalId(goal.id);
    if (onSelectGoal) onSelectGoal(goal);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newG = {
      id: 'custom_' + Date.now(),
      name: newName,
      emoji: newEmoji,
      target: Number(newTarget),
      color: 'from-[#E8D7F1] to-[#FFF0F5]',
    };
    setGoals((prev) => [...prev, newG]);
    setActiveGoalId(newG.id);
    setShowAddModal(false);
    setNewName('');
  };

  return (
    <div className="kawaii-card p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <div>
            <h4 className="text-sm sm:text-base font-black text-[#5C4B47] tracking-tight">
              Hũ Tiết Kiệm Theo Mục Tiêu
            </h4>
            <p className="text-[11px] text-[#8C7A75] font-semibold">
              Đang nuôi heo đất cho mục tiêu:{' '}
              <strong className="text-[#FF6B8B] font-extrabold">{activeGoal.emoji} {activeGoal.name}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white border border-[#FFCAD4] hover:bg-[#FFE5EC] text-xs font-black text-[#8C3A52] flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <span>➕</span>
          <span>Thêm mục tiêu mới</span>
        </button>
      </div>

      {/* Goal Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {goals.map((g) => {
          const isActive = g.id === activeGoalId;

          return (
            <button
              key={g.id}
              type="button"
              onClick={() => handleSelect(g)}
              className={`p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 text-left cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-white border-[#FF8E9E] shadow-[0_6px_16px_rgba(255,148,184,0.3)] ring-2 ring-[#FFD1DC]'
                  : 'bg-white/60 border-[#FFE5EC] hover:bg-white text-slate-600'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFF0F3] border border-[#FFCAD4] flex items-center justify-center text-lg shrink-0">
                {g.emoji}
              </div>
              <div className="overflow-hidden">
                <div className={`text-xs font-black truncate ${isActive ? 'text-[#FF6B8B]' : 'text-[#5C4B47]'}`}>
                  {g.name}
                </div>
                <div className="text-[10px] font-bold text-[#8C7A75]">
                  {(g.target / 1000000).toLocaleString('vi-VN')} Tr đ
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal Thêm Mục Tiêu Mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] border-4 border-[#FFE5EC] shadow-[0_20px_50px_rgba(255,182,193,0.4)] p-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF0F3] hover:bg-[#FFE5EC] text-[#8C3A52] font-black flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-base font-black text-[#5C4B47] mb-3 flex items-center gap-1.5">
              <span>✨</span>
              <span>Tạo Hũ Tiết Kiệm Mới</span>
            </h3>

            <form onSubmit={handleAddGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C4B47] mb-1">
                  Chọn biểu tượng (Emoji):
                </label>
                <div className="flex gap-2">
                  {['🎯', '✈️', '🎸', '🏠', '🐱', '🚴'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewEmoji(em)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg ${
                        newEmoji === em ? 'border-[#FF8E9E] bg-[#FFE5EC]' : 'border-slate-200'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4B47] mb-1">
                  Tên mục tiêu:
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Mua xe đạp mới, Học đàn..."
                  className="w-full bg-slate-50 border border-[#FFCCD5] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD1DC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4B47] mb-1">
                  Số tiền mục tiêu (VNĐ):
                </label>
                <input
                  type="number"
                  required
                  step="100000"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-[#FFCCD5] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD1DC]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="btn-squishy flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#FF94B8] to-[#FF6B8B] text-white font-black text-xs shadow-md cursor-pointer"
                >
                  Tạo Hũ Mới 🌸
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

