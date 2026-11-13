import React, { useState } from 'react';

export default function ChibiCompanion() {
  const quotes = [
    'Bé ơi, hôm nay bé đã uống đủ nước chưa nè? 💧',
    'Mỗi ngày một chút xíu thôi là giỏi lắm rồi! 🌸',
    'Tớ luôn ở đây cổ vũ bé kiên trì mỗi ngày nè! ✨',
    'Đừng quên mỉm cười thật tươi nhé, trông bé đáng yêu lắm! 💖',
    'Gửi bé một cái ôm ấm áp như bông marshmallow! 🧸',
    'Hít thở thật sâu nào... Một ngày tuyệt vời đang chờ bé đó! 🌤️',
    '7 ngày thôi mà, tớ tin chắc bé sẽ làm được! 👑',
  ];

  const [quoteIdx, setQuoteIdx] = useState(0);
  const [bouncing, setBouncing] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  const handleClickMascot = () => {
    setBouncing(true);
    setQuoteIdx((prev) => (prev + 1) % quotes.length);
    setShowBubble(true);
    setTimeout(() => setBouncing(false), 600);
  };

  return (
    <aside aria-label="Người bạn Chibi đồng hành" className="fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-none select-none">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="pointer-events-auto mb-2 max-w-[220px] bg-white/95 backdrop-blur-md border-2 border-[#FFD1DC] p-3 rounded-2xl rounded-br-none shadow-[0_8px_20px_rgba(255,182,193,0.3)] animate-fadeIn text-xs font-bold text-[#5C4B47] relative">
          <p className="leading-relaxed">{quotes[quoteIdx]}</p>
          <button
            type="button"
            onClick={() => setShowBubble(false)}
            aria-label="Đóng lời nhắn"
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FFE5EC] text-[#8C3A52] flex items-center justify-center text-[10px] font-extrabold hover:bg-[#FFD1DC] cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Mascot Button */}
      <button
        type="button"
        onClick={handleClickMascot}
        className={`pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-tr from-[#FFE5EC] via-[#FFD1DC] to-[#FFF0F5] border-3 border-[#FFB7C5] flex items-center justify-center text-3xl shadow-[0_8px_20px_rgba(255,148,184,0.4)] cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90 ${
          bouncing ? 'animate-wiggle scale-125' : 'animate-bounce-gentle'
        }`}
        title="Bấm vào tớ để nhận lời động viên ngọt ngào nha! 🌸"
      >
        🐰
      </button>
    </aside>
  );
}

