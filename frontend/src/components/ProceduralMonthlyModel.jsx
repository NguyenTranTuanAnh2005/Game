import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ==============================================================
// 1. HELPER COMPONENT: PBR MESH THEO TIẾN TRÌNH STREAK (1/7 ĐẾN 7/7)
// ==============================================================
export function PBRPart({
  day,
  streak,
  materialProps,
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  castShadow = true,
  receiveShadow = true,
  onClick,
}) {
  const isUnlocked = day <= streak;
  const isNext = day === streak + 1;

  // Vật liệu PBR chân thực khi đã mở khóa
  const activeMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      ...materialProps,
    });
  }, [materialProps]);

  // Vật liệu Thạch cao điêu khắc nghệ thuật mờ khi chưa mở khóa
  const plasterMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: isNext ? '#F1F5F9' : '#E2E8F0',
      roughness: 0.88,
      metalness: 0.05,
      clearcoat: 0.1,
      clearcoatRoughness: 0.4,
      emissive: isNext ? new THREE.Color('#FDE047') : new THREE.Color('#000000'),
      emissiveIntensity: isNext ? 0.22 : 0,
      transparent: !isNext && day > streak + 1,
      opacity: !isNext && day > streak + 1 ? 0.65 : 1.0,
      wireframe: false,
    });
  }, [isNext, day, streak]);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          castShadow,
          receiveShadow,
          material: isUnlocked ? activeMat : plasterMat,
        });
      })}
    </group>
  );
}

