import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Component biểu diễn từng bộ phận (Sub-Mesh) của mô hình 3D theo ngày
function SubMeshPart({ part, index, currentStreak, children }) {
  const isRevealed = part.day <= currentStreak;
  const isNext = part.day === currentStreak + 1;

  // Màu sắc theo trạng thái
  const baseColor = new THREE.Color(part.color);
  const grayColor = new THREE.Color('#94A3B8');

  return (
    <group>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // Clone element và gán material tương ứng với ngày điểm danh
        return React.cloneElement(child, {
          children: (
            <meshStandardMaterial
              color={isRevealed ? baseColor : grayColor}
              roughness={isRevealed ? 0.35 : 0.8}
              metalness={isRevealed ? 0.2 : 0.05}
              wireframe={!isRevealed && !isNext}
              transparent={!isRevealed}
              opacity={isRevealed ? 1.0 : isNext ? 0.45 : 0.2}
              emissive={isRevealed ? baseColor : isNext ? new THREE.Color('#FDE047') : new THREE.Color('#000000')}
              emissiveIntensity={isRevealed ? 0.15 : isNext ? 0.5 : 0}
            />
          ),
        });
      })}
    </group>
  );
}

// 1. Mô hình 3D Cây Mai Vàng Ngày Tết (Tháng 1)
function TetApricotTreeModel({ currentStreak, subParts }) {
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Ngày 1: Chậu sứ & Gốc rễ */}
      <SubMeshPart part={subParts[0]} currentStreak={currentStreak}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.9, 0.7, 0.6, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 2: Thân cây mai */}
      <SubMeshPart part={subParts[1]} currentStreak={currentStreak}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.18, 0.3, 1.2, 16]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 3: Các nhánh cành chính */}
      <SubMeshPart part={subParts[2]} currentStreak={currentStreak}>
        <mesh position={[-0.35, 1.1, 0.1]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.08, 0.12, 0.8, 12]} />
        </mesh>
        <mesh position={[0.35, 1.1, -0.1]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.08, 0.12, 0.8, 12]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 4: Tán lá biếc xanh non */}
      <SubMeshPart part={subParts[3]} currentStreak={currentStreak}>
        <mesh position={[0, 1.5, 0]}>
          <dodecahedronGeometry args={[0.7, 1]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 5: Các chùm nụ mai vàng */}
      <SubMeshPart part={subParts[4]} currentStreak={currentStreak}>
        <mesh position={[-0.5, 1.6, 0.4]}>
          <sphereGeometry args={[0.15, 16, 16]} />
        </mesh>
        <mesh position={[0.5, 1.7, -0.3]}>
          <sphereGeometry args={[0.15, 16, 16]} />
        </mesh>
        <mesh position={[0.1, 1.8, 0.4]}>
          <sphereGeometry args={[0.15, 16, 16]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 6: Những đóa hoa mai vàng bung nở */}
      <SubMeshPart part={subParts[5]} currentStreak={currentStreak}>
        <mesh position={[-0.4, 1.9, 0]}>
          <torusGeometry args={[0.2, 0.08, 8, 24]} />
        </mesh>
        <mesh position={[0.4, 1.9, 0.2]}>
          <torusGeometry args={[0.2, 0.08, 8, 24]} />
        </mesh>
        <mesh position={[0, 2.1, -0.3]}>
          <torusGeometry args={[0.2, 0.08, 8, 24]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 7: Bao lì xì đỏ & Ngôi sao lấp lánh đỉnh tháp */}
      <SubMeshPart part={subParts[6]} currentStreak={currentStreak}>
        <mesh position={[0, 2.4, 0]}>
          <octahedronGeometry args={[0.3, 0]} />
        </mesh>
        <mesh position={[-0.3, 1.3, 0.4]} rotation={[0, 0.3, 0.1]}>
          <boxGeometry args={[0.15, 0.25, 0.04]} />
        </mesh>
        <mesh position={[0.35, 1.3, -0.3]} rotation={[0, -0.3, -0.1]}>
          <boxGeometry args={[0.15, 0.25, 0.04]} />
        </mesh>
      </SubMeshPart>
    </group>
  );
}

