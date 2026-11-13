import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Component biểu diễn từng bộ phận (Sub-Mesh) của mô hình 3D
function SubMeshPart({ part, currentStreak, onSelectPart, children }) {
  const isRevealed = part.day <= currentStreak;
  const isNext = part.day === currentStreak + 1;

  const baseColor = new THREE.Color(part.color);
  const grayColor = new THREE.Color('#94A3B8');

  return (
    <group onClick={(e) => { e.stopPropagation(); if (onSelectPart) onSelectPart(part); }}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        return React.cloneElement(child, {
          children: (
            <meshStandardMaterial
              color={isRevealed ? baseColor : grayColor}
              roughness={isRevealed ? 0.3 : 0.8}
              metalness={isRevealed ? 0.25 : 0.05}
              wireframe={!isRevealed && !isNext}
              transparent={!isRevealed}
              opacity={isRevealed ? 1.0 : isNext ? 0.5 : 0.2}
              emissive={isRevealed ? baseColor : isNext ? new THREE.Color('#FDE047') : new THREE.Color('#000000')}
              emissiveIntensity={isRevealed ? 0.18 : isNext ? 0.55 : 0}
            />
          ),
        });
      })}
    </group>
  );
}

// Đồng xu vàng 3D rơi xuống khi điểm danh
function AnimatedGoldenCoin({ active }) {
  const coinRef = useRef();

  useFrame((state, delta) => {
    if (!coinRef.current || !active) return;
    coinRef.current.rotation.y += delta * 6;
    if (coinRef.current.position.y > 0.3) {
      coinRef.current.position.y -= delta * 3.5;
    }
  });

  if (!active) return null;

  return (
    <mesh ref={coinRef} position={[0, 2.5, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
      <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} emissive="#F59E0B" emissiveIntensity={0.3} />
    </mesh>
  );
}

// 1. Mô hình 3D Cây Mai Vàng Ngày Tết (Tháng 1)
function TetApricotTreeModel({ currentStreak, subParts, onSelectPart }) {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Ngày 1: Chậu sứ & Gốc rễ */}
      <SubMeshPart part={subParts[0]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.9, 0.7, 0.6, 32]} /></mesh>
      </SubMeshPart>

      {/* Ngày 2: Thân cây mai */}
      <SubMeshPart part={subParts[1]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.18, 0.3, 1.2, 16]} /></mesh>
      </SubMeshPart>

      {/* Ngày 3: Các nhánh cành chính */}
      <SubMeshPart part={subParts[2]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[-0.35, 1.1, 0.1]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.08, 0.12, 0.8, 12]} /></mesh>
        <mesh position={[0.35, 1.1, -0.1]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.08, 0.12, 0.8, 12]} /></mesh>
      </SubMeshPart>

      {/* Ngày 4: Tán lá biếc xanh non */}
      <SubMeshPart part={subParts[3]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 1.5, 0]}><dodecahedronGeometry args={[0.7, 1]} /></mesh>
      </SubMeshPart>

      {/* Ngày 5: Các chùm nụ mai vàng */}
      <SubMeshPart part={subParts[4]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[-0.5, 1.6, 0.4]}><sphereGeometry args={[0.15, 16, 16]} /></mesh>
        <mesh position={[0.5, 1.7, -0.3]}><sphereGeometry args={[0.15, 16, 16]} /></mesh>
      </SubMeshPart>

      {/* Ngày 6: Những đóa hoa mai vàng bung nở */}
      <SubMeshPart part={subParts[5]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[-0.4, 1.9, 0]}><torusGeometry args={[0.2, 0.08, 8, 24]} /></mesh>
        <mesh position={[0.4, 1.9, 0.2]}><torusGeometry args={[0.2, 0.08, 8, 24]} /></mesh>
        <mesh position={[0, 2.1, -0.3]}><torusGeometry args={[0.2, 0.08, 8, 24]} /></mesh>
      </SubMeshPart>

      {/* Ngày 7: Bao lì xì may mắn & Ngôi sao vàng đỉnh tháp */}
      <SubMeshPart part={subParts[6]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 2.4, 0]}><octahedronGeometry args={[0.3, 0]} /></mesh>
        <mesh position={[-0.3, 1.3, 0.4]} rotation={[0, 0.3, 0.1]}><boxGeometry args={[0.15, 0.25, 0.04]} /></mesh>
        <mesh position={[0.35, 1.3, -0.3]} rotation={[0, -0.3, -0.1]}><boxGeometry args={[0.15, 0.25, 0.04]} /></mesh>
      </SubMeshPart>
    </group>
  );
}

