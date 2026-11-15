import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

// ==============================================================
// 1. HELPER: SMOOTH PBR PART VỚI NỘI SUY MÀU TỰ ĐỘNG (THREE.Color.lerp)
// ==============================================================
export function SmoothPBRPart({
  day,
  streak,
  tier = 1,
  materialProps = {},
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  castShadow = true,
  receiveShadow = true,
  onClick,
}) {
  const meshGroupRef = useRef();
  const isUnlocked = day <= streak;
  const isNext = day === streak + 1;

  // Màu mục tiêu PBR thật (khi đã mở khóa)
  const targetColorObj = useMemo(() => {
    return new THREE.Color(materialProps.color || '#FBBF24');
  }, [materialProps.color]);

  // Màu mục tiêu thạch cao trắng ngà (khi chưa mở khóa)
  const plasterColorObj = useMemo(() => {
    return new THREE.Color(isNext ? '#F8FAFC' : '#F1F5F9');
  }, [isNext]);

  // Tạo một vật liệu PBR độc lập cho part này để nội suy mượt mà trong useFrame
  const materialInstance = useMemo(() => {
    const initialColor = isUnlocked ? targetColorObj.clone() : plasterColorObj.clone();
    return new THREE.MeshPhysicalMaterial({
      color: initialColor,
      roughness: isUnlocked ? (materialProps.roughness ?? 0.25) : 0.72,
      metalness: isUnlocked ? (materialProps.metalness ?? 0.1) : 0.04,
      clearcoat: isUnlocked ? (materialProps.clearcoat ?? 0.8) : 0.1,
      clearcoatRoughness: materialProps.clearcoatRoughness ?? 0.1,
      transmission: materialProps.transmission ?? 0,
      thickness: materialProps.thickness ?? 0,
      transparent: Boolean(materialProps.transparent),
      opacity: materialProps.opacity ?? 1.0,
      emissive: new THREE.Color('#000000'),
      emissiveIntensity: 0,
    });
  }, []);

  // useFrame: Nội suy màu mượt mà (smooth lerp 0.8s) + nhịp thở emissive
  useFrame((state, delta) => {
    if (!materialInstance) return;

    const tSpeed = delta * 4.5; // ~0.7-0.8s chuyển đổi êm ru

    // 1. Nội suy màu sắc (color.lerp)
    const targetC = isUnlocked ? targetColorObj : plasterColorObj;
    materialInstance.color.lerp(targetC, tSpeed);

    // 2. Nội suy độ bóng & độ nhám
    const targetRough = isUnlocked ? (materialProps.roughness ?? 0.25) : 0.72;
    const targetMetal = isUnlocked ? (materialProps.metalness ?? (tier >= 2 ? 0.35 : 0.1)) : 0.04;
    const targetClearcoat = isUnlocked ? (materialProps.clearcoat ?? 0.85) : 0.1;

    materialInstance.roughness = THREE.MathUtils.lerp(materialInstance.roughness, targetRough, tSpeed);
    materialInstance.metalness = THREE.MathUtils.lerp(materialInstance.metalness, targetMetal, tSpeed);
    materialInstance.clearcoat = THREE.MathUtils.lerp(materialInstance.clearcoat, targetClearcoat, tSpeed);

    // 3. Hiệu ứng ánh nhũ ngọc trai / Iridescent Sheen cho Tier 3 & 4
    if (tier >= 3 && isUnlocked) {
      materialInstance.sheen = 0.9;
      materialInstance.sheenColor = new THREE.Color('#FFD1DC');
    } else {
      materialInstance.sheen = 0.0;
    }

    // 4. Phát sáng dẫn đường cho ngày kế tiếp (Pulse viền ngày streak + 1)
    if (isNext) {
      const pulse = Math.sin(state.clock.elapsedTime * 3.5) * 0.15 + 0.25;
      materialInstance.emissive.set('#FDE047');
      materialInstance.emissiveIntensity = THREE.MathUtils.lerp(materialInstance.emissiveIntensity, pulse, tSpeed);
    } else if (isUnlocked && materialProps.emissive) {
      materialInstance.emissive.set(materialProps.emissive);
      materialInstance.emissiveIntensity = THREE.MathUtils.lerp(
        materialInstance.emissiveIntensity,
        materialProps.emissiveIntensity ?? 0.5,
        tSpeed
      );
    } else {
      materialInstance.emissiveIntensity = THREE.MathUtils.lerp(materialInstance.emissiveIntensity, 0, tSpeed);
    }
  });

  return (
    <group
      ref={meshGroupRef}
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
          material: materialInstance,
        });
      })}
    </group>
  );
}