// ==============================================================
// 2. MÔ HÌNH THÁNG 1: CÂY MAI VÀNG BONSAI TRONG CHẬU SỨ TRẮNG (TẾT)
// ==============================================================
function TetApricotBonsaiModel({ streak, onSelectDay }) {
  // Bông hoa mai 5 cánh vàng nhụy đỏ cam
  const flowerPetals = useMemo(() => {
    return [0, 1, 2, 3, 4].map((i) => {
      const angle = (i * Math.PI * 2) / 5;
      return {
        x: Math.cos(angle) * 0.11,
        y: Math.sin(angle) * 0.11,
        rotZ: angle,
      };
    });
  }, []);

  return (
    <group position={[0, -0.6, 0]}>
      {/* Ngày 1: Chậu gốm sứ trắng men ngọc bóng & Sỏi đất bonsai */}
      <PBRPart
        day={1}
        streak={streak}
        materialProps={{
          color: '#FAF5FF',
          roughness: 0.08,
          metalness: 0.02,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
        }}
        onClick={() => onSelectDay(1)}
      >
        {/* Thân chậu gốm sứ tròn bát giác vát góc */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[1.0, 0.75, 0.5, 32]} />
        </mesh>
        {/* Vành chậu gốm nằm ngang */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.98, 0.06, 16, 32]} />
        </mesh>
        {/* Lớp đất màu sẫm */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.05, 32]} />
          <meshPhysicalMaterial color="#3E2723" roughness={0.9} metalness={0.0} />
        </mesh>
      </PBRPart>

      {/* Ngày 2: Gốc cây & Thân bonsai cổ thụ uốn lượn */}
      <PBRPart
        day={2}
        streak={streak}
        materialProps={{
          color: '#5D4037',
          roughness: 0.8,
          metalness: 0.05,
          clearcoat: 0.15,
        }}
        onClick={() => onSelectDay(2)}
      >
        <mesh position={[0, 0.6, 0]} rotation={[0.1, 0, -0.15]}>
          <cylinderGeometry args={[0.22, 0.35, 0.7, 16]} />
        </mesh>
        <mesh position={[-0.08, 1.1, 0.05]} rotation={[-0.15, 0, 0.25]}>
          <cylinderGeometry args={[0.15, 0.22, 0.6, 16]} />
        </mesh>
      </PBRPart>

      {/* Ngày 3: Cành phân nhánh uốn lượn bonsai */}
      <PBRPart
        day={3}
        streak={streak}
        materialProps={{
          color: '#6D4C41',
          roughness: 0.75,
          metalness: 0.05,
        }}
        onClick={() => onSelectDay(3)}
      >
        {/* Cành vươn trái */}
        <mesh position={[-0.45, 1.4, 0.15]} rotation={[0.2, 0, 0.7]}>
          <cylinderGeometry args={[0.08, 0.14, 0.8, 12]} />
        </mesh>
        {/* Cành vươn phải */}
        <mesh position={[0.45, 1.45, -0.1]} rotation={[-0.2, 0, -0.7]}>
          <cylinderGeometry args={[0.08, 0.14, 0.8, 12]} />
        </mesh>
        {/* Cành đỉnh */}
        <mesh position={[0.05, 1.65, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.06, 0.12, 0.6, 12]} />
        </mesh>
      </PBRPart>

      {/* Ngày 4: Tán lá xanh non biếc tràn đầy nhựa sống */}
      <PBRPart
        day={4}
        streak={streak}
        materialProps={{
          color: '#15803D',
          roughness: 0.35,
          metalness: 0.05,
          clearcoat: 0.4,
          transmission: 0.1,
        }}
        onClick={() => onSelectDay(4)}
      >
        <mesh position={[-0.6, 1.6, 0.3]}><sphereGeometry args={[0.18, 16, 16]} /></mesh>
        <mesh position={[0.65, 1.65, -0.25]}><sphereGeometry args={[0.18, 16, 16]} /></mesh>
        <mesh position={[0, 1.9, 0.1]}><sphereGeometry args={[0.22, 16, 16]} /></mesh>
        <mesh position={[-0.2, 1.8, -0.35]}><sphereGeometry args={[0.16, 16, 16]} /></mesh>
        <mesh position={[0.3, 1.75, 0.35]}><sphereGeometry args={[0.16, 16, 16]} /></mesh>
      </PBRPart>

      {/* Ngày 5: Chùm nụ hoa mai vàng chúm chím */}
      <PBRPart
        day={5}
        streak={streak}
        materialProps={{
          color: '#FACC15',
          roughness: 0.3,
          metalness: 0.1,
          clearcoat: 0.5,
        }}
        onClick={() => onSelectDay(5)}
      >
        <mesh position={[-0.75, 1.7, 0.4]}><sphereGeometry args={[0.1, 16, 16]} /></mesh>
        <mesh position={[0.8, 1.75, -0.2]}><sphereGeometry args={[0.1, 16, 16]} /></mesh>
        <mesh position={[-0.1, 2.05, 0.3]}><sphereGeometry args={[0.1, 16, 16]} /></mesh>
        <mesh position={[0.3, 2.0, -0.2]}><sphereGeometry args={[0.1, 16, 16]} /></mesh>
      </PBRPart>

      {/* Ngày 6: Hàng chục đóa hoa mai vàng rực rỡ bung nở nhụy đỏ */}
      <PBRPart
        day={6}
        streak={streak}
        materialProps={{
          color: '#FBBF24',
          roughness: 0.2,
          metalness: 0.15,
          clearcoat: 0.8,
        }}
        onClick={() => onSelectDay(6)}
      >
        {/* Đóa hoa mai 1 */}
        <group position={[-0.55, 1.85, 0.25]}>
          {flowerPetals.map((p, i) => (
            <mesh key={i} position={[p.x, p.y, 0]}>
              <sphereGeometry args={[0.09, 12, 12]} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshPhysicalMaterial color="#DC2626" roughness={0.3} emissive="#EF4444" emissiveIntensity={0.3} />
          </mesh>
        </group>

        {/* Đóa hoa mai 2 */}
        <group position={[0.6, 1.9, -0.1]}>
          {flowerPetals.map((p, i) => (
            <mesh key={i} position={[p.x, p.y, 0]}>
              <sphereGeometry args={[0.09, 12, 12]} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshPhysicalMaterial color="#DC2626" roughness={0.3} emissive="#EF4444" emissiveIntensity={0.3} />
          </mesh>
        </group>

        {/* Đóa hoa mai 3 đỉnh chóp */}
        <group position={[0, 2.2, 0]}>
          {flowerPetals.map((p, i) => (
            <mesh key={i} position={[p.x, p.y, 0]}>
              <sphereGeometry args={[0.1, 12, 12]} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshPhysicalMaterial color="#DC2626" roughness={0.3} emissive="#EF4444" emissiveIntensity={0.3} />
          </mesh>
        </group>
      </PBRPart>

      {/* Ngày 7: Bao lì xì đỏ may mắn viền vàng & Đỉnh tài lộc */}
      <PBRPart
        day={7}
        streak={streak}
        materialProps={{
          color: '#DC2626',
          roughness: 0.35,
          metalness: 0.15,
          clearcoat: 0.5,
        }}
        onClick={() => onSelectDay(7)}
      >
        {/* Bao lì xì trái */}
        <group position={[-0.4, 1.25, 0.45]} rotation={[0, 0.3, 0.2]}>
          <mesh><boxGeometry args={[0.18, 0.28, 0.03]} /></mesh>
          <mesh position={[0, 0.05, 0.02]}><sphereGeometry args={[0.04, 12, 12]} /></mesh>
        </group>
        {/* Bao lì xì phải */}
        <group position={[0.45, 1.25, -0.3]} rotation={[0, -0.4, -0.15]}>
          <mesh><boxGeometry args={[0.18, 0.28, 0.03]} /></mesh>
          <mesh position={[0, 0.05, 0.02]}><sphereGeometry args={[0.04, 12, 12]} /></mesh>
        </group>
        {/* Ngôi sao vàng đỉnh tháp */}
        <mesh position={[0, 2.45, 0]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshPhysicalMaterial color="#FBBF24" metalness={0.9} roughness={0.15} emissive="#F59E0B" emissiveIntensity={0.4} />
        </mesh>
      </PBRPart>
    </group>
  );
}

// ==============================================================
// 3. MÔ HÌNH THÁNG 2: HỘP QUÀ NHUNG TRÁI TIM & HOA HỒNG (VALENTINE)
// ==============================================================
function ValentineHeartBoxModel({ streak, onSelectDay }) {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Ngày 1: Đáy hộp quà nhung đỏ thẫm */}
      <PBRPart
        day={1}
        streak={streak}
        materialProps={{
          color: '#9F1239',
          roughness: 0.75,
          metalness: 0.05,
          clearcoat: 0.2,
        }}
        onClick={() => onSelectDay(1)}
      >
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[1.1, 1.15, 0.2, 32]} />
        </mesh>
      </PBRPart>

      {/* Ngày 2: Khối thân hộp quà nhung hình trái tim */}
      <PBRPart
        day={2}
        streak={streak}
        materialProps={{
          color: '#BE123C',
          roughness: 0.7,
          metalness: 0.08,
          clearcoat: 0.3,
        }}
        onClick={() => onSelectDay(2)}
      >
        <mesh position={[-0.45, 0.2, 0]}><cylinderGeometry args={[0.55, 0.55, 0.7, 32]} /></mesh>
        <mesh position={[0.45, 0.2, 0]}><cylinderGeometry args={[0.55, 0.55, 0.7, 32]} /></mesh>
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.9, 0.8, 32]} />
        </mesh>
      </PBRPart>

      {/* Ngày 3: Bó hoa hồng nhung tầng thứ nhất */}
      <PBRPart
        day={3}
        streak={streak}
        materialProps={{
          color: '#E11D48',
          roughness: 0.4,
          metalness: 0.05,
          clearcoat: 0.4,
        }}
        onClick={() => onSelectDay(3)}
      >
        <mesh position={[-0.3, 0.5, 0.2]}><sphereGeometry args={[0.25, 20, 20]} /></mesh>
        <mesh position={[0.3, 0.5, 0.2]}><sphereGeometry args={[0.25, 20, 20]} /></mesh>
        <mesh position={[0, 0.5, -0.25]}><sphereGeometry args={[0.25, 20, 20]} /></mesh>
      </PBRPart>

      {/* Ngày 4: Bó hoa hồng nở rộ bung cánh xếp lớp */}
      <PBRPart
        day={4}
        streak={streak}
        materialProps={{
          color: '#FB7185',
          roughness: 0.35,
          metalness: 0.05,
          clearcoat: 0.5,
        }}
        onClick={() => onSelectDay(4)}
      >
        <mesh position={[0, 0.65, 0]}><sphereGeometry args={[0.32, 24, 24]} /></mesh>
        <mesh position={[-0.35, 0.6, -0.1]}><torusGeometry args={[0.18, 0.08, 16, 24]} /></mesh>
        <mesh position={[0.35, 0.6, -0.1]}><torusGeometry args={[0.18, 0.08, 16, 24]} /></mesh>
      </PBRPart>

      {/* Ngày 5: Dải ruy băng lụa vàng ánh kim buộc quanh hộp */}
      <PBRPart
        day={5}
        streak={streak}
        materialProps={{
          color: '#F59E0B',
          roughness: 0.15,
          metalness: 0.85,
          clearcoat: 0.9,
        }}
        onClick={() => onSelectDay(5)}
      >
        <mesh position={[0, 0.15, 0.6]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[1.3, 0.12, 0.08]} />
        </mesh>
        <mesh position={[0, 0.15, 0.65]}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
      </PBRPart>

      {/* Ngày 6: Nắp hộp trái tim mở hé góc sang trọng */}
      <PBRPart
        day={6}
        streak={streak}
        materialProps={{
          color: '#E11D48',
          roughness: 0.5,
          metalness: 0.1,
          clearcoat: 0.6,
        }}
        onClick={() => onSelectDay(6)}
      >
        <group position={[0.9, 0.8, -0.3]} rotation={[0.4, -0.3, 0.7]}>
          <mesh position={[-0.35, 0, 0]}><cylinderGeometry args={[0.45, 0.45, 0.12, 32]} /></mesh>
          <mesh position={[0.35, 0, 0]}><cylinderGeometry args={[0.45, 0.45, 0.12, 32]} /></mesh>
        </group>
      </PBRPart>

      {/* Ngày 7: Vương miện ngọc kim cương & Hạt tình yêu tỏa sáng */}
      <PBRPart
        day={7}
        streak={streak}
        materialProps={{
          color: '#FEF08A',
          metalness: 0.95,
          roughness: 0.1,
          clearcoat: 1.0,
        }}
        onClick={() => onSelectDay(7)}
      >
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.35, 0.25, 0.25, 5]} />
        </mesh>
      </PBRPart>
    </group>
  );
}

// ==============================================================
// 4. MÔ HÌNH THÁNG 11: ĐÈN LỒNG THỦY TINH & LỬA NẾN ẤM ÁP (THÁNG HIỆN TẠI)
// ==============================================================
function WarmLanternModel({ streak, onSelectDay }) {
  const flameRef = useRef();

  useFrame((state) => {
    if (flameRef.current) {
      // Nhịp bập bùng sống động của ngọn lửa nến
      const flicker = Math.sin(state.clock.elapsedTime * 8) * 0.08 + 1.0;
      flameRef.current.scale.set(flicker, flicker * 1.1, flicker);
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Ngày 1: Đế gỗ sồi mộc mạc vân tự nhiên */}
      <PBRPart
        day={1}
        streak={streak}
        materialProps={{
          color: '#5C3A21',
          roughness: 0.8,
          metalness: 0.04,
          clearcoat: 0.1,
        }}
        onClick={() => onSelectDay(1)}
      >
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[1.1, 1.25, 0.22, 32]} />
        </mesh>
      </PBRPart>

      {/* Ngày 2: Khung đồng cổ điển đèn lồng */}
      <PBRPart
        day={2}
        streak={streak}
        materialProps={{
          color: '#B45309',
          metalness: 0.88,
          roughness: 0.2,
          clearcoat: 0.7,
        }}
        onClick={() => onSelectDay(2)}
      >
        {/* 4 Trụ góc kim loại đồng */}
        <mesh position={[-0.55, 0.2, -0.55]}><cylinderGeometry args={[0.04, 0.04, 1.5, 12]} /></mesh>
        <mesh position={[0.55, 0.2, -0.55]}><cylinderGeometry args={[0.04, 0.04, 1.5, 12]} /></mesh>
        <mesh position={[-0.55, 0.2, 0.55]}><cylinderGeometry args={[0.04, 0.04, 1.5, 12]} /></mesh>
        <mesh position={[0.55, 0.2, 0.55]}><cylinderGeometry args={[0.04, 0.04, 1.5, 12]} /></mesh>
        {/* Vành đế đồng */}
        <mesh position={[0, -0.52, 0]}><cylinderGeometry args={[0.85, 0.95, 0.06, 32]} /></mesh>
      </PBRPart>

      {/* Ngày 3: Thân lồng kính thủy tinh trong suốt Photorealistic Glass */}
      <PBRPart
        day={3}
        streak={streak}
        materialProps={{
          color: '#FFFFFF',
          roughness: 0.04,
          metalness: 0.0,
          transmission: 0.93,
          thickness: 0.5,
          ior: 1.52,
          transparent: true,
          opacity: 1.0,
        }}
        onClick={() => onSelectDay(3)}
      >
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 1.4, 32, 1, true]} />
        </mesh>
      </PBRPart>

      {/* Ngày 4: Cây nến sáp trắng ngà bên trong lồng kính */}
      <PBRPart
        day={4}
        streak={streak}
        materialProps={{
          color: '#FEF9C3',
          roughness: 0.35,
          metalness: 0.02,
          clearcoat: 0.3,
        }}
        onClick={() => onSelectDay(4)}
      >
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 0.7, 24]} />
        </mesh>
        {/* Bấc nến */}
        <mesh position={[0, 0.23, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
          <meshPhysicalMaterial color="#1E293B" roughness={0.9} />
        </mesh>
      </PBRPart>

      {/* Ngày 5: Ngọn lửa nến vàng bập bùng phát sáng chân thực */}
      <PBRPart
        day={5}
        streak={streak}
        materialProps={{
          color: '#F59E0B',
          roughness: 0.1,
          metalness: 0.1,
          emissive: '#EA580C',
          emissiveIntensity: 0.9,
        }}
        onClick={() => onSelectDay(5)}
      >
        <group ref={flameRef} position={[0, 0.38, 0]}>
          <mesh>
            <coneGeometry args={[0.1, 0.25, 16]} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshPhysicalMaterial color="#FDE047" emissive="#FACC15" emissiveIntensity={1.2} />
          </mesh>
        </group>
        {/* Point light tỏa ánh sáng vàng ấm */}
        <pointLight position={[0, 0.4, 0]} color="#F59E0B" intensity={streak >= 5 ? 1.8 : 0.3} distance={5} />
      </PBRPart>

      {/* Ngày 6: Nắp chóp đồng cổ điển & Quai xách đèn lồng */}
      <PBRPart
        day={6}
        streak={streak}
        materialProps={{
          color: '#B45309',
          metalness: 0.9,
          roughness: 0.18,
          clearcoat: 0.8,
        }}
        onClick={() => onSelectDay(6)}
      >
        <mesh position={[0, 0.95, 0]}>
          <coneGeometry args={[0.85, 0.4, 32]} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <torusGeometry args={[0.22, 0.04, 16, 24]} />
        </mesh>
      </PBRPart>

      {/* Ngày 7: Những chiếc lá phong vàng đỏ mùa thu rơi rải rác & Hạt tinh tú */}
      <PBRPart
        day={7}
        streak={streak}
        materialProps={{
          color: '#EA580C',
          roughness: 0.4,
          metalness: 0.05,
          clearcoat: 0.5,
        }}
        onClick={() => onSelectDay(7)}
      >
        <mesh position={[-0.8, -0.6, 0.4]} rotation={[0.4, 0.5, -0.2]}>
          <boxGeometry args={[0.25, 0.02, 0.25]} />
        </mesh>
        <mesh position={[0.75, -0.6, -0.3]} rotation={[-0.3, 0.8, 0.1]}>
          <boxGeometry args={[0.22, 0.02, 0.22]} />
          <meshPhysicalMaterial color="#DC2626" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshPhysicalMaterial color="#FBBF24" metalness={0.9} roughness={0.1} emissive="#F59E0B" emissiveIntensity={0.5} />
        </mesh>
      </PBRPart>
    </group>
  );
}