// 2. Mô hình 3D Trái Tim Hoa Hồng (Tháng 2)
function ValentineHeartModel({ currentStreak, subParts, onSelectPart }) {
  return (
    <group position={[0, -0.3, 0]}>
      <SubMeshPart part={subParts[0]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, -0.7, 0]}><cylinderGeometry args={[0.9, 1.1, 0.3, 32]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[1]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[-0.4, 0.3, 0]}><sphereGeometry args={[0.6, 32, 32]} /></mesh>
        <mesh position={[0.4, 0.3, 0]}><sphereGeometry args={[0.6, 32, 32]} /></mesh>
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.85, 1.2, 32]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[2]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[-0.3, 0.4, 0.4]}><torusGeometry args={[0.3, 0.1, 16, 32]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[3]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0.3, 0.4, 0.4]}><torusGeometry args={[0.3, 0.1, 16, 32]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[4]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 0.1, 0.55]} rotation={[0, 0, 0.4]}><boxGeometry args={[1.2, 0.12, 0.08]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[5]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[-1.1, 0.5, -0.2]} rotation={[0, 0.4, 0.5]}><boxGeometry args={[0.8, 0.3, 0.06]} /></mesh>
        <mesh position={[1.1, 0.5, -0.2]} rotation={[0, -0.4, -0.5]}><boxGeometry args={[0.8, 0.3, 0.06]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[6]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 1.2, 0]}><cylinderGeometry args={[0.4, 0.3, 0.3, 5]} /></mesh>
      </SubMeshPart>
    </group>
  );
}

// 3. Mô hình 3D Quả Bí Ngô Halloween (Tháng 10)
function HalloweenPumpkinModel({ currentStreak, subParts, onSelectPart }) {
  return (
    <group position={[0, -0.3, 0]}>
      <SubMeshPart part={subParts[0]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, -0.8, 0]}><cylinderGeometry args={[1.1, 1.3, 0.3, 32]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[1]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 0, 0]}><sphereGeometry args={[0.9, 32, 32]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[2]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 0, 0]} rotation={[0, 0.8, 0]}><torusGeometry args={[0.9, 0.12, 16, 32]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[3]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 0.95, 0]} rotation={[0.2, 0, 0.2]}><cylinderGeometry args={[0.08, 0.14, 0.5, 16]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[4]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[-0.3, 0.2, 0.85]}><coneGeometry args={[0.15, 0.2, 3]} /></mesh>
        <mesh position={[0.3, 0.2, 0.85]}><coneGeometry args={[0.15, 0.2, 3]} /></mesh>
        <mesh position={[0, -0.2, 0.85]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.35, 0.3, 3]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[5]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 1.0, 0]}><cylinderGeometry args={[0.8, 0.8, 0.08, 32]} /></mesh>
        <mesh position={[0, 1.6, 0]}><coneGeometry args={[0.5, 1.2, 32]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[6]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 2.2, 0]}><octahedronGeometry args={[0.25, 0]} /></mesh>
      </SubMeshPart>
    </group>
  );
}