// ==============================================================
// 2. VÒNG SÓNG ÁNH SÁNG LAN TỎA DƯỚI MẶT ĐẾ KHI ĐIỂM DANH (COLOR WAVE)
// ==============================================================
function ExpandingCheckInWave({ activeWave }) {
  const waveMeshRef = useRef();

  useFrame((state, delta) => {
    if (!waveMeshRef.current) return;
    if (activeWave) {
      const curScale = waveMeshRef.current.scale.x;
      if (curScale < 2.4) {
        const nextScale = curScale + delta * 2.2;
        waveMeshRef.current.scale.set(nextScale, 1, nextScale);
        waveMeshRef.current.material.opacity = Math.max(0, 1.0 - (nextScale - 0.5) / 1.9);
      }
    } else {
      waveMeshRef.current.scale.set(0.4, 1, 0.4);
      waveMeshRef.current.material.opacity = 0;
    }
  });

  return (
    <mesh ref={waveMeshRef} position={[0, -0.62, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.4, 1, 0.4]}>
      <ringGeometry args={[0.9, 1.05, 48]} />
      <meshBasicMaterial color="#FDE047" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ==============================================================
// 3. NÂNG CẤP ĐẾ TRƯNG BÀY 2 TẦNG SANG TRỌNG VIỀN ROSE GOLD
// ==============================================================
function UpgradedPedestalBase({ streak, tier, onSelectDay }) {
  const isRoseGold = tier >= 2;
  const rimColor = isRoseGold ? '#F472B6' : '#F59E0B'; // Vàng hồng Rose Gold quý phái cho Tier 2+

  return (
    <SmoothPBRPart
      day={1}
      streak={streak}
      tier={tier}
      materialProps={{
        color: '#FFFFFF',
        roughness: 0.1,
        metalness: 0.05,
        clearcoat: 1.0,
      }}
      onClick={() => onSelectDay(1)}
    >
      {/* Tầng 1 (đáy): Bán kính rộng hơn */}
      <mesh position={[0, -0.76, 0]}>
        <cylinderGeometry args={[1.65, 1.75, 0.14, 64]} />
      </mesh>
      {/* Viền kim loại Rose Gold tầng đáy */}
      <mesh position={[0, -0.69, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.66, 0.035, 20, 64]} />
        <meshPhysicalMaterial
          color={rimColor}
          metalness={0.96}
          roughness={0.12}
          clearcoat={1.0}
        />
      </mesh>

      {/* Tầng 2 (trên): Mặt đá cẩm thạch trắng sứ sáng bóng */}
      <mesh position={[0, -0.64, 0]}>
        <cylinderGeometry args={[1.45, 1.5, 0.12, 64]} />
      </mesh>
      {/* Viền kim loại Rose Gold tầng trên */}
      <mesh position={[0, -0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.46, 0.035, 20, 64]} />
        <meshPhysicalMaterial
          color={rimColor}
          metalness={0.96}
          roughness={0.12}
          clearcoat={1.0}
        />
      </mesh>

      {/* Cánh hoa anh đào / ngôi sao vàng nhỏ rơi rải rác trên mặt đế */}
      <mesh position={[-0.95, -0.56, 0.6]} rotation={[0, 0.5, 0]}>
        <circleGeometry args={[0.07, 12]} />
        <meshPhysicalMaterial color="#FFD1DC" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.9, -0.56, -0.65]} rotation={[0, -0.8, 0]}>
        <circleGeometry args={[0.065, 12]} />
        <meshPhysicalMaterial color="#FFD1DC" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.2, -0.56, 1.05]} rotation={[0, 0.2, 0]}>
        <circleGeometry args={[0.06, 12]} />
        <meshPhysicalMaterial color="#FEF08A" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
    </SmoothPBRPart>
  );
}