// 2. Mô hình 3D Trái Tim Hoa Hồng (Tháng 2)
function ValentineHeartModel({ currentStreak, subParts }) {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Ngày 1: Bệ ngọc */}
      <SubMeshPart part={subParts[0]} currentStreak={currentStreak}>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.9, 1.1, 0.3, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 2: Khối lõi trái tim */}
      <SubMeshPart part={subParts[1]} currentStreak={currentStreak}>
        <mesh position={[-0.4, 0.3, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
        </mesh>
        <mesh position={[0.4, 0.3, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
        </mesh>
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.85, 1.2, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 3: Cánh hoa hồng lớp 1 */}
      <SubMeshPart part={subParts[2]} currentStreak={currentStreak}>
        <mesh position={[-0.3, 0.4, 0.4]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 4: Cánh hoa hồng lớp 2 */}
      <SubMeshPart part={subParts[3]} currentStreak={currentStreak}>
        <mesh position={[0.3, 0.4, 0.4]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 5: Dải ruy băng vàng */}
      <SubMeshPart part={subParts[4]} currentStreak={currentStreak}>
        <mesh position={[0, 0.1, 0.55]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[1.2, 0.12, 0.08]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 6: Đôi cánh thiên thần */}
      <SubMeshPart part={subParts[5]} currentStreak={currentStreak}>
        <mesh position={[-1.1, 0.5, -0.2]} rotation={[0, 0.4, 0.5]}>
          <boxGeometry args={[0.8, 0.3, 0.06]} />
        </mesh>
        <mesh position={[1.1, 0.5, -0.2]} rotation={[0, -0.4, -0.5]}>
          <boxGeometry args={[0.8, 0.3, 0.06]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 7: Vương miện lấp lánh */}
      <SubMeshPart part={subParts[6]} currentStreak={currentStreak}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.4, 0.3, 0.3, 5]} />
        </mesh>
      </SubMeshPart>
    </group>
  );
}

// 3. Mô hình 3D Quả Bí Ngô Halloween (Tháng 10)
function HalloweenPumpkinModel({ currentStreak, subParts }) {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Ngày 1: Ụ đất */}
      <SubMeshPart part={subParts[0]} currentStreak={currentStreak}>
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[1.1, 1.3, 0.3, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 2: Khối quả bí ngô */}
      <SubMeshPart part={subParts[1]} currentStreak={currentStreak}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.9, 32, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 3: Rãnh múi bí ngô */}
      <SubMeshPart part={subParts[2]} currentStreak={currentStreak}>
        <mesh position={[0, 0, 0]} rotation={[0, 0.8, 0]}>
          <torusGeometry args={[0.9, 0.12, 16, 32]} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, -0.8, 0]}>
          <torusGeometry args={[0.9, 0.12, 16, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 4: Cuống bí ngô */}
      <SubMeshPart part={subParts[3]} currentStreak={currentStreak}>
        <mesh position={[0, 0.95, 0]} rotation={[0.2, 0, 0.2]}>
          <cylinderGeometry args={[0.08, 0.14, 0.5, 16]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 5: Nụ cười khoét rạng rỡ */}
      <SubMeshPart part={subParts[4]} currentStreak={currentStreak}>
        <mesh position={[-0.3, 0.2, 0.85]}>
          <coneGeometry args={[0.15, 0.2, 3]} />
        </mesh>
        <mesh position={[0.3, 0.2, 0.85]}>
          <coneGeometry args={[0.15, 0.2, 3]} />
        </mesh>
        <mesh position={[0, -0.2, 0.85]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.35, 0.3, 3]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 6: Chiếc mũ phù thủy tím */}
      <SubMeshPart part={subParts[5]} currentStreak={currentStreak}>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.08, 32]} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <coneGeometry args={[0.5, 1.2, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 7: Ánh lửa thần kỳ & Đom đóm */}
      <SubMeshPart part={subParts[6]} currentStreak={currentStreak}>
        <mesh position={[0, 2.2, 0]}>
          <octahedronGeometry args={[0.25, 0]} />
        </mesh>
      </SubMeshPart>
    </group>
  );
}

