/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Cylinder, Stars, Environment, Box, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const NetworkNode = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      
      // Dynamic 3D floating (Combined vertical and subtle horizontal sway)
      ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.2;
      ref.current.position.x = position[0] + Math.cos(t * 0.3 + position[2]) * 0.1;
      ref.current.position.z = position[2] + Math.sin(t * 0.4 + position[1]) * 0.1;
      
      // Continuous complex rotation
      ref.current.rotation.x = t * 0.12;
      ref.current.rotation.z = t * 0.08;

      // Subtle "Breathing" scale effect for living tech feel
      const breathe = 1 + Math.sin(t * 0.8 + position[0]) * 0.03;
      ref.current.scale.set(scale * breathe, scale * breathe, scale * breathe);

      // Pulse the material distortion for a liquid-metal look
      if (materialRef.current) {
        materialRef.current.distort = 0.3 + Math.sin(t * 0.5) * 0.15;
      }
    }
  });

  return (
    <Sphere ref={ref} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial
        ref={materialRef}
        color={color}
        envMapIntensity={2.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.9}
        roughness={0.1}
        distort={0.4}
        speed={1.5}
      />
    </Sphere>
  );
};

const SecurityRing = () => {
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  const ref3 = useRef<THREE.Mesh>(null);
  
  const mat1 = useRef<THREE.MeshStandardMaterial>(null);
  const mat2 = useRef<THREE.MeshStandardMaterial>(null);
  const mat3 = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Ring 1: Main Gold Ring
    if (ref1.current) {
       ref1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.2;
       ref1.current.rotation.y = t * 0.1;
       ref1.current.rotation.z = Math.cos(t * 0.15) * 0.1;
       const s = 1 + Math.sin(t * 0.5) * 0.02;
       ref1.current.scale.set(s, s, s);
    }
    if (mat1.current) {
      mat1.current.emissiveIntensity = 0.4 + Math.sin(t * 1.2) * 0.2;
    }
    
    // Ring 2: Secondary Teal Ring (Faster, counter-rotation)
    if (ref2.current) {
       ref2.current.rotation.x = Math.PI / 2 + Math.cos(t * 0.3) * 0.25;
       ref2.current.rotation.y = -t * 0.15;
       ref2.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
    if (mat2.current) {
      mat2.current.emissiveIntensity = 0.3 + Math.cos(t * 0.8) * 0.15;
    }

    // Ring 3: Outer Faint Ring (Very slow, stabilizing)
    if (ref3.current) {
        ref3.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.1 + 2) * 0.1;
        ref3.current.rotation.y = t * 0.05;
    }
    if (mat3.current) {
      mat3.current.opacity = 0.1 + Math.sin(t * 0.4) * 0.05;
    }
  });

  return (
    <group>
      {/* Inner Ring - Gold */}
      <Torus ref={ref1} args={[3.5, 0.02, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial ref={mat1} color="#C5A059" emissive="#C5A059" emissiveIntensity={0.4} transparent opacity={0.6} />
      </Torus>
      
      {/* Middle Ring - Teal */}
      <Torus ref={ref2} args={[4.2, 0.015, 32, 100]} rotation={[Math.PI / 2, 0.5, 0]}>
        <meshStandardMaterial ref={mat2} color="#0D9488" emissive="#0D9488" emissiveIntensity={0.3} transparent opacity={0.4} />
      </Torus>

       {/* Outer Ring - Faint Navy/White for depth */}
      <Torus ref={ref3} args={[5.0, 0.01, 32, 100]} rotation={[Math.PI / 2, -0.2, 0]}>
        <meshStandardMaterial ref={mat3} color="#1E3A5F" emissive="#ffffff" emissiveIntensity={0.1} transparent opacity={0.15} />
      </Torus>
    </group>
  );
}

export const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#F9F8F4" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#1E3A5F" />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          {/* Main Node - Navy */}
          <NetworkNode position={[0, 0, 0]} color="#1E3A5F" scale={1.2} />
          <SecurityRing />
        </Float>
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
           {/* Secondary Node - Teal */}
           <NetworkNode position={[-3.5, 1.5, -2]} color="#0D9488" scale={0.6} />
           {/* Accent Node - Gold */}
           <NetworkNode position={[3.5, -1.5, -3]} color="#C5A059" scale={0.7} />
        </Float>

        <Environment preset="city" />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export const DataVaultScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <spotLight position={[5, 8, 5]} angle={0.4} penumbra={1} intensity={2} color="#C5A059" />
        <pointLight position={[-5, 2, -5]} intensity={1} color="#0D9488" />
        <Environment preset="studio" />
        
        <Float rotationIntensity={0.2} floatIntensity={0.3} speed={1}>
          <group rotation={[0, -0.5, 0]} position={[0, 0, 0]}>
            
            {/* Server Rack / Data Monolith */}
            <RoundedBox args={[1.8, 0.2, 1.8]} radius={0.05} smoothness={4} position={[0, -1, 0]}>
               <meshStandardMaterial color="#1E3A5F" metalness={0.8} roughness={0.2} />
            </RoundedBox>
            
            {/* Stacked Server Units */}
            {[0, 1, 2, 3].map((i) => (
                <group key={i} position={[0, -0.6 + (i * 0.5), 0]}>
                    <RoundedBox args={[1.5, 0.3, 1.5]} radius={0.02} smoothness={4}>
                         <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
                    </RoundedBox>
                    {/* Status Lights */}
                    <Box args={[1.52, 0.05, 0.05]} position={[0, 0, 0.75]}>
                        <meshStandardMaterial color={i === 2 ? "#C5A059" : "#0D9488"} emissive={i === 2 ? "#C5A059" : "#0D9488"} emissiveIntensity={2} />
                    </Box>
                </group>
            ))}

            {/* Top Security Layer */}
            <Cylinder args={[1, 1, 0.05, 64]} position={[0, 1.5, 0]}>
               <meshStandardMaterial color="#C5A059" metalness={1} roughness={0.1} />
            </Cylinder>
            
            {/* Holographic Shield Ring */}
             <Torus args={[1.2, 0.01, 16, 100]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
               <meshStandardMaterial color="#0D9488" emissive="#0D9488" emissiveIntensity={0.5} transparent opacity={0.3} />
            </Torus>
             <Torus args={[1.8, 0.01, 16, 100]} position={[0, 0.5, 0]} rotation={[0.2, 0, 0]}>
               <meshStandardMaterial color="#1E3A5F" emissive="#1E3A5F" emissiveIntensity={0.5} transparent opacity={0.3} />
            </Torus>

          </group>
        </Float>
      </Canvas>
    </div>
  );
}