// ==============================================================
// 4. MÔ HÌNH THÁNG 1 & 2: CÂY MAI VÀNG BONSAI TRONG CHẬU ĐỎ ĐUN
// ==============================================================
function MaiFlowerBonsaiModel({ streak, tier, onSelectDay }) {
  const envelopeRef1 = useRef();
  const envelopeRef2 = useRef();

  // Đung đưa nhẹ nhàng (micro-animation) bao lì xì theo gió
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (envelopeRef1.current) {
      envelopeRef1.current.rotation.z = 0.15 + Math.sin(time * 2.4) * 0.12;
      envelopeRef1.current.rotation.x = Math.cos(time * 1.8) * 0.08;
    }
    if (envelopeRef2.current) {
      envelopeRef2.current.rotation.z = -0.15 + Math.sin(time * 2.2 + 1) * 0.12;
      envelopeRef2.current.rotation.x = Math.cos(time * 1.6 + 1) * 0.08;
    }
  });

  const maiFlowers = useMemo(() => [
    { pos: [-0.45, 1.15, 0.35], rot: [0.2, 0.3, 0] },
    { pos: [0.55, 1.2, -0.25], rot: [-0.2, -0.4, 0] },
    { pos: [0, 1.45, 0.45], rot: [0.3, 0, 0] },
    { pos: [-0.65, 1.4, -0.15], rot: [0, -0.3, 0.2] },
    { pos: [0.65, 1.55, 0.2], rot: [0.1, 0.4, -0.2] },
    { pos: [-0.25, 1.7, 0.3], rot: [0.2, 0.1, 0] },
    { pos: [0.3, 1.75, -0.3], rot: [-0.1, -0.2, 0] },
    { pos: [0, 1.95, 0.1], rot: [0, 0, 0] },
    { pos: [-0.4, 1.85, -0.2], rot: [-0.2, -0.1, 0] },
    { pos: [0.45, 1.88, 0.15], rot: [0.2, 0.2, -0.1] },
    { pos: [0, 2.15, 0], rot: [0, 0, 0] },
  ], []);

  return (
    <group position={[0, -0.05, 0]}>
      <UpgradedPedestalBase streak={streak} tier={tier} onSelectDay={onSelectDay} />

      {/* Ngày 1: Chậu gốm sứ đỏ đun viền vàng bóng loáng */}
      <SmoothPBRPart
        day={1}
        streak={streak}
        tier={tier}
        materialProps={{ color: '#881337', roughness: 0.1, clearcoat: 1.0 }}
        onClick={() => onSelectDay(1)}
      >
        <mesh position={[0, -0.32, 0]}><cylinderGeometry args={[0.95, 0.72, 0.52, 48]} /></mesh>
        <mesh position={[0, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.045, 20, 48]} />
          <meshPhysicalMaterial color="#FBBF24" metalness={0.95} roughness={0.12} clearcoat={1.0} />
        </mesh>
        <mesh position={[0, -0.09, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.05, 32]} />
          <meshPhysicalMaterial color="#3E2723" roughness={0.9} />
        </mesh>
      </SmoothPBRPart>

      {/* Ngày 2: Thân gỗ bonsai uốn lượn mềm mại */}
      <SmoothPBRPart
        day={2}
        streak={streak}
        tier={tier}
        materialProps={{ color: '#5D4037', roughness: 0.78, clearcoat: 0.15 }}
        onClick={() => onSelectDay(2)}
      >
        <mesh position={[0, 0.23, 0]} rotation={[0.08, 0, -0.12]}><cylinderGeometry args={[0.2, 0.32, 0.65, 24]} /></mesh>
        <mesh position={[-0.06, 0.73, 0.04]} rotation={[-0.12, 0, 0.2]}><cylinderGeometry args={[0.15, 0.2, 0.55, 24]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 3: Cành phân nhánh vươn đều tứ phía */}
      <SmoothPBRPart
        day={3}
        streak={streak}
        tier={tier}
        materialProps={{ color: '#6D4C41', roughness: 0.75 }}
        onClick={() => onSelectDay(3)}
      >
        <mesh position={[-0.42, 1.08, 0.15]} rotation={[0.2, 0, 0.65]}><cylinderGeometry args={[0.08, 0.13, 0.75, 16]} /></mesh>
        <mesh position={[0.42, 1.11, -0.12]} rotation={[-0.2, 0, -0.65]}><cylinderGeometry args={[0.08, 0.13, 0.75, 16]} /></mesh>
        <mesh position={[0.05, 1.28, 0]} rotation={[0, 0, 0.1]}><cylinderGeometry args={[0.08, 0.14, 0.65, 16]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 4: Tán lá biếc xanh non */}
      <SmoothPBRPart
        day={4}
        streak={streak}
        tier={tier}
        materialProps={{ color: '#16A34A', roughness: 0.35, clearcoat: 0.5 }}
        onClick={() => onSelectDay(4)}
      >
        <mesh position={[-0.55, 1.28, 0.25]}><sphereGeometry args={[0.18, 20, 20]} /></mesh>
        <mesh position={[0.6, 1.33, -0.2]}><sphereGeometry args={[0.18, 20, 20]} /></mesh>
        <mesh position={[0, 1.53, 0.1]}><sphereGeometry args={[0.22, 20, 20]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 5: Chùm nụ hoa xanh non chúm chím */}
      <SmoothPBRPart
        day={5}
        streak={streak}
        tier={tier}
        materialProps={{ color: '#84CC16', roughness: 0.3, clearcoat: 0.6 }}
        onClick={() => onSelectDay(5)}
      >
        <mesh position={[-0.65, 1.38, 0.35]}><sphereGeometry args={[0.09, 16, 16]} /></mesh>
        <mesh position={[0.7, 1.43, -0.15]}><sphereGeometry args={[0.09, 16, 16]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 6: Hoa mai 5 cánh vàng rực rỡ nhụy đỏ cam */}
      <SmoothPBRPart
        day={6}
        streak={streak}
        tier={tier}
        materialProps={{ color: '#FBBF24', roughness: 0.18, clearcoat: 0.85 }}
        onClick={() => onSelectDay(6)}
      >
        {maiFlowers.map((flower, idx) => (
          <group key={idx} position={flower.pos} rotation={flower.rot}>
            {[0, 1, 2, 3, 4].map((i) => {
              const ang = (i * Math.PI * 2) / 5;
              return (
                <mesh key={i} position={[Math.cos(ang) * 0.11, Math.sin(ang) * 0.11, 0]}>
                  <sphereGeometry args={[0.09, 16, 16]} />
                </mesh>
              );
            })}
            <mesh position={[0, 0, 0.05]}>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshPhysicalMaterial color="#DC2626" emissive="#EF4444" emissiveIntensity={streak >= 6 ? 0.4 : 0.0} />
            </mesh>
          </group>
        ))}
      </SmoothPBRPart>

      {/* Ngày 7: Bao lì xì đỏ may mắn đung đưa & Ngôi sao đỉnh tháp */}
      <SmoothPBRPart
        day={7}
        streak={streak}
        tier={tier}
        materialProps={{ color: '#DC2626', roughness: 0.3, clearcoat: 0.6 }}
        onClick={() => onSelectDay(7)}
      >
        {/* Bao lì xì 1 có micro-animation */}
        <group ref={envelopeRef1} position={[-0.35, 0.98, 0.4]} rotation={[0, 0.3, 0.15]}>
          <mesh><boxGeometry args={[0.16, 0.26, 0.025]} /></mesh>
          <mesh position={[0, 0.04, 0.02]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshPhysicalMaterial color="#FBBF24" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
        {/* Bao lì xì 2 */}
        <group ref={envelopeRef2} position={[0.4, 1.01, -0.28]} rotation={[0, -0.4, -0.15]}>
          <mesh><boxGeometry args={[0.16, 0.26, 0.025]} /></mesh>
          <mesh position={[0, 0.04, 0.02]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshPhysicalMaterial color="#FBBF24" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
        {/* Ngôi sao vàng đỉnh tháp */}
        <mesh position={[0, 2.41, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshPhysicalMaterial color="#FBBF24" metalness={0.96} roughness={0.12} emissive="#F59E0B" emissiveIntensity={streak >= 7 ? 0.6 : 0.0} clearcoat={1.0} />
        </mesh>
      </SmoothPBRPart>
    </group>
  );
}

// ==============================================================
// 5. MÔ HÌNH THÁNG 10: QUẢ BÍ NGÔ JACK-O'-LANTERN HALLOWEEN
// ==============================================================
function JackPumpkinHalloweenModel({ streak, tier, onSelectDay }) {
  const pumpkinLobes = useMemo(() => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (i * Math.PI) / 4), []);

  return (
    <group position={[0, 0.15, 0]}>
      <UpgradedPedestalBase streak={streak} tier={tier} onSelectDay={onSelectDay} />

      {/* Ngày 1: Đụn rơm vàng */}
      <SmoothPBRPart day={1} streak={streak} tier={tier} materialProps={{ color: '#451A03', roughness: 0.85 }} onClick={() => onSelectDay(1)}>
        <mesh position={[0, -0.52, 0]}><cylinderGeometry args={[1.1, 1.28, 0.16, 48]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 2: Thân bí ngô 8 múi tròn căng bóng */}
      <SmoothPBRPart day={2} streak={streak} tier={tier} materialProps={{ color: '#EA580C', roughness: 0.26, clearcoat: 0.85 }} onClick={() => onSelectDay(2)}>
        {pumpkinLobes.map((angle, idx) => (
          <mesh key={idx} position={[Math.cos(angle) * 0.22, 0.08, Math.sin(angle) * 0.22]} scale={[0.72, 1.0, 0.72]}>
            <sphereGeometry args={[0.82, 32, 32]} />
          </mesh>
        ))}
      </SmoothPBRPart>

      {/* Ngày 3: Cuống bí xanh uốn lượn */}
      <SmoothPBRPart day={3} streak={streak} tier={tier} materialProps={{ color: '#15803D', roughness: 0.65, clearcoat: 0.4 }} onClick={() => onSelectDay(3)}>
        <mesh position={[0, 0.98, 0]} rotation={[0.2, 0, 0.25]}><cylinderGeometry args={[0.07, 0.14, 0.42, 24]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 4: Mắt tam giác & Miệng cười phát sáng */}
      <SmoothPBRPart day={4} streak={streak} tier={tier} materialProps={{ color: '#FEF08A', emissive: '#F97316', emissiveIntensity: streak >= 4 ? 1.4 : 0.0 }} onClick={() => onSelectDay(4)}>
        <mesh position={[-0.3, 0.25, 0.82]} rotation={[0, -0.35, 0]}><coneGeometry args={[0.14, 0.18, 3]} /></mesh>
        <mesh position={[0.3, 0.25, 0.82]} rotation={[0, 0.35, 0]}><coneGeometry args={[0.14, 0.18, 3]} /></mesh>
        <mesh position={[0, -0.13, 0.86]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.32, 0.28, 3]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 5: Lửa ma thuật ấm áp bên trong ruột bí */}
      <SmoothPBRPart day={5} streak={streak} tier={tier} materialProps={{ color: '#FDE047', emissive: '#F59E0B', emissiveIntensity: streak >= 5 ? 1.8 : 0.0 }} onClick={() => onSelectDay(5)}>
        <mesh position={[0, 0.08, 0.35]}><sphereGeometry args={[0.12, 16, 16]} /></mesh>
        <pointLight position={[0, 0.12, 0.55]} color="#F97316" intensity={streak >= 5 ? 1.8 : 0.2} distance={4.5} />
      </SmoothPBRPart>

      {/* Ngày 6: Chiếc mũ phù thủy màu tím viền vàng */}
      <SmoothPBRPart day={6} streak={streak} tier={tier} materialProps={{ color: '#4C1D95', roughness: 0.75, clearcoat: 0.3 }} onClick={() => onSelectDay(6)}>
        <mesh position={[0, 1.01, 0]}><cylinderGeometry args={[0.9, 0.9, 0.05, 48]} /></mesh>
        <mesh position={[0, 1.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.04, 16, 48]} />
          <meshPhysicalMaterial color="#FBBF24" metalness={0.95} roughness={0.12} clearcoat={1.0} />
        </mesh>
        <mesh position={[0, 1.65, -0.05]} rotation={[-0.1, 0, 0]}><coneGeometry args={[0.5, 1.25, 48]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 7: Ngôi sao phép thuật đỉnh nón */}
      <SmoothPBRPart day={7} streak={streak} tier={tier} materialProps={{ color: '#FDE047', metalness: 0.96, emissive: '#F59E0B', emissiveIntensity: streak >= 7 ? 0.6 : 0.0 }} onClick={() => onSelectDay(7)}>
        <mesh position={[0, 2.35, -0.1]}><octahedronGeometry args={[0.22, 0]} /></mesh>
      </SmoothPBRPart>
    </group>
  );
}

// ==============================================================
// 6. MÔ HÌNH THÁNG 12: CÂY THÔNG NOEL 4 TẦNG TUYẾT & QUẢ CHÂU
// ==============================================================
function ChristmasPineTreeModel({ streak, tier, onSelectDay }) {
  const baubleRef1 = useRef();
  const baubleRef2 = useRef();

  // Đung đưa khẽ các quả châu kim loại (micro-animation)
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (baubleRef1.current) {
      baubleRef1.current.position.y = 0.45 + Math.sin(time * 2.2) * 0.03;
    }
    if (baubleRef2.current) {
      baubleRef2.current.position.y = 0.95 + Math.sin(time * 2.5 + 1.2) * 0.03;
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      <UpgradedPedestalBase streak={streak} tier={tier} onSelectDay={onSelectDay} />

      {/* Ngày 1: Chậu gỗ mộc đai vàng & Gốc thông */}
      <SmoothPBRPart day={1} streak={streak} tier={tier} materialProps={{ color: '#78350F', roughness: 0.8 }} onClick={() => onSelectDay(1)}>
        <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.48, 0.4, 0.52, 32]} /></mesh>
        <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.48, 0.03, 16, 32]} />
          <meshPhysicalMaterial color="#FBBF24" metalness={0.95} roughness={0.12} clearcoat={1.0} />
        </mesh>
      </SmoothPBRPart>

      {/* Ngày 2: Tầng lá thông thứ nhất phủ tuyết trắng mịn ở rìa */}
      <SmoothPBRPart day={2} streak={streak} tier={tier} materialProps={{ color: '#166534', roughness: 0.45 }} onClick={() => onSelectDay(2)}>
        <mesh position={[0, 0.35, 0]}><coneGeometry args={[1.3, 0.85, 36]} /></mesh>
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.25, 0.045, 16, 48]} />
          <meshPhysicalMaterial color="#F8FAFC" roughness={0.25} clearcoat={0.9} />
        </mesh>
      </SmoothPBRPart>

      {/* Ngày 3: Tầng lá thông thứ hai */}
      <SmoothPBRPart day={3} streak={streak} tier={tier} materialProps={{ color: '#15803D', roughness: 0.45 }} onClick={() => onSelectDay(3)}>
        <mesh position={[0, 0.93, 0]}><coneGeometry args={[1.05, 0.78, 36]} /></mesh>
        <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.04, 16, 48]} />
          <meshPhysicalMaterial color="#F8FAFC" roughness={0.25} clearcoat={0.9} />
        </mesh>
      </SmoothPBRPart>

      {/* Ngày 4: Tầng lá thông thứ ba & thứ tư */}
      <SmoothPBRPart day={4} streak={streak} tier={tier} materialProps={{ color: '#22C55E', roughness: 0.4 }} onClick={() => onSelectDay(4)}>
        <mesh position={[0, 1.48, 0]}><coneGeometry args={[0.78, 0.7, 36]} /></mesh>
        <mesh position={[0, 1.98, 0]}><coneGeometry args={[0.5, 0.65, 36]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 5: Dây ruy băng vàng ôm ngang ngoài tán cây (KHÔNG đâm xuyên) */}
      <SmoothPBRPart day={5} streak={streak} tier={tier} materialProps={{ color: '#F59E0B', metalness: 0.92, clearcoat: 1.0 }} onClick={() => onSelectDay(5)}>
        <mesh position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.02, 0.028, 16, 48]} /></mesh>
        <mesh position={[0, 1.13, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.76, 0.024, 16, 48]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 6: Hàng chục quả châu kim loại phản chiếu bóng loáng (có micro-animation) */}
      <SmoothPBRPart day={6} streak={streak} tier={tier} materialProps={{ color: '#DC2626', metalness: 0.98, roughness: 0.08, clearcoat: 1.0 }} onClick={() => onSelectDay(6)}>
        <mesh ref={baubleRef1} position={[0.7, 0.48, 0.65]}><sphereGeometry args={[0.13, 24, 24]} /></mesh>
        <mesh ref={baubleRef2} position={[-0.65, 0.98, 0.45]}><sphereGeometry args={[0.11, 24, 24]} /></mesh>
        <mesh position={[-0.75, 0.43, -0.6]}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshPhysicalMaterial color="#FBBF24" metalness={0.98} roughness={0.08} clearcoat={1.0} />
        </mesh>
        <mesh position={[-0.7, -0.39, 0.55]}><boxGeometry args={[0.34, 0.34, 0.34]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 7: Ngôi sao vàng 5 cánh phát sáng rực rỡ đỉnh ngọn */}
      <SmoothPBRPart day={7} streak={streak} tier={tier} materialProps={{ color: '#FDE047', metalness: 0.96, emissive: '#F59E0B', emissiveIntensity: streak >= 7 ? 0.8 : 0.0, clearcoat: 1.0 }} onClick={() => onSelectDay(7)}>
        <mesh position={[0, 2.48, 0]}><octahedronGeometry args={[0.28, 0]} /></mesh>
      </SmoothPBRPart>
    </group>
  );
}