// 4. Mô hình 3D Cây Thông Noel (Tháng 12)
function ChristmasTreeModel({ currentStreak, subParts, onSelectPart }) {
  return (
    <group position={[0, -0.7, 0]}>
      <SubMeshPart part={subParts[0]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.4, 0.35, 0.5, 16]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[1]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 0.7, 0]}><coneGeometry args={[1.1, 0.9, 16]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[2]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 1.3, 0]}><coneGeometry args={[0.85, 0.8, 16]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[3]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 1.85, 0]}><coneGeometry args={[0.6, 0.7, 16]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[4]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 1.2, 0]} rotation={[0.4, 0, 0]}><torusGeometry args={[0.8, 0.04, 8, 32]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[5]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0.5, 0.8, 0.5]}><sphereGeometry args={[0.12, 16, 16]} /></mesh>
        <mesh position={[-0.4, 1.2, 0.4]}><sphereGeometry args={[0.1, 16, 16]} /></mesh>
        <mesh position={[-0.6, 0.15, 0.4]}><boxGeometry args={[0.3, 0.3, 0.3]} /></mesh>
      </SubMeshPart>
      <SubMeshPart part={subParts[6]} currentStreak={currentStreak} onSelectPart={onSelectPart}>
        <mesh position={[0, 2.35, 0]}><octahedronGeometry args={[0.25, 0]} /></mesh>
      </SubMeshPart>
    </group>
  );
}

// Dispatcher chuyển đổi mô hình 3D theo tháng
function Dynamic3DModel({ modelData, currentStreak, onSelectPart }) {
  const month = modelData?.month || 11;
  const subParts = modelData?.sub_parts || [];

  if (month === 1) return <TetApricotTreeModel currentStreak={currentStreak} subParts={subParts} onSelectPart={onSelectPart} />;
  if (month === 2) return <ValentineHeartModel currentStreak={currentStreak} subParts={subParts} onSelectPart={onSelectPart} />;
  if (month === 10) return <HalloweenPumpkinModel currentStreak={currentStreak} subParts={subParts} onSelectPart={onSelectPart} />;
  if (month === 12) return <ChristmasTreeModel currentStreak={currentStreak} subParts={subParts} onSelectPart={onSelectPart} />;
  return <TetApricotTreeModel currentStreak={currentStreak} subParts={subParts} onSelectPart={onSelectPart} />;
}

// Scene tổng thể
function Scene({ modelData, currentStreak, autoRotate, envPreset, onSelectPart, coinActive }) {
  // Ánh sáng theo preset
  const isNight = envPreset === 'galaxy';
  const isSunset = envPreset === 'sunset';

  return (
    <>
      <ambientLight intensity={isNight ? 0.4 : isSunset ? 0.9 : 0.8} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={isNight ? 0.8 : isSunset ? 1.4 : 1.2}
        color={isSunset ? '#FDBA74' : isNight ? '#C4B5FD' : '#FFFFFF'}
        castShadow
      />
      <directionalLight position={[-5, 4, -5]} intensity={0.5} color={isNight ? '#38BDF8' : '#FFE5EC'} />

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <Dynamic3DModel modelData={modelData} currentStreak={currentStreak} onSelectPart={onSelectPart} />
      </Float>

      {/* Rơi đồng xu vàng 3D */}
      <AnimatedGoldenCoin active={coinActive} />

      {/* Hiệu ứng hạt phát sáng khi hoàn thành đủ 7 ngày */}
      {currentStreak >= 7 && (
        <Sparkles count={80} scale={4.5} size={6} speed={0.4} color="#FBBF24" />
      )}

      {/* Đổ bóng mềm mại */}
      <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={5} blur={2.4} far={4} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate={autoRotate}
        autoRotateSpeed={2.0}
        minDistance={2.5}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2 + 0.1}
      />
    </>
  );
}