// ==============================================================
// 5. MÔ HÌNH THÁNG 10: QUẢ BÍ NGÔ ĐIÊU KHẮC HALLOWEEN PHÁT SÁNG
// ==============================================================
function HalloweenPumpkinModel({ streak, onSelectDay }) {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Ngày 1: Đụn đất phủ cỏ khô */}
      <PBRPart
        day={1}
        streak={streak}
        materialProps={{ color: '#451A03', roughness: 0.85, metalness: 0.02 }}
        onClick={() => onSelectDay(1)}
      >
        <mesh position={[0, -0.8, 0]}><cylinderGeometry args={[1.15, 1.35, 0.3, 32]} /></mesh>
      </PBRPart>

      {/* Ngày 2: Thân bí ngô cam mọng nhiều múi căng tròn */}
      <PBRPart
        day={2}
        streak={streak}
        materialProps={{
          color: '#EA580C',
          roughness: 0.28,
          metalness: 0.05,
          clearcoat: 0.8,
          clearcoatRoughness: 0.15,
        }}
        onClick={() => onSelectDay(2)}
      >
        <mesh position={[0, 0, 0]}><sphereGeometry args={[0.92, 32, 32]} /></mesh>
      </PBRPart>

      {/* Ngày 3: Các đường rãnh múi bí ngô */}
      <PBRPart
        day={3}
        streak={streak}
        materialProps={{ color: '#C2410C', roughness: 0.35, metalness: 0.05 }}
        onClick={() => onSelectDay(3)}
      >
        <mesh position={[0, 0, 0]} rotation={[0, 0.8, 0]}><torusGeometry args={[0.92, 0.1, 16, 32]} /></mesh>
        <mesh position={[0, 0, 0]} rotation={[0, -0.8, 0]}><torusGeometry args={[0.92, 0.1, 16, 32]} /></mesh>
      </PBRPart>

      {/* Ngày 4: Cuống bí xanh uốn lượn */}
      <PBRPart
        day={4}
        streak={streak}
        materialProps={{ color: '#15803D', roughness: 0.7, metalness: 0.05 }}
        onClick={() => onSelectDay(4)}
      >
        <mesh position={[0, 0.98, 0]} rotation={[0.2, 0, 0.2]}><cylinderGeometry args={[0.08, 0.14, 0.5, 16]} /></mesh>
      </PBRPart>

      {/* Ngày 5: Mắt tam giác & Miệng cười Halloween phát sáng */}
      <PBRPart
        day={5}
        streak={streak}
        materialProps={{ color: '#FEF08A', emissive: '#FDE047', emissiveIntensity: 0.8 }}
        onClick={() => onSelectDay(5)}
      >
        <mesh position={[-0.32, 0.2, 0.85]}><coneGeometry args={[0.15, 0.18, 3]} /></mesh>
        <mesh position={[0.32, 0.2, 0.85]}><coneGeometry args={[0.15, 0.18, 3]} /></mesh>
        <mesh position={[0, -0.22, 0.86]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.35, 0.3, 3]} /></mesh>
        <pointLight position={[0, 0, 0.3]} color="#F97316" intensity={streak >= 5 ? 1.5 : 0.2} distance={4} />
      </PBRPart>

      {/* Ngày 6: Chiếc mũ phù thủy màu tím nhung */}
      <PBRPart
        day={6}
        streak={streak}
        materialProps={{ color: '#6B21A8', roughness: 0.8, metalness: 0.1, clearcoat: 0.2 }}
        onClick={() => onSelectDay(6)}
      >
        <mesh position={[0, 1.05, 0]}><cylinderGeometry args={[0.85, 0.85, 0.08, 32]} /></mesh>
        <mesh position={[0, 1.65, 0]}><coneGeometry args={[0.5, 1.25, 32]} /></mesh>
      </PBRPart>

      {/* Ngày 7: Ngôi sao vàng & Tinh tú Halloween */}
      <PBRPart
        day={7}
        streak={streak}
        materialProps={{ color: '#FDE047', metalness: 0.9, roughness: 0.1, emissive: '#F59E0B', emissiveIntensity: 0.5 }}
        onClick={() => onSelectDay(7)}
      >
        <mesh position={[0, 2.3, 0]}><octahedronGeometry args={[0.22, 0]} /></mesh>
      </PBRPart>
    </group>
  );
}