// ==============================================================
// 7. MÔ HÌNH MẶC ĐỊNH / CÁC THÁNG KHÁC: HEO ĐẤT GỐM SỨ KAWAII
// ==============================================================
function KawaiiPiggyBankModel({ streak, tier, onSelectDay }) {
  const coinRef1 = useRef();

  useFrame((state) => {
    if (coinRef1.current) {
      // Nhấp nhô nhẹ đồng xu vàng (micro-animation)
      coinRef1.current.position.y = -0.45 + Math.sin(state.clock.elapsedTime * 2.0) * 0.02;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      <UpgradedPedestalBase streak={streak} tier={tier} onSelectDay={onSelectDay} />

      {/* Ngày 1: Đệm mây tròn */}
      <SmoothPBRPart day={1} streak={streak} tier={tier} materialProps={{ color: '#FFF5F7', roughness: 0.5 }} onClick={() => onSelectDay(1)}>
        <mesh position={[0, -0.52, 0]}><cylinderGeometry args={[1.2, 1.35, 0.16, 48]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 2: Thân heo đất gốm sứ hồng pastel tráng men bóng */}
      <SmoothPBRPart day={2} streak={streak} tier={tier} materialProps={{ color: '#FFB7C5', roughness: 0.08, clearcoat: 1.0 }} onClick={() => onSelectDay(2)}>
        <mesh position={[0, 0.18, 0]} scale={[1.25, 1.05, 1.0]}><sphereGeometry args={[0.85, 48, 48]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 3: 4 chân ngắn tròn trịa & Chiếc đuôi xoắn ốc */}
      <SmoothPBRPart day={3} streak={streak} tier={tier} materialProps={{ color: '#FFA4B6', roughness: 0.12, clearcoat: 0.9 }} onClick={() => onSelectDay(3)}>
        <mesh position={[-0.45, -0.39, 0.35]}><cylinderGeometry args={[0.13, 0.11, 0.32, 24]} /></mesh>
        <mesh position={[0.45, -0.39, 0.35]}><cylinderGeometry args={[0.13, 0.11, 0.32, 24]} /></mesh>
        <mesh position={[-0.45, -0.39, -0.35]}><cylinderGeometry args={[0.13, 0.11, 0.32, 24]} /></mesh>
        <mesh position={[0.45, -0.39, -0.35]}><cylinderGeometry args={[0.13, 0.11, 0.32, 24]} /></mesh>
        <mesh position={[1.1, 0.23, 0]} rotation={[0, 0, 0.5]}><torusGeometry args={[0.12, 0.035, 16, 32]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 4: Mõm tròn 2 lỗ & Đôi tai cụp mềm mại */}
      <SmoothPBRPart day={4} streak={streak} tier={tier} materialProps={{ color: '#FF8E9E', roughness: 0.14, clearcoat: 0.85 }} onClick={() => onSelectDay(4)}>
        <mesh position={[-0.95, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.26, 0.28, 0.18, 32]} /></mesh>
        <mesh position={[-0.38, 0.85, 0.35]} rotation={[0.4, 0, -0.4]}><coneGeometry args={[0.18, 0.35, 24]} /></mesh>
        <mesh position={[-0.38, 0.85, -0.35]} rotation={[-0.4, 0, -0.4]}><coneGeometry args={[0.18, 0.35, 24]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 5: Đôi mắt đen láy mỉm cười & Đôi má hồng đào */}
      <SmoothPBRPart day={5} streak={streak} tier={tier} materialProps={{ color: '#1E293B', roughness: 0.1, clearcoat: 1.0 }} onClick={() => onSelectDay(5)}>
        <mesh position={[-0.85, 0.41, 0.28]}><sphereGeometry args={[0.065, 20, 20]} /></mesh>
        <mesh position={[-0.85, 0.41, -0.28]}><sphereGeometry args={[0.065, 20, 20]} /></mesh>
        <mesh position={[-0.78, 0.23, 0.45]}><sphereGeometry args={[0.1, 20, 20]} /><meshPhysicalMaterial color="#FF6B8B" roughness={0.3} clearcoat={0.7} /></mesh>
        <mesh position={[-0.78, 0.23, -0.45]}><sphereGeometry args={[0.1, 20, 20]} /><meshPhysicalMaterial color="#FF6B8B" roughness={0.3} clearcoat={0.7} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 6: Khe nhét tiền mạ vàng trên lưng heo */}
      <SmoothPBRPart day={6} streak={streak} tier={tier} materialProps={{ color: '#F59E0B', metalness: 0.96, roughness: 0.1, clearcoat: 1.0 }} onClick={() => onSelectDay(6)}>
        <mesh position={[0, 1.05, 0]}><boxGeometry args={[0.38, 0.05, 0.07]} /></mesh>
      </SmoothPBRPart>

      {/* Ngày 7: Đồng xu vàng kim loại xếp chồng bên cạnh chân */}
      <SmoothPBRPart day={7} streak={streak} tier={tier} materialProps={{ color: '#FBBF24', metalness: 0.96, roughness: 0.1, clearcoat: 1.0 }} onClick={() => onSelectDay(7)}>
        <mesh ref={coinRef1} position={[-0.82, -0.45, 0.7]} rotation={[Math.PI / 2, 0.2, 0]}><cylinderGeometry args={[0.2, 0.2, 0.045, 32]} /></mesh>
        <mesh position={[-0.72, -0.41, 0.75]} rotation={[Math.PI / 2, -0.1, 0]}><cylinderGeometry args={[0.2, 0.2, 0.045, 32]} /></mesh>
        <mesh position={[0.82, -0.45, -0.7]} rotation={[Math.PI / 2, -0.3, 0]}><cylinderGeometry args={[0.2, 0.2, 0.045, 32]} /></mesh>
        <mesh position={[-0.28, 1.23, 0]}><octahedronGeometry args={[0.18, 0]} /></mesh>
      </SmoothPBRPart>
    </group>
  );
}

// ==============================================================
// 8. VÒNG HÀO QUANG KÉP CHUYỂN MÀU CẦU VỒNG PASTEL DỊU MẮT (TIER 3-4)
// ==============================================================
function HorizontalHaloPedestalRing({ tier }) {
  const haloRef = useRef();
  const innerMatRef = useRef();

  useFrame((state, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.y += delta * 0.6;
    }
    // Chuyển sắc thái dải màu cầu vồng pastel nhẹ dịu cho Tier 3 & 4
    if (innerMatRef.current && tier >= 3) {
      const hue = (state.clock.elapsedTime * 0.08) % 1.0;
      innerMatRef.current.color.setHSL(hue, 0.75, 0.75);
      innerMatRef.current.emissive.setHSL(hue, 0.85, 0.55);
    }
  });

  return (
    <group ref={haloRef} position={[0, -0.55, 0]}>
      {/* Vòng chính nằm ngang ôm sát bệ */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.75, 0.035, 20, 64]} />
        <meshPhysicalMaterial
          ref={innerMatRef}
          color="#FEF08A"
          emissive="#FDE047"
          emissiveIntensity={0.7}
          metalness={0.96}
          roughness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {/* Vòng phụ mỏng bên ngoài */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.95, 0.016, 16, 64]} />
        <meshPhysicalMaterial
          color="#FFFBEB"
          emissive="#FACC15"
          emissiveIntensity={0.4}
          metalness={0.9}
          transparent
          opacity={0.75}
        />
      </mesh>
    </group>
  );
}

