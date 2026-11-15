import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Monthly3DModel from './Monthly3DModel';

// Đồng xu vàng 3D rơi xuống khi điểm danh
function AnimatedGoldenCoin({ active }) {
  const coinRef = useRef();

  useFrame((state, delta) => {
    if (!coinRef.current || !active) return;
    coinRef.current.rotation.y += delta * 6;
    if (coinRef.current.position.y > 0.4) {
      coinRef.current.position.y -= delta * 3.5;
    }
  });

  if (!active) return null;

  return (
    <mesh ref={coinRef} position={[0, 2.6, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.26, 0.26, 0.05, 32]} />
      <meshPhysicalMaterial
        color="#FBBF24"
        metalness={0.96}
        roughness={0.12}
        clearcoat={1.0}
        emissive="#F59E0B"
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

// Nội dung Scene Three.js
function SceneContent({
  month,
  streak,
  tier,
  glowEnergy,
  autoRotate,
  envPreset,
  coinActive,
  onSelectDay,
}) {
  const isNight = envPreset === 'galaxy';
  const isSunset = envPreset === 'sunset';

  return (
    <>
      {/* 1. Môi trường phản chiếu HDR Studio / City */}
      <Environment preset={isNight ? 'night' : isSunset ? 'sunset' : 'city'} />

      {/* 2. Hệ thống ánh sáng PBR mềm mại */}
      <ambientLight intensity={isNight ? 0.45 : isSunset ? 0.75 : 0.7} />

      {/* Key Light: Chiếu chính tạo khối và đổ bóng mềm */}
      <directionalLight
        position={[5, 9, 6]}
        intensity={isNight ? 0.9 : isSunset ? 1.5 : 1.3}
        color={isSunset ? '#FED7AA' : isNight ? '#E0E7FF' : '#FFFFFF'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* Fill Light: Làm dịu các vùng khuất */}
      <directionalLight
        position={[-6, 5, -4]}
        intensity={0.55}
        color={isNight ? '#38BDF8' : '#FFE5EC'}
      />

      {/* Rim / Back Light: Tách viền vật thể khỏi nền */}
      <directionalLight
        position={[0, 7, -6]}
        intensity={0.7}
        color={isSunset ? '#F97316' : '#FDE047'}
      />

      {/* 3. Mô hình 3D sự kiện theo tháng (Monthly3DModel) */}
      <Monthly3DModel
        month={month}
        streak={streak}
        tier={tier}
        glowEnergy={glowEnergy}
        onSelectDay={onSelectDay}
      />

      {/* 4. Rơi đồng xu vàng 3D */}
      <AnimatedGoldenCoin active={coinActive} />

      {/* 5. Đổ bóng bề mặt tiếp xúc ContactShadows bám sàn */}
      <ContactShadows
        position={[0, -0.85, 0]}
        opacity={0.65}
        scale={6.5}
        blur={2.2}
        far={4.5}
        color="#5C4B47"
      />

      {/* 6. Điều khiển xoay 360 độ mượt mà */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate={autoRotate}
        autoRotateSpeed={1.5}
        minDistance={2.4}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2 + 0.05}
      />
    </>
  );
}

// Export Scene3D Container Canvas
export default function Scene3D({
  month = 11,
  streak = 0,
  tier = 1,
  glowEnergy = 0,
  coinActive = false,
  autoRotate = true,
  envPreset = 'spring',
  onSelectDay = () => {},
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.8, 5.0], fov: 45 }}
      gl={{
        preserveDrawingBuffer: true, // Cho phép html2canvas chụp lại nội dung WebGL Canvas
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <SceneContent
        month={month}
        streak={streak}
        tier={tier}
        glowEnergy={glowEnergy}
        autoRotate={autoRotate}
        envPreset={envPreset}
        coinActive={coinActive}
        onSelectDay={onSelectDay}
      />
    </Canvas>
  );
}