// 4. Mô hình 3D Cây Thông Noel (Tháng 12)
function ChristmasTreeModel({ currentStreak, subParts }) {
  return (
    <group position={[0, -0.7, 0]}>
      {/* Ngày 1: Chậu gỗ */}
      <SubMeshPart part={subParts[0]} currentStreak={currentStreak}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.35, 0.5, 16]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 2: Tầng tán thông dưới */}
      <SubMeshPart part={subParts[1]} currentStreak={currentStreak}>
        <mesh position={[0, 0.7, 0]}>
          <coneGeometry args={[1.1, 0.9, 16]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 3: Tầng tán thông giữa */}
      <SubMeshPart part={subParts[2]} currentStreak={currentStreak}>
        <mesh position={[0, 1.3, 0]}>
          <coneGeometry args={[0.85, 0.8, 16]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 4: Tầng tán thông trên */}
      <SubMeshPart part={subParts[3]} currentStreak={currentStreak}>
        <mesh position={[0, 1.85, 0]}>
          <coneGeometry args={[0.6, 0.7, 16]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 5: Dải đèn led lấp lánh */}
      <SubMeshPart part={subParts[4]} currentStreak={currentStreak}>
        <mesh position={[0, 1.2, 0]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.8, 0.04, 8, 32]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 6: Quả châu đỏ & Hộp quà */}
      <SubMeshPart part={subParts[5]} currentStreak={currentStreak}>
        <mesh position={[0.5, 0.8, 0.5]}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
        <mesh position={[-0.4, 1.2, 0.4]}>
          <sphereGeometry args={[0.1, 16, 16]} />
        </mesh>
        <mesh position={[-0.6, 0.15, 0.4]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
        </mesh>
      </SubMeshPart>

      {/* Ngày 7: Ngôi sao vàng đỉnh tháp */}
      <SubMeshPart part={subParts[6]} currentStreak={currentStreak}>
        <mesh position={[0, 2.35, 0]}>
          <octahedronGeometry args={[0.25, 0]} />
        </mesh>
      </SubMeshPart>
    </group>
  );
}

// Bộ Dispatcher chuyển đổi mô hình 3D theo tháng
function Dynamic3DModel({ modelData, currentStreak }) {
  const month = modelData?.month || 11;
  const subParts = modelData?.sub_parts || [];

  if (month === 1) return <TetApricotTreeModel currentStreak={currentStreak} subParts={subParts} />;
  if (month === 2) return <ValentineHeartModel currentStreak={currentStreak} subParts={subParts} />;
  if (month === 10) return <HalloweenPumpkinModel currentStreak={currentStreak} subParts={subParts} />;
  if (month === 12) return <ChristmasTreeModel currentStreak={currentStreak} subParts={subParts} />;

  // Default fallback phong phú: Tự động map subParts
  return <TetApricotTreeModel currentStreak={currentStreak} subParts={subParts} />;
}

// Scene tổng thể tích hợp ánh sáng, xoay tự động và particles
function Scene({ modelData, currentStreak, autoRotate }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 4, -5]} intensity={0.6} color="#FFE5EC" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#FEF08A" />

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <Dynamic3DModel modelData={modelData} currentStreak={currentStreak} />
      </Float>

      {/* Hiệu ứng hạt phát sáng khi hoàn thành đủ 7 ngày */}
      {currentStreak >= 7 && (
        <Sparkles count={80} scale={4.5} size={6} speed={0.4} color="#FBBF24" />
      )}

      {/* Đổ bóng mềm mại xuống mặt sàn */}
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

export default function Savings3DViewer({ status }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const currentStreak = status?.current_streak || 0;
  const modelData = status?.model_3d;
  const renderProgress = status?.render_progress || 0;
  const percent = Math.round(renderProgress * 100);

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

        {/* Nút điều khiển xoay & góc nhìn */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm active:scale-95 ${
              autoRotate
                ? 'bg-[#D8F3DC] text-[#2D6A4F] border-[#95D5B2]'
                : 'bg-white text-[#5C4B47] border-[#FFE5EC]'
            }`}
          >
            <span>{autoRotate ? '⏸️ Tạm dừng xoay' : '▶️ Tự động xoay 3D'}</span>
          </button>
        </div>
      </div>

      {/* Khung Canvas Three.js Tương Tác 3D */}
      <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FFF9F6] to-[#F0FDF4] border-3 border-[#FFE5EC] shadow-inner select-none cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 1.8, 5.2], fov: 45 }}>
          <Scene modelData={modelData} currentStreak={currentStreak} autoRotate={autoRotate} />
        </Canvas>

        {/* Hướng dẫn tương tác xoay chuột */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#FFD1DC] text-[11px] font-bold text-[#5C4B47] flex items-center gap-1.5 shadow-sm pointer-events-none">
          <span>🖐️</span>
          <span>Kéo chuột để xoay 360° • Cuộn chuột để phóng to/thu nhỏ</span>
        </div>

        {/* Badge tiến độ góc trên phải */}
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
          📦 Tiến trình mở khóa 7 bộ phận của mô hình 3D:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {modelData?.sub_parts?.map((part) => {
            const isUnlocked = part.day <= currentStreak;
            const isNext = part.day === currentStreak + 1;

            return (
              <div
                key={part.day}
                className={`p-2 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-[#D8F3DC]/70 border-[#95D5B2] shadow-sm'
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