// ==============================================================
// 9. MAIN COMPONENT: MONTHLY 3D MODEL
// ==============================================================
export default function Monthly3DModel({
  month = 11,
  streak = 0,
  tier = 1,
  glowEnergy = 0,
  onSelectDay = () => {},
}) {
  const prevStreakRef = useRef(streak);
  const [activeWave, setActiveWave] = React.useState(false);
  const groupBreathRef = useRef();

  // Phát hiện streak vừa tăng -> kích hoạt Color Wave / Pulse
  useEffect(() => {
    if (streak > prevStreakRef.current) {
      setActiveWave(true);
      const timer = setTimeout(() => setActiveWave(false), 1400);
      return () => clearTimeout(timer);
    }
    prevStreakRef.current = streak;
  }, [streak]);

  // Micro-animation: Nhịp thở nhún êm ái toàn thân
  useFrame((state) => {
    if (groupBreathRef.current) {
      groupBreathRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.025;
    }
  });

  const modelContent = (
    <group ref={groupBreathRef}>
      {/* 1. Sóng ánh sáng Color Wave lan tỏa khi điểm danh */}
      <ExpandingCheckInWave activeWave={activeWave} />

      {/* 2. Chọn mô hình theo tháng */}
      {(month === 1 || month === 2) && (
        <MaiFlowerBonsaiModel streak={streak} tier={tier} onSelectDay={onSelectDay} />
      )}
      {month === 10 && (
        <JackPumpkinHalloweenModel streak={streak} tier={tier} onSelectDay={onSelectDay} />
      )}
      {month === 12 && (
        <ChristmasPineTreeModel streak={streak} tier={tier} onSelectDay={onSelectDay} />
      )}
      {![1, 2, 10, 12].includes(month) && (
        <KawaiiPiggyBankModel streak={streak} tier={tier} onSelectDay={onSelectDay} />
      )}

      {/* 3. Hiệu ứng Hào quang khi streak === 7 hoặc tier >= 3 */}
      {(streak >= 7 || tier >= 3) && <HorizontalHaloPedestalRing tier={tier} />}

      {/* 4. Hiệu ứng hạt lấp lánh (Sparkles) quanh đế */}
      {(streak >= 7 || tier >= 3) && (
        <Sparkles
          count={streak >= 7 ? 65 : 35}
          scale={[3.8, 1.2, 3.8]}
          size={streak >= 7 ? 4.5 : 3.5}
          speed={0.5}
          color="#FDE047"
        />
      )}

      {/* 5. Năng lượng phát sáng từ Kiềm Chế Cám Dỗ */}
      {glowEnergy > 0 && (
        <>
          <pointLight position={[0, 0.8, 1.0]} color="#FDE047" intensity={Math.min(glowEnergy * 0.04, 1.6)} distance={4.5} />
          <Sparkles count={Math.min(50, glowEnergy * 2)} scale={[3.0, 1.0, 3.0]} size={3.8} speed={0.5} color="#FACC15" />
        </>
      )}
    </group>
  );

  // Tuần 2 trở lên (tier >= 2) tự động kích hoạt hiệu ứng nổi bồng bềnh
  if (tier >= 2) {
    return (
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {modelContent}
      </Float>
    );
  }

  return modelContent;
}