// ==============================================================
// 6. MÔ HÌNH THÁNG 12: CÂY THÔNG NOEL PHỦ TUYẾT & QUẢ CHÂU KIM LOẠI
// ==============================================================
function ChristmasTreeModel({ streak, onSelectDay }) {
  return (
    <group position={[0, -0.7, 0]}>
      {/* Ngày 1: Chậu gỗ mộc mạc */}
      <PBRPart
        day={1}
        streak={streak}
        materialProps={{ color: '#78350F', roughness: 0.8, metalness: 0.05 }}
        onClick={() => onSelectDay(1)}
      >
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.45, 0.38, 0.55, 20]} /></mesh>
      </PBRPart>

      {/* Ngày 2: Tầng tán thông xanh thứ nhất phủ tuyết trắng */}
      <PBRPart
        day={2}
        streak={streak}
        materialProps={{ color: '#166534', roughness: 0.45, metalness: 0.05 }}
        onClick={() => onSelectDay(2)}
      >
        <mesh position={[0, 0.75, 0]}><coneGeometry args={[1.15, 0.95, 16]} /></mesh>
        <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[1.05, 1.1, 0.1, 16]} />
          <meshPhysicalMaterial color="#F8FAFC" roughness={0.2} clearcoat={0.9} />
        </mesh>
      </PBRPart>

      {/* Ngày 3: Tầng tán thông thứ hai */}
      <PBRPart
        day={3}
        streak={streak}
        materialProps={{ color: '#15803D', roughness: 0.45, metalness: 0.05 }}
        onClick={() => onSelectDay(3)}
      >
        <mesh position={[0, 1.35, 0]}><coneGeometry args={[0.9, 0.85, 16]} /></mesh>
      </PBRPart>

      {/* Ngày 4: Tầng tán thông thứ ba đỉnh chóp */}
      <PBRPart
        day={4}
        streak={streak}
        materialProps={{ color: '#22C55E', roughness: 0.4, metalness: 0.05 }}
        onClick={() => onSelectDay(4)}
      >
        <mesh position={[0, 1.9, 0]}><coneGeometry args={[0.65, 0.75, 16]} /></mesh>
      </PBRPart>

      {/* Ngày 5: Dây đèn LED quấn quanh tán thông nằm ngang ôm khít ngoài thân cây */}
      <PBRPart
        day={5}
        streak={streak}
        materialProps={{ color: '#FBBF24', metalness: 0.85, roughness: 0.15, emissive: '#FDE047', emissiveIntensity: 0.7 }}
        onClick={() => onSelectDay(5)}
      >
        {/* Vòng dây đèn tầng dưới ôm quanh tán thông */}
        <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.025, 12, 32]} />
        </mesh>
        {/* Vòng dây đèn tầng trên ôm quanh chóp tán thông */}
        <mesh position={[0, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.68, 0.02, 12, 32]} />
        </mesh>

        {/* Các bóng đèn LED phát sáng vàng ấm đính dọc dây đèn */}
        <mesh position={[0.95, 0.95, 0]}><sphereGeometry args={[0.045, 12, 12]} /><meshPhysicalMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.4} /></mesh>
        <mesh position={[-0.95, 0.95, 0]}><sphereGeometry args={[0.045, 12, 12]} /><meshPhysicalMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.4} /></mesh>
        <mesh position={[0, 0.95, 0.95]}><sphereGeometry args={[0.045, 12, 12]} /><meshPhysicalMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.4} /></mesh>
        <mesh position={[0, 0.95, -0.95]}><sphereGeometry args={[0.045, 12, 12]} /><meshPhysicalMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.4} /></mesh>
        <mesh position={[0.68, 1.55, 0]}><sphereGeometry args={[0.04, 12, 12]} /><meshPhysicalMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.4} /></mesh>
        <mesh position={[-0.68, 1.55, 0]}><sphereGeometry args={[0.04, 12, 12]} /><meshPhysicalMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.4} /></mesh>
        <mesh position={[0, 1.55, 0.68]}><sphereGeometry args={[0.04, 12, 12]} /><meshPhysicalMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.4} /></mesh>
        <mesh position={[0, 1.55, -0.68]}><sphereGeometry args={[0.04, 12, 12]} /><meshPhysicalMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.4} /></mesh>
      </PBRPart>

      {/* Ngày 6: Các quả châu kim loại đỏ, vàng lấp lánh & Hộp quà */}
      <PBRPart
        day={6}
        streak={streak}
        materialProps={{ color: '#DC2626', metalness: 0.95, roughness: 0.08, clearcoat: 1.0 }}
        onClick={() => onSelectDay(6)}
      >
        <mesh position={[0.55, 0.85, 0.55]}><sphereGeometry args={[0.13, 20, 20]} /></mesh>
        <mesh position={[-0.45, 1.25, 0.45]}><sphereGeometry args={[0.11, 20, 20]} />
          <meshPhysicalMaterial color="#FBBF24" metalness={0.95} roughness={0.08} clearcoat={1.0} />
        </mesh>
        <mesh position={[-0.65, 0.2, 0.4]}><boxGeometry args={[0.32, 0.32, 0.32]} /></mesh>
      </PBRPart>

      {/* Ngày 7: Ngôi sao Noel vàng kim đỉnh tháp */}
      <PBRPart
        day={7}
        streak={streak}
        materialProps={{ color: '#FDE047', metalness: 0.95, roughness: 0.1, emissive: '#F59E0B', emissiveIntensity: 0.5 }}
        onClick={() => onSelectDay(7)}
      >
        <mesh position={[0, 2.45, 0]}><octahedronGeometry args={[0.26, 0]} /></mesh>
      </PBRPart>
    </group>
  );
}

