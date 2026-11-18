import React from 'react';
import { Product } from '../types/commerce';

export type VisualAngle = 'front' | 'side' | 'ports' | 'lifestyle' | 'exploded';

interface HardwareVisualProps {
  type: Product['visualType'];
  finishHex?: string;
  angle?: VisualAngle;
  className?: string;
  rotationDeg?: number;
}

export const HardwareVisual: React.FC<HardwareVisualProps> = ({
  type,
  finishHex = '#262629',
  angle = 'front',
  className = '',
  rotationDeg = 0,
}) => {
  const frameStroke = finishHex === '#F1F5F9' || finishHex === '#F3F4F6' ? '#94A3B8' : finishHex;
  const isLightFrame =
    finishHex.toUpperCase() === '#CBD5E1' ||
    finishHex.toUpperCase() === '#D1D5DB' ||
    finishHex.toUpperCase() === '#E5E7EB' ||
    finishHex.toUpperCase() === '#F1F5F9' ||
    finishHex.toUpperCase() === '#F3F4F6';

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F4F5F7] via-[#FAFAFA] to-[#ECEEF2] select-none ${className}`}
    >
      <div
        className="w-full h-full flex items-center justify-center p-5 transition-transform duration-300"
        style={{
          transform: rotationDeg !== 0 ? `perspective(900px) rotateY(${rotationDeg}deg)` : undefined,
        }}
      >
        {angle === 'exploded' ? (
          <svg viewBox="0 0 320 240" className="w-full h-full max-w-[280px]" aria-label="하드웨어 3D 분해 아키텍처">
            <defs>
              <linearGradient id="chipGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0043CD" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#1259FF" stopOpacity="0.06" />
              </linearGradient>
            </defs>
            {/* Rear Titanium Chassis */}
            <rect x="64" y="42" width="192" height="118" rx="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Vapor Chamber Layer */}
            <rect x="76" y="54" width="168" height="94" rx="6" fill="url(#chipGlow)" stroke="#0043CD" strokeWidth="1.2" strokeDasharray="4 3" />
            {/* Neural Chip Core */}
            <rect x="132" y="76" width="56" height="50" rx="6" fill="#18181B" stroke="#0043CD" strokeWidth="2" />
            <rect x="144" y="88" width="32" height="26" rx="3" fill="#0043CD" />
            <circle cx="160" cy="101" r="4" fill="#FFFFFF" />
            {/* Copper Heat Pipes */}
            <path d="M90 101 H132 M188 101 H230 M160 58 V76 M160 126 V144" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            {/* Glass Layer Offset */}
            <rect x="44" y="64" width="192" height="118" rx="8" fill="#FFFFFF" fillOpacity="0.45" stroke={frameStroke} strokeWidth="2" />
            <text x="160" y="206" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="monospace">
              NQ8 NEURAL CORE · 3NM ARCHITECTURE
            </text>
          </svg>
        ) : angle === 'ports' ? (
          <svg viewBox="0 0 320 240" className="w-full h-full max-w-[280px]" aria-label="후면 I/O 포트 레이아웃">
            <rect x="36" y="52" width="248" height="128" rx="12" fill={isLightFrame ? '#E2E8F0' : '#27272A'} stroke={frameStroke} strokeWidth="2" />
            <rect x="52" y="72" width="216" height="44" rx="6" fill="#111827" />
            {/* HDMI Ports */}
            <rect x="66" y="86" width="24" height="10" rx="2" fill="#334155" stroke="#64748B" strokeWidth="1" />
            <rect x="98" y="86" width="24" height="10" rx="2" fill="#334155" stroke="#64748B" strokeWidth="1" />
            <rect x="130" y="86" width="24" height="10" rx="2" fill="#334155" stroke="#64748B" strokeWidth="1" />
            {/* USB-C Ports */}
            <rect x="168" y="87" width="16" height="8" rx="4" fill="#0043CD" />
            <rect x="192" y="87" width="16" height="8" rx="4" fill="#0043CD" />
            {/* Optical & LAN */}
            <rect x="220" y="84" width="14" height="14" rx="2" fill="#475569" />
            <rect x="242" y="84" width="14" height="14" rx="2" fill="#475569" />
            {/* Cable Channel */}
            <path d="M160 116 V168" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <text x="160" y="204" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="600" fontFamily="monospace">
              ONE-CONNECT I/O · HDMI 2.1 × 4 · USB-C PD
            </text>
          </svg>
        ) : angle === 'side' ? (
          <svg viewBox="0 0 320 240" className="w-full h-full max-w-[280px]" aria-label="초슬림 측면 프로파일">
            {/* Base Pedestal */}
            <path d="M110 198 H210 L196 184 H124 Z" fill={frameStroke} />
            <rect x="156" y="152" width="8" height="34" fill={frameStroke} />
            {/* Ultra-slim angled chassis */}
            <polygon points="148,36 168,42 168,162 148,156" fill={frameStroke} />
            <line x1="168" y1="42" x2="168" y2="162" stroke="#0043CD" strokeWidth="2.5" />
            <line x1="184" y1="36" x2="184" y2="162" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
            <text x="208" y="102" fill="#0043CD" fontSize="11" fontWeight="700" fontFamily="monospace">
              13.3mm
            </text>
            <text x="160" y="218" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="600" fontFamily="monospace">
              INFINITY AIR PROFILE · ZERO GAP MOUNT
            </text>
          </svg>
        ) : type === 'audio' ? (
          <svg viewBox="0 0 320 240" className="w-full h-full max-w-[280px]" aria-label="공간 오디오 하드웨어">
            {/* Soundbar */}
            <rect x="28" y="128" width="194" height="36" rx="10" fill={frameStroke} />
            <rect x="36" y="136" width="178" height="20" rx="5" fill="#18181B" fillOpacity="0.45" />
            {/* Acoustic Grille Dots */}
            {[50, 70, 90, 110, 130, 150, 170, 190].map((cx) => (
              <circle key={cx} cx={cx} cy="146" r="2.2" fill="#94A3B8" />
            ))}
            {/* Wireless Subwoofer */}
            <rect x="234" y="84" width="58" height="82" rx="10" fill={frameStroke} />
            <circle cx="263" cy="126" r="18" fill="#111827" stroke="#475569" strokeWidth="2" />
            <circle cx="263" cy="126" r="7" fill="#0043CD" fillOpacity="0.7" />
            {/* Sound Waves */}
            <path d="M90 106 Q125 84 160 106" fill="none" stroke="#0043CD" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
            <path d="M72 94 Q125 62 178 94" fill="none" stroke="#0043CD" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : type === 'hub' ? (
          <svg viewBox="0 0 320 240" className="w-full h-full max-w-[280px]" aria-label="스마트 홈 에지 허브">
            {/* Outer Ambient Ring */}
            <circle cx="160" cy="116" r="76" fill="none" stroke="#0043CD" strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="5 4" />
            {/* Hub Body */}
            <rect x="96" y="76" width="128" height="80" rx="28" fill={isLightFrame ? '#FFFFFF' : frameStroke} stroke="#CBD5E1" strokeWidth="2" />
            {/* Center Status Ring */}
            <circle cx="160" cy="116" r="22" fill="none" stroke="#0043CD" strokeWidth="3" />
            <circle cx="160" cy="116" r="6" fill="#0043CD" />
            {/* Connected Node Rays */}
            <circle cx="72" cy="70" r="5" fill="#475569" />
            <circle cx="248" cy="70" r="5" fill="#475569" />
            <circle cx="72" cy="162" r="5" fill="#475569" />
            <circle cx="248" cy="162" r="5" fill="#475569" />
            <line x1="78" y1="74" x2="106" y2="92" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="242" y1="74" x2="214" y2="92" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="78" y1="158" x2="106" y2="140" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="242" y1="158" x2="214" y2="140" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" />
          </svg>
        ) : type === 'b2b' ? (
          <svg viewBox="0 0 320 240" className="w-full h-full max-w-[280px]" aria-label="B2B 사이니지 클러스터">
            {/* Triple Architectural Signage Wall */}
            <rect x="34" y="54" width="76" height="122" rx="6" fill={frameStroke} />
            <rect x="40" y="60" width="64" height="110" rx="3" fill="#0F172A" />
            <rect x="122" y="44" width="76" height="132" rx="6" fill={frameStroke} />
            <rect x="128" y="50" width="64" height="120" rx="3" fill="#031C38" />
            <rect x="210" y="54" width="76" height="122" rx="6" fill={frameStroke} />
            <rect x="216" y="60" width="64" height="110" rx="3" fill="#0F172A" />
            {/* Data Visualization Lines */}
            <path d="M50 130 L64 114 L78 122 L94 96" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            <rect x="138" y="76" width="44" height="6" rx="3" fill="#1259FF" />
            <rect x="138" y="90" width="32" height="4" rx="2" fill="#94A3B8" />
            <rect x="138" y="102" width="38" height="4" rx="2" fill="#64748B" />
            <circle cx="248" cy="112" r="16" fill="none" stroke="#1259FF" strokeWidth="3" />
          </svg>
        ) : (
          /* Display / OLED Default Front / Lifestyle */
          <svg viewBox="0 0 320 240" className="w-full h-full max-w-[280px]" aria-label="프리미엄 아키텍처 디스플레이">
            <defs>
              <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={type === 'oled' ? '#090D16' : '#031C38'} />
                <stop offset="55%" stopColor={type === 'oled' ? '#172554' : '#0043CD'} />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
            </defs>
            {/* Stand Base */}
            <path d="M114 196 H206 L196 184 H124 Z" fill={frameStroke} />
            <rect x="152" y="168" width="16" height="18" fill={frameStroke} />
            {/* Ultra-Thin Frame */}
            <rect x="34" y="40" width="252" height="132" rx="8" fill={frameStroke} />
            {/* Screen Canvas */}
            <rect x="40" y="46" width="240" height="120" rx="5" fill="url(#screenGrad)" />
            {/* Architectural Light Geometry inside Display */}
            <circle cx="196" cy="96" r="44" fill="#3B82F6" fillOpacity="0.22" />
            <path d="M62 144 C105 92, 162 134, 212 82 C234 60, 256 72, 266 84" fill="none" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
            {angle === 'lifestyle' && (
              <rect x="52" y="58" width="74" height="22" rx="4" fill="#FFFFFF" fillOpacity="0.14" />
            )}
            {/* Bottom Status Micro-Bar */}
            <rect x="150" y="169" width="20" height="2" rx="1" fill="#94A3B8" />
          </svg>
        )}
      </div>
    </div>
  );
};
