import React from "react";

interface SevantaLogoProps {
  className?: string;
  size?: number;
}

export default function SevantaLogo({ className = "", size = 120 }: SevantaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" /> {/* sky-400 */}
          <stop offset="60%" stopColor="#0284c7" /> {/* sky-600 */}
          <stop offset="100%" stopColor="#0369a1" /> {/* sky-700 */}
        </linearGradient>
        
        <linearGradient id="hatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" /> {/* blue-900 */}
          <stop offset="100%" stopColor="#0f172a" /> {/* slate-900 */}
        </linearGradient>

        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0f9ff" /> {/* cyan-50/sky-50 */}
          <stop offset="100%" stopColor="#e0f2fe" /> {/* sky-100 */}
        </linearGradient>

        {/* Text Curves */}
        {/* d="M startX startY A rx ry x-axis-rotation large-arc-flag sweep-flag endX endY" */}
        {/* Top curve going left-to-right on top dome of circle */}
        <path
          id="topTextCurve"
          d="M 28 92 A 72 72 0 0 1 172 92"
          fill="none"
        />
        
        {/* Bottom curve going right-to-left on bottom dome of circle so text reads upright */}
        <path
          id="bottomTextCurve"
          d="M 174 108 A 74 74 0 0 1 26 108"
          fill="none"
        />
      </defs>

      {/* Main Base Light Circular Background */}
      <circle cx="100" cy="100" r="88" fill="url(#bgGrad)" stroke="#bdecfe" strokeWidth="1.5" />
      
      {/* Subtle Inner Accent Blue Shadow Circle */}
      <circle cx="100" cy="100" r="82" fill="none" stroke="#bae6fd" strokeWidth="0.75" strokeDasharray="3 3" />

      {/* 1. Curved Text "sevanta" on Top */}
      <text fill="#0f172a" className="font-sans">
        <textPath
          href="#topTextCurve"
          startOffset="50%"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          letterSpacing="1.2"
        >
          sevanta
        </textPath>
      </text>

      {/* 2. Curved Text Slogan "TRUSTED MEDIATION TRADE WITHOUT LIMITS" at Bottom */}
      <text fill="#1e293b" className="font-sans">
        <textPath
          href="#bottomTextCurve"
          startOffset="50%"
          textAnchor="middle"
          fontSize="7.2"
          fontWeight="800"
          letterSpacing="0.8"
        >
          TRUSTED MEDIATION TRADE WITHOUT LIMITS
        </textPath>
      </text>

      {/* --- GRAPHICS GROUP (Fish, Hat, Fishing Line) --- */}
      <g transform="translate(10, 10)">
        
        {/* A. Passive Water Ripple Details behind Fish */}
        <circle cx="90" cy="95" r="45" fill="#e0f2fe" opacity="0.6" />
        <circle cx="85" cy="95" r="30" fill="#bae6fd" opacity="0.3" />

        {/* B. The Curved Fishing Line (Greenish/black wire) */}
        <path
          d="M 134 45 C 160 50, 170 120, 110 135 C 70 145, 20 115, 30 75 C 33 60, 42 55, 55 60"
          fill="none"
          stroke="#3f6212"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        
        {/* The Float/Lure hanging on the left side of the line */}
        <g transform="translate(48, 85)">
          {/* Lure Feather / Thread */}
          <path d="M -5 -8 Q -10 -2, -6 5" fill="none" stroke="#2563eb" strokeWidth="0.8" />
          <path d="M -5 -8 Q 0 -2, -3 5" fill="none" stroke="#0284c7" strokeWidth="0.8" />
          {/* Lure Bobber */}
          <ellipse cx="-5" cy="-8" rx="3.5" ry="7" fill="#0284c7" stroke="#172554" strokeWidth="0.75" />
          <rect x="-8.5" y="-9.5" width="7" height="3" fill="#38bdf8" />
          <line x1="-5" y1="-15" x2="-5" y2="-1" stroke="#374151" strokeWidth="0.5" />
        </g>

        {/* C. The Determined Fish Character */}
        {/* Fish Tail / Fin */}
        <path
          d="M 68 126 C 53 133, 44 126, 42 110 C 44 104, 52 108, 62 112 Z"
          fill="#0284c7"
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        
        {/* Tail Ridges */}
        <path d="M 45 120 Q 52 118, 58 116" fill="none" stroke="#0f172a" strokeWidth="1" />
        <path d="M 48 125 Q 56 122, 60 119" fill="none" stroke="#0f172a" strokeWidth="1" />

        {/* Spiky Back Fins (Dorsal Fin) */}
        <path
          d="M 102 62 C 114 48, 137 54, 142 66 C 137 72, 134 76, 118 78 Z"
          fill="#0284c7"
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Spikes design details */}
        <path d="M 112 55 L 126 73" stroke="#0f172a" strokeWidth="1" />
        <path d="M 124 53 L 133 71" stroke="#0f172a" strokeWidth="1" />
        <path d="M 134 56 L 138 69" stroke="#0f172a" strokeWidth="1" />

        {/* Main Fish Body */}
        <path
          d="M 62 112 C 55 95, 68 70, 92 68 C 118 66, 142 78, 142 98 C 142 118, 115 128, 92 126 C 75 124, 66 118, 62 112 Z"
          fill="url(#fishGrad)"
          stroke="#0f172a"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Fish Scales/Gills markings */}
        <path d="M 94 77 Q 88 88, 94 99" fill="none" stroke="#0369a1" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M 86 82 Q 81 90, 86 98" fill="none" stroke="#0369a1" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M 78 87 Q 74 92, 78 97" fill="none" stroke="#0369a1" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

        {/* Gills Outer Arc */}
        <path d="M 110 78 C 104 88, 104 98, 110 106" fill="none" stroke="#0c4a6e" strokeWidth="1.5" strokeLinecap="round" />

        {/* Side Fin (Pectoral Fin) */}
        <path
          d="M 98 102 C 92 112, 102 120, 112 115 C 114 108, 108 104, 98 102 Z"
          fill="#38bdf8"
          stroke="#0f172a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M 102 106 Q 106 110, 108 112" stroke="#0f172a" strokeWidth="0.8" />
        <path d="M 99 110 Q 102 114, 104 115" stroke="#0f172a" strokeWidth="0.8" />

        {/* Tough Looking Eye */}
        {/* Eye White outline */}
        <ellipse cx="123" cy="85" rx="10" ry="11" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
        {/* Eye Pupil (Large, looking forward/angry) */}
        <ellipse cx="125" cy="86" rx="6" ry="6.5" fill="#0f172a" />
        {/* Eye Glint */}
        <circle cx="123" cy="83" r="1.8" fill="#ffffff" />
        
        {/* Angry / Tough Brow overlay */}
        <path d="M 112 77 Q 124 77, 134 83" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

        {/* Open Mouth with determined lips */}
        {/* Mouth Cutout */}
        <path
          d="M 132 102 C 122 104, 122 112, 131 113 C 137 113, 140 108, 138 104 Z"
          fill="#172554"
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        {/* Upper lip */}
        <path d="M 130 100 Q 138 101, 140 104" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        {/* Lower lip */}
        <path d="M 128 111 Q 136 111, 138 109" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

        {/* D. Elegant Dark Blue Fedora Hat */}
        <g transform="translate(90, 48)">
          {/* Hat Brim */}
          <ellipse cx="28" cy="18" rx="26" ry="4.5" fill="url(#hatGrad)" stroke="#0f172a" strokeWidth="1.8" />
          
          {/* Hat Crown */}
          <path
            d="M 10 16 C 11 -2, 43 -4, 44 16 Z"
            fill="url(#hatGrad)"
            stroke="#0f172a"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Hat Band / Ribbon (Cyan/Light Blue color) */}
          <path
            d="M 10.1 14 C 18 10, 36 10, 43.9 14 C 44 16, 44 16, 44 16 C 36 12, 18 12, 10 16 Z"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="0.8"
          />
          {/* Shadow beneath hat brim */}
          <path d="M 6 20 Q 28 23, 48 20" fill="none" stroke="#0f172a" strokeWidth="0.8" opacity="0.3" />
        </g>

      </g>
    </svg>
  );
}