// ==============================================================
// 7. MÔ HÌNH MẶC ĐỊNH / CÁC THÁNG KHÁC: HEO ĐẤT GỐM SỨ BÓNG & ĐỒNG XU
// ==============================================================
function PiggyBankCeramicModel({ streak, onSelectDay }) {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Ngày 1: Bệ mây trắng mềm mại nâng đỡ */}
      <PBRPart
        day={1}
        streak={streak}
        materialProps={{ color: '#FFF5F7', roughness: 0.6, metalness: 0.02, clearcoat: 0.3 }}
        onClick={() => onSelectDay(1)}
      >
        <mesh position={[0, -0.65, 0]}><cylinderGeometry args={[1.2, 1.35, 0.25, 32]} /></mesh>
      </PBRPart>

      {/* Ngày 2: Thân heo đất gốm sứ hồng pastel tráng men siêu bóng Photorealistic */}
      <PBRPart
        day={2}
        streak={streak}
        materialProps={{
          color: '#FFB7C5',
          roughness: 0.08,
          metalness: 0.02,
          clearcoat: 1.0,
          clearcoatRoughness: 0.06,
        }}
        onClick={() => onSelectDay(2)}
      >
        <mesh position={[0, 0.1, 0]} scale={[1.25, 1.05, 1.0]}>
          <sphereGeometry args={[0.85, 32, 32]} />
        </mesh>
      </PBRPart>

      {/* Ngày 3: 4 Chân ngắn mũm mĩm & Đuôi xoắn ốc */}
      <PBRPart
        day={3}
        streak={streak}
        materialProps={{ color: '#FFA4B6', roughness: 0.12, clearcoat: 0.9 }}
        onClick={() => onSelectDay(3)}
      >
        <mesh position={[-0.45, -0.5, 0.35]}><cylinderGeometry args={[0.14, 0.12, 0.35, 16]} /></mesh>
        <mesh position={[0.45, -0.5, 0.35]}><cylinderGeometry args={[0.14, 0.12, 0.35, 16]} /></mesh>
        <mesh position={[-0.45, -0.5, -0.35]}><cylinderGeometry args={[0.14, 0.12, 0.35, 16]} /></mesh>
        <mesh position={[0.45, -0.5, -0.35]}><cylinderGeometry args={[0.14, 0.12, 0.35, 16]} /></mesh>
        {/* Đuôi xoắn */}
        <mesh position={[1.1, 0.15, 0]} rotation={[0, 0, 0.5]}><torusGeometry args={[0.12, 0.04, 12, 24]} /></mesh>
      </PBRPart>

      {/* Ngày 4: Mõm tròn 2 lỗ & Đôi tai cụp đáng yêu */}
      <PBRPart
        day={4}
        streak={streak}
        materialProps={{ color: '#FF8E9E', roughness: 0.15, clearcoat: 0.8 }}
        onClick={() => onSelectDay(4)}
      >
        <mesh position={[-0.95, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.26, 0.28, 0.2, 24]} /></mesh>
        <mesh position={[-0.4, 0.8, 0.35]} rotation={[0.4, 0, -0.4]}><coneGeometry args={[0.18, 0.35, 16]} /></mesh>
        <mesh position={[-0.4, 0.8, -0.35]} rotation={[-0.4, 0, -0.4]}><coneGeometry args={[0.18, 0.35, 16]} /></mesh>
      </PBRPart>

      {/* Ngày 5: Mắt đen láy & Đôi má hồng đào */}
      <PBRPart
        day={5}
        streak={streak}
        materialProps={{ color: '#1E293B', roughness: 0.1, clearcoat: 1.0 }}
        onClick={() => onSelectDay(5)}
      >
        <mesh position={[-0.85, 0.35, 0.28]}><sphereGeometry args={[0.065, 16, 16]} /></mesh>
        <mesh position={[-0.85, 0.35, -0.28]}><sphereGeometry args={[0.065, 16, 16]} /></mesh>
        <mesh position={[-0.8, 0.15, 0.45]}><sphereGeometry args={[0.1, 16, 16]} />
          <meshPhysicalMaterial color="#FF6B8B" roughness={0.3} clearcoat={0.6} />
        </mesh>
        <mesh position={[-0.8, 0.15, -0.45]}><sphereGeometry args={[0.1, 16, 16]} />
          <meshPhysicalMaterial color="#FF6B8B" roughness={0.3} clearcoat={0.6} />
        </mesh>
      </PBRPart>

      {/* Ngày 6: Khe bỏ tiền mạ vàng trên lưng heo */}
      <PBRPart
        day={6}
        streak={streak}
        materialProps={{ color: '#F59E0B', metalness: 0.95, roughness: 0.1, clearcoat: 1.0 }}
        onClick={() => onSelectDay(6)}
      >
        <mesh position={[0, 0.98, 0]}><boxGeometry args={[0.4, 0.06, 0.08]} /></mesh>
      </PBRPart>

      {/* Ngày 7: Đồng xu vàng kim loại rơi xung quanh & Vương miện nhỏ */}
      <PBRPart
        day={7}
        streak={streak}
        materialProps={{ color: '#FBBF24', metalness: 0.95, roughness: 0.1, clearcoat: 1.0 }}
        onClick={() => onSelectDay(7)}
      >
        <mesh position={[-0.75, -0.45, 0.65]} rotation={[Math.PI / 2, 0.2, 0]}><cylinderGeometry args={[0.18, 0.18, 0.04, 24]} /></mesh>
        <mesh position={[0.75, -0.45, -0.65]} rotation={[Math.PI / 2, -0.3, 0]}><cylinderGeometry args={[0.18, 0.18, 0.04, 24]} /></mesh>
        <mesh position={[-0.3, 1.15, 0]}><octahedronGeometry args={[0.16, 0]} /></mesh>
      </PBRPart>
    </group>
  );
}

