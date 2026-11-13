import React from 'react';

// Hiệu ứng mây bồng bềnh và bong bóng xà phòng pastel trôi nhẹ nhàng trong nền
export default function FloatingBalloons() {
  const bubbles = [
    { id: 1, size: 'w-24 h-24', top: '10%', left: '5%', color: 'bg-[#FFD1DC]/30', delay: '0s', dur: '8s' },
    { id: 2, size: 'w-32 h-32', top: '25%', right: '6%', color: 'bg-[#D0E8FF]/25', delay: '2s', dur: '10s' },
    { id: 3, size: 'w-20 h-20', top: '65%', left: '8%', color: 'bg-[#D8F3DC]/30', delay: '4s', dur: '9s' },
    { id: 4, size: 'w-28 h-28', top: '80%', right: '10%', color: 'bg-[#FFF3B0]/30', delay: '1s', dur: '11s' },
    { id: 5, size: 'w-16 h-16', top: '45%', right: '3%', color: 'bg-[#E8D7F1]/30', delay: '3s', dur: '7s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className={`absolute rounded-full blur-xl animate-float ${b.size} ${b.color}`}
          style={{
            top: b.top,
            left: b.left,
            right: b.right,
            animationDelay: b.delay,
            animationDuration: b.dur,
          }}
        />
      ))}
      
      {/* Little decorative pastel sparkles */}
      <span className="absolute top-16 left-12 text-sm text-[#FFB7C5]/60 animate-sparkle-pulse select-none">✨</span>
      <span className="absolute top-40 right-20 text-base text-[#FFE494]/70 animate-sparkle-pulse select-none" style={{ animationDelay: '1s' }}>⭐</span>
      <span className="absolute bottom-32 left-16 text-xs text-[#95D5B2]/60 animate-sparkle-pulse select-none" style={{ animationDelay: '2s' }}>🌸</span>
      <span className="absolute bottom-48 right-14 text-sm text-[#FF8E9E]/60 animate-sparkle-pulse select-none" style={{ animationDelay: '1.5s' }}>💖</span>
    </div>
  );
}