export default function Savings3DViewer({ status, coinActive }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [envPreset, setEnvPreset] = useState('spring'); // 'spring', 'galaxy', 'sunset'
  const [inspectedPart, setInspectedPart] = useState(null);

  const currentStreak = status?.current_streak || 0;
  const modelData = status?.model_3d;
  const renderProgress = status?.render_progress || 0;
  const percent = Math.round(renderProgress * 100);

  // Background gradient theo Environment Preset
  const envStyles = {
    spring: 'bg-gradient-to-b from-[#FFF5F7] via-[#FFF9F6] to-[#F0FDF4]',
    galaxy: 'bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#311042]',
    sunset: 'bg-gradient-to-b from-[#FFF7ED] via-[#FED7AA] to-[#FBCFE8]',
  };

  return (
    <div className="kawaii-card p-4 sm:p-5 mb-6 relative overflow-hidden">
      {/* Header thanh điều khiển 3D */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#FFE5EC] text-[#8C3A52] border border-[#FFCAD4] inline-flex items-center gap-1 shadow-sm">
              <span>🎮</span>
              <span>Gamification 3D • Tuần #{status?.week_in_month || 1}</span>
            </span>
            <span className="text-xs font-extrabold text-[#705800] bg-[#FFF3B0] px-2.5 py-0.5 rounded-full border border-[#FFD166]">
              {percent}% Full Color
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#5C4B47] tracking-tight mt-1">
            {modelData?.name || 'Mô hình 3D Sự Kiện Tháng'}
          </h3>
          <p className="text-xs sm:text-sm text-[#8C7A75] font-semibold">
            {modelData?.description}
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
              title="Khu Vườn Mùa Xuân"
            >
              🌸
            </button>
            <button
              type="button"
              onClick={() => setEnvPreset('galaxy')}
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                envPreset === 'galaxy' ? 'bg-[#312E81] text-white shadow-xs' : 'text-[#8C7A75]'
              }`}
              title="Đêm Ngân Hà"
            >
              🌌
            </button>
            <button
              type="button"
              onClick={() => setEnvPreset('sunset')}
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                envPreset === 'sunset' ? 'bg-[#FB923C] text-white shadow-xs' : 'text-[#8C7A75]'
              }`}
              title="Phòng Trà Hoàng Hôn"
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

      {/* Khung Canvas Three.js */}
      <div className={`relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden ${envStyles[envPreset]} border-3 border-[#FFE5EC] shadow-inner select-none cursor-grab active:cursor-grabbing`}>
        <Canvas camera={{ position: [0, 1.8, 5.2], fov: 45 }}>
          <Scene
            modelData={modelData}
            currentStreak={currentStreak}
            autoRotate={autoRotate}
            envPreset={envPreset}
            onSelectPart={(part) => setInspectedPart(part)}
            coinActive={coinActive}
          />
        </Canvas>

        {/* Hướng dẫn tương tác */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#FFD1DC] text-[11px] font-bold text-[#5C4B47] flex items-center gap-1.5 shadow-sm pointer-events-none">
          <span>🖐️</span>
          <span>Bấm vào bộ phận 3D để xem chi tiết • Kéo xoay 360°</span>
        </div>

        {/* Floating Inspector Card khi bấm vào 1 bộ phận */}
        {inspectedPart && (
          <div className="absolute top-3 left-3 max-w-[260px] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-[#FFD1DC] shadow-lg animate-fadeIn text-xs z-30">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#FFE5EC]">
              <span className="font-black text-[#FF6B8B] flex items-center gap-1">
                <span>📦</span>
                <span>Ngày #{inspectedPart.day}</span>
              </span>
              <button
                type="button"
                onClick={() => setInspectedPart(null)}
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
                {inspectedPart.day <= currentStreak ? '✓ Đã mở khóa màu sắc' : '🔒 Chưa mở khóa'}
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
            const isSelected = inspectedPart?.day === part.day;

            return (
              <div
                key={part.day}
                onClick={() => setInspectedPart(part)}
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
                  {isUnlocked ? '✓ Đã tô màu' : isNext ? '✨ Mở hôm nay' : 'Khóa'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