// ==============================================================
// 8. TIER ACCESSORIES & AURA EFFECTS (TIER 1 -> 4)
// ==============================================================

// Tier 2+: Đồng xu vàng rơi/bay quanh mô hình
function Tier2CoinsAccessories() {
  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[-1.2, 0.1, 0.6]} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
        <meshPhysicalMaterial color="#FBBF24" metalness={0.95} roughness={0.12} clearcoat={1.0} />
      </mesh>
      <mesh position={[1.2, 0.05, -0.5]} rotation={[Math.PI / 2.3, -0.4, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
        <meshPhysicalMaterial color="#FBBF24" metalness={0.95} roughness={0.12} clearcoat={1.0} />
      </mesh>
      <mesh position={[0, 0.05, 1.2]} rotation={[Math.PI / 2, 0, 0.5]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
        <meshPhysicalMaterial color="#FBBF24" metalness={0.95} roughness={0.12} clearcoat={1.0} />
      </mesh>
    </group>
  );
}

// Tier 3+: Vòng hào quang thiên thần Celestial Halo NẰM NGANG quanh bệ đỡ
function Tier3CelestialHalo() {
  const haloRef = useRef();

  useFrame((state, delta) => {
    if (haloRef.current) {
      // Chỉ xoay đều quanh trục Y thẳng đứng (nằm ngang 100%, không bao giờ bị quay dọc)
      haloRef.current.rotation.y += delta * 0.6;
      // Nhịp thở nhấp nhô lơ lửng rất nhẹ nhàng theo trục Y
      haloRef.current.position.y = -0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    }
  });

  return (
    <group ref={haloRef} position={[0, -0.15, 0]}>
      {/* Vòng hào quang chính: Nằm ngang hoàn toàn (xoay Math.PI / 2 theo trục X) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.035, 16, 64]} />
        <meshPhysicalMaterial
          color="#FEF08A"
          emissive="#FDE047"
          emissiveIntensity={0.65}
          metalness={0.95}
          roughness={0.1}
          clearcoat={1.0}
        />
      </mesh>

      {/* Vòng hào quang phụ mỏng hơn ở ngoài tạo hiệu ứng 2 tầng đồng tâm */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.015, 16, 64]} />
        <meshPhysicalMaterial
          color="#FFFBEB"
          emissive="#FACC15"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.15}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 4 hạt ngọc tinh tú nhỏ gắn trên vòng quay quanh theo phương ngang */}
      <mesh position={[1.7, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshPhysicalMaterial color="#FFD1DC" emissive="#FF8E9E" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-1.7, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshPhysicalMaterial color="#BAE6FD" emissive="#38BDF8" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0, 1.7]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshPhysicalMaterial color="#A7F3D0" emissive="#34D399" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0, -1.7]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshPhysicalMaterial color="#FDE047" emissive="#FACC15" emissiveIntensity={0.8} />
      </mesh>

      <Sparkles count={35} scale={[3.6, 0.8, 3.6]} size={3.5} speed={0.4} color="#FDE047" />
    </group>
  );
}

// Tier 4: Ánh kim thần thoại & Bão hạt ma thuật
function Tier4MythicGlow() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.8, 0]}>
      <Sparkles count={70} scale={4.2} size={4.5} speed={0.6} color="#FDE047" />
      <Sparkles count={45} scale={4.5} size={5.0} speed={0.4} color="#FF94B8" />
      {/* Tinh tú pha lê quỹ đạo */}
      <mesh position={[1.6, 0.3, 0.5]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshPhysicalMaterial color="#FDE047" emissive="#FBBF24" emissiveIntensity={0.9} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[-1.5, -0.2, 0.6]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshPhysicalMaterial color="#FF8E9E" emissive="#FF6B8B" emissiveIntensity={0.9} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.2, 1.3, -1.4]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshPhysicalMaterial color="#34D399" emissive="#10B981" emissiveIntensity={0.9} metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Năng lượng phát sáng từ việc Kiềm chế cám dỗ
function TemptationGlowLight({ glowEnergy }) {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.25 + 1.0;
      lightRef.current.intensity = (0.6 + Math.min(glowEnergy * 0.04, 1.8)) * pulse;
    }
  });

  if (!glowEnergy || glowEnergy <= 0) return null;

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0.9, 1.2]} color="#FDE047" distance={4.5} />
      <Sparkles count={Math.min(60, glowEnergy * 2)} scale={2.8} size={4.0} speed={0.5} color="#FACC15" />
    </>
  );
}

// ==============================================================
// 9. MAIN PROCEDURAL MONTHLY MODEL EXPORT
// ==============================================================
export default function ProceduralMonthlyModel({
  month = 11,
  streak = 0,
  tier = 1,
  glowEnergy = 0,
  onSelectDay = () => {},
}) {
  return (
    <group>
      {/* 1. Chọn mô hình sự kiện theo tháng */}
      {month === 1 && <TetApricotBonsaiModel streak={streak} onSelectDay={onSelectDay} />}
      {month === 2 && <ValentineHeartBoxModel streak={streak} onSelectDay={onSelectDay} />}
      {month === 10 && <HalloweenPumpkinModel streak={streak} onSelectDay={onSelectDay} />}
      {month === 11 && <WarmLanternModel streak={streak} onSelectDay={onSelectDay} />}
      {month === 12 && <ChristmasTreeModel streak={streak} onSelectDay={onSelectDay} />}
      {![1, 2, 10, 11, 12].includes(month) && (
        <PiggyBankCeramicModel streak={streak} onSelectDay={onSelectDay} />
      )}

      {/* 2. Nâng cấp phụ kiện theo Tier (Tuần 1 - 4) */}
      {tier >= 2 && <Tier2CoinsAccessories />}
      {tier >= 3 && <Tier3CelestialHalo />}
      {tier >= 4 && <Tier4MythicGlow />}

      {/* 3. Hiệu ứng phát sáng từ kiềm chế cám dỗ */}
      <TemptationGlowLight glowEnergy={glowEnergy} />
    </group>
  );
}

