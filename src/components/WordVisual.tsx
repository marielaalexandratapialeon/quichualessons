import React from 'react';

interface WordVisualProps {
  visualId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  animated?: boolean;
}

export const WordVisual: React.FC<WordVisualProps> = ({
  visualId,
  size = 'md',
  className = '',
  animated = false,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
    hero: 'w-48 h-48 sm:w-56 sm:h-56',
  }[size];

  const renderGraphic = () => {
    switch (visualId) {
      // --- SALUDOS ---
      case 'alli-puncha':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="sunrise" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="16" fill="#fef3c7" />
            <circle cx="50" cy="55" r="24" fill="url(#sunrise)" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180].map((deg, i) => (
              <line
                key={i}
                x1="50"
                y1="55"
                x2={50 + 36 * Math.cos((deg * Math.PI) / 180)}
                y2={55 - 36 * Math.sin((deg * Math.PI) / 180)}
                stroke="#d97706"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ))}
            {/* Mountain silhouette */}
            <polygon points="10,85 40,58 65,85" fill="#475569" opacity="0.8" />
            <polygon points="35,85 70,50 95,85" fill="#334155" />
            {/* Snow cap */}
            <polygon points="63,58 70,50 77,58 70,62" fill="#ffffff" />
            <rect x="0" y="80" width="100" height="20" fill="#059669" />
          </svg>
        );

      case 'alli-chishi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ffedd5" />
            <circle cx="50" cy="60" r="22" fill="#ea580c" />
            <path d="M 0 70 Q 50 65 100 75 L 100 100 L 0 100 Z" fill="#9a3412" opacity="0.4" />
            <polygon points="0,85 30,60 60,85" fill="#1e293b" opacity="0.7" />
            <polygon points="40,90 75,55 100,90" fill="#0f172a" />
            <line x1="20" y1="35" x2="35" y2="35" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="65" y1="28" x2="85" y2="28" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'alli-tuta':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#0f172a" />
            {/* Crescent moon */}
            <path
              d="M 58 25 A 22 22 0 1 0 72 65 A 18 18 0 1 1 58 25 Z"
              fill="#fef08a"
            />
            {/* Stars */}
            {[[20, 25], [35, 18], [25, 45], [78, 30], [80, 50], [45, 38]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 1.8 : 1.2} fill="#ffffff" />
            ))}
            <polygon points="0,88 45,55 90,88" fill="#1e293b" />
            <polygon points="35,90 75,62 100,90" fill="#334155" />
          </svg>
        );

      case 'imanalla':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fdf2f8" />
            {/* Greeting hands / waving handshake */}
            <circle cx="50" cy="50" r="34" fill="#fbcfe8" />
            <g transform="translate(24, 24) scale(0.52)">
              <path
                d="M 20 50 C 20 30 35 15 50 15 C 65 15 80 30 80 50"
                stroke="#db2777"
                strokeWidth="6"
                fill="none"
              />
              <circle cx="50" cy="45" r="14" fill="#f43f5e" />
              {/* Andean textile wave */}
              <path
                d="M 15 70 Q 30 55 50 70 T 85 70"
                stroke="#be185d"
                strokeWidth="5"
                fill="none"
              />
              <rect x="35" y="60" width="30" height="20" rx="4" fill="#9d174d" />
            </g>
          </svg>
        );

      case 'alli-kani':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfdf5" />
            <circle cx="50" cy="50" r="32" fill="#a7f3d0" />
            {/* Smile / happy face with andean chullo hat */}
            <path d="M 32 36 L 50 18 L 68 36 Z" fill="#047857" />
            <circle cx="50" cy="18" r="4" fill="#f59e0b" />
            <circle cx="42" cy="48" r="4" fill="#065f46" />
            <circle cx="58" cy="48" r="4" fill="#065f46" />
            <path d="M 38 60 Q 50 72 62 60" stroke="#065f46" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'yupaychani':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef2f2" />
            {/* Hands joined in gratitude with heart */}
            <circle cx="50" cy="50" r="32" fill="#fecaca" />
            <path
              d="M 50 36 C 45 28 32 28 32 40 C 32 54 50 66 50 66 C 50 66 68 54 68 40 C 68 28 55 28 50 36 Z"
              fill="#dc2626"
            />
            {/* Ray of blessings */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <line
                key={i}
                x1={50 + 26 * Math.cos((deg * Math.PI) / 180)}
                y1={50 + 26 * Math.sin((deg * Math.PI) / 180)}
                x2={50 + 32 * Math.cos((deg * Math.PI) / 180)}
                y2={50 + 32 * Math.sin((deg * Math.PI) / 180)}
                stroke="#b91c1c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}
          </svg>
        );

      case 'kayakama':
      case 'tinkunakama':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f0f9ff" />
            {/* Winding mountain path into tomorrow */}
            <path d="M 20 85 Q 50 65 35 45 T 80 25" stroke="#0284c7" strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="80" cy="25" r="8" fill="#f59e0b" />
            <circle cx="20" cy="85" r="6" fill="#0369a1" />
            {/* Step markers */}
            <circle cx="42" cy="53" r="3" fill="#38bdf8" />
            <circle cx="62" cy="36" r="3" fill="#38bdf8" />
          </svg>
        );

      case 'ari':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f0fdf4" />
            <circle cx="50" cy="50" r="32" fill="#bbf7d0" />
            {/* Stepped checkmark */}
            <path d="M 34 50 L 46 62 L 68 36" stroke="#15803d" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        );

      case 'mana':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef2f2" />
            <circle cx="50" cy="50" r="32" fill="#fecaca" />
            <line x1="34" y1="34" x2="66" y2="66" stroke="#b91c1c" strokeWidth="8" strokeLinecap="round" />
            <line x1="66" y1="34" x2="34" y2="66" stroke="#b91c1c" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      // --- COLORES ---
      case 'puka':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#dc2626" />
            {/* Otavalo red poncho geometric weave */}
            <line x1="20" y1="0" x2="20" y2="100" stroke="#b91c1c" strokeWidth="4" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#f59e0b" strokeWidth="6" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="#b91c1c" strokeWidth="4" />
            <polygon points="50,30 65,50 50,70 35,50" fill="#fef08a" />
            <circle cx="50" cy="50" r="5" fill="#dc2626" />
          </svg>
        );

      case 'killu':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#eab308" />
            <circle cx="50" cy="50" r="28" fill="#facc15" stroke="#ca8a04" strokeWidth="4" />
            <polygon points="50,15 55,30 70,30 58,40 62,55 50,45 38,55 42,40 30,30 45,30" fill="#78350f" transform="translate(0, 5) scale(0.9) translate(5, 5)" />
            <line x1="25" y1="80" x2="75" y2="80" stroke="#a16207" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'anqas':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#1d4ed8" />
            {/* Blue andean sky / cloth */}
            <circle cx="50" cy="50" r="28" fill="#3b82f6" />
            <path d="M 25 50 Q 50 30 75 50 T 100 50" stroke="#93c5fd" strokeWidth="5" fill="none" />
            <polygon points="50,32 62,48 50,64 38,48" fill="#ffffff" />
          </svg>
        );

      case 'waylla':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#15803d" />
            <path
              d="M 50 20 C 70 35 75 65 50 82 C 25 65 30 35 50 20 Z"
              fill="#4ade80"
            />
            <path d="M 50 25 L 50 80" stroke="#166534" strokeWidth="3" />
            <path d="M 50 45 L 62 38" stroke="#166534" strokeWidth="2.5" />
            <path d="M 50 58 L 38 52" stroke="#166534" strokeWidth="2.5" />
          </svg>
        );

      case 'yana':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#09090b" />
            {/* Deep black with subtle andean silver embroidery */}
            <circle cx="50" cy="50" r="26" fill="#27272a" />
            <polygon points="50,30 65,50 50,70 35,50" stroke="#71717a" strokeWidth="3" fill="none" />
            <circle cx="50" cy="50" r="4" fill="#a1a1aa" />
          </svg>
        );

      case 'yuraq':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#cbd5e1" />
            <circle cx="50" cy="50" r="32" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <polygon points="50,26 68,52 50,76 32,52" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="50" cy="51" r="6" fill="#e2e8f0" />
          </svg>
        );

      case 'ushpa':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#64748b" />
            <circle cx="50" cy="50" r="28" fill="#94a3b8" />
            <path d="M 35 60 Q 50 40 65 60" stroke="#475569" strokeWidth="4" fill="none" />
          </svg>
        );

      case 'champi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#78350f" />
            <ellipse cx="50" cy="50" r="30" fill="#92400e" />
            <path d="M 32 45 Q 50 35 68 45 Q 50 65 32 45 Z" fill="#b45309" />
          </svg>
        );

      case 'waminsi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#581c87" />
            <circle cx="50" cy="50" r="28" fill="#7e22ce" />
            <polygon points="50,28 66,50 50,72 34,50" fill="#c084fc" />
          </svg>
        );

      // --- NÚMEROS ---
      case 'shuk':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfdf5" />
            <circle cx="50" cy="50" r="26" fill="#10b981" />
            <text x="50" y="60" fontSize="30" fontWeight="bold" textAnchor="middle" fill="#ffffff">1</text>
          </svg>
        );

      case 'ishkay':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfdf5" />
            <circle cx="36" cy="50" r="16" fill="#10b981" />
            <circle cx="64" cy="50" r="16" fill="#059669" />
            <text x="50" y="88" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#047857">2</text>
          </svg>
        );

      case 'kimsa':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfdf5" />
            <circle cx="50" cy="34" r="14" fill="#10b981" />
            <circle cx="32" cy="62" r="14" fill="#059669" />
            <circle cx="68" cy="62" r="14" fill="#047857" />
            <text x="50" y="90" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#047857">3</text>
          </svg>
        );

      case 'chusku':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfdf5" />
            {/* Chakana cross shape for 4 */}
            <rect x="30" y="30" width="16" height="16" rx="4" fill="#10b981" />
            <rect x="54" y="30" width="16" height="16" rx="4" fill="#10b981" />
            <rect x="30" y="54" width="16" height="16" rx="4" fill="#059669" />
            <rect x="54" y="54" width="16" height="16" rx="4" fill="#059669" />
            <text x="50" y="90" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#047857">4</text>
          </svg>
        );

      case 'pichka':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfdf5" />
            {/* 5 dots like dice or hand */}
            <circle cx="32" cy="32" r="10" fill="#10b981" />
            <circle cx="68" cy="32" r="10" fill="#10b981" />
            <circle cx="50" cy="50" r="11" fill="#059669" />
            <circle cx="32" cy="68" r="10" fill="#047857" />
            <circle cx="68" cy="68" r="10" fill="#047857" />
            <text x="50" y="90" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#047857">5</text>
          </svg>
        );

      case 'sukta':
      case 'kanchis':
      case 'pusak':
      case 'iskun':
      case 'chunka':
      case 'pachak':
      case 'waranka':
        const numLabels: Record<string, string> = {
          sukta: '6',
          kanchis: '7',
          pusak: '8',
          iskun: '9',
          chunka: '10',
          pachak: '100',
          waranka: '1000',
        };
        const val = numLabels[visualId] || '10';
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfdf5" />
            <circle cx="50" cy="46" r="30" fill="#059669" />
            <circle cx="50" cy="46" r="24" fill="#10b981" />
            <text x="50" y="55" fontSize={val.length > 2 ? '20' : '26'} fontWeight="bold" textAnchor="middle" fill="#ffffff">
              {val}
            </text>
            <text x="50" y="90" fontSize="14" fontWeight="600" textAnchor="middle" fill="#047857">
              {visualId.toUpperCase()}
            </text>
          </svg>
        );

      // --- ANIMALES ANDINOS ---
      case 'kuri':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef3c7" />
            {/* Cute Guinea Pig (Cuy) */}
            <ellipse cx="50" cy="55" rx="30" ry="22" fill="#d97706" />
            <ellipse cx="68" cy="52" rx="18" ry="16" fill="#b45309" />
            <circle cx="74" cy="46" r="3" fill="#1e293b" />
            <circle cx="75" cy="45" r="1" fill="#ffffff" />
            {/* Tiny ears */}
            <circle cx="62" cy="38" r="6" fill="#f43f5e" />
            <circle cx="62" cy="38" r="4" fill="#fbcfe8" />
            {/* Whiskers */}
            <line x1="82" y1="50" x2="94" y2="48" stroke="#78350f" strokeWidth="1.5" />
            <line x1="82" y1="54" x2="94" y2="56" stroke="#78350f" strokeWidth="1.5" />
            {/* Little paws */}
            <ellipse cx="40" cy="74" rx="6" ry="3" fill="#92400e" />
            <ellipse cx="65" cy="72" rx="6" ry="3" fill="#92400e" />
          </svg>
        );

      case 'kuntur':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#e0f2fe" />
            {/* Soaring condor */}
            <g transform="translate(10, 15) scale(0.8)">
              {/* Huge wings */}
              <path d="M 50 45 Q 20 10 0 25 Q 25 50 45 55 Z" fill="#1e293b" />
              <path d="M 50 45 Q 80 10 100 25 Q 75 50 55 55 Z" fill="#1e293b" />
              {/* Wing white patches */}
              <polygon points="15,28 35,40 25,48" fill="#f8fafc" />
              <polygon points="85,28 65,40 75,48" fill="#f8fafc" />
              {/* Body */}
              <ellipse cx="50" cy="55" rx="10" ry="20" fill="#0f172a" />
              {/* White neck ruff (collar de plumas) */}
              <ellipse cx="50" cy="40" rx="8" ry="4" fill="#ffffff" />
              {/* Head with red crest */}
              <circle cx="50" cy="32" r="6" fill="#b91c1c" />
              <polygon points="46,32 50,22 54,32" fill="#991b1b" />
              {/* Beak */}
              <polygon points="50,34 50,40 56,36" fill="#eab308" />
            </g>
          </svg>
        );

      case 'allku':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef3c7" />
            {/* Friendly Andean shepherd dog */}
            <ellipse cx="48" cy="58" rx="24" ry="18" fill="#b45309" />
            <circle cx="68" cy="42" r="16" fill="#d97706" />
            {/* Ears */}
            <polygon points="60,30 54,16 68,26" fill="#92400e" />
            <polygon points="76,30 84,16 78,28" fill="#92400e" />
            {/* Eyes */}
            <circle cx="66" cy="38" r="2.5" fill="#1e293b" />
            <circle cx="76" cy="38" r="2.5" fill="#1e293b" />
            {/* Nose */}
            <ellipse cx="78" cy="46" rx="4" ry="3" fill="#1e293b" />
            {/* Wagging tail */}
            <path d="M 26 56 Q 16 45 18 36" stroke="#b45309" strokeWidth="5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'misi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f1f5f9" />
            <circle cx="50" cy="52" r="22" fill="#475569" />
            {/* Ears */}
            <polygon points="34,38 30,18 46,32" fill="#334155" />
            <polygon points="66,38 70,18 54,32" fill="#334155" />
            <polygon points="35,34 32,22 43,30" fill="#f472b6" />
            <polygon points="65,34 68,22 57,30" fill="#f472b6" />
            {/* Eyes */}
            <circle cx="42" cy="48" r="3" fill="#facc15" />
            <circle cx="58" cy="48" r="3" fill="#facc15" />
            <circle cx="42" cy="48" r="1.5" fill="#0f172a" />
            <circle cx="58" cy="48" r="1.5" fill="#0f172a" />
            {/* Whiskers */}
            <line x1="34" y1="56" x2="16" y2="52" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="34" y1="60" x2="16" y2="62" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="66" y1="56" x2="84" y2="52" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="66" y1="60" x2="84" y2="62" stroke="#cbd5e1" strokeWidth="2" />
          </svg>
        );

      case 'atuk':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ffedd5" />
            {/* Lobo de páramo / Zorro */}
            <polygon points="50,22 75,60 25,60" fill="#ea580c" />
            <polygon points="50,38 70,60 30,60" fill="#ffffff" />
            {/* Big triangular ears */}
            <polygon points="30,30 22,12 40,25" fill="#9a3412" />
            <polygon points="70,30 78,12 60,25" fill="#9a3412" />
            <circle cx="42" cy="45" r="3" fill="#1e293b" />
            <circle cx="58" cy="45" r="3" fill="#1e293b" />
            <polygon points="46,55 54,55 50,60" fill="#1e293b" />
          </svg>
        );

      case 'llama':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f8fafc" />
            {/* Elegant Andean Llama */}
            <rect x="30" y="55" width="40" height="25" rx="10" fill="#e2e8f0" />
            {/* Neck */}
            <rect x="52" y="24" width="16" height="40" rx="8" fill="#e2e8f0" />
            {/* Head */}
            <ellipse cx="66" cy="24" rx="14" ry="10" fill="#cbd5e1" />
            {/* Ears */}
            <polygon points="62,16 64,4 68,14" fill="#94a3b8" />
            <polygon points="70,16 74,4 76,14" fill="#94a3b8" />
            {/* Colorful tassel on ear */}
            <circle cx="64" cy="14" r="3" fill="#dc2626" />
            <circle cx="64" cy="17" r="2" fill="#f59e0b" />
            {/* Eye */}
            <circle cx="70" cy="22" r="2.5" fill="#0f172a" />
            {/* Legs */}
            <line x1="38" y1="80" x2="38" y2="92" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <line x1="48" y1="80" x2="48" y2="92" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <line x1="60" y1="80" x2="60" y2="92" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <line x1="68" y1="80" x2="68" y2="92" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'kinti':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfeff" />
            {/* Hummingbird with flower */}
            <ellipse cx="46" cy="50" rx="12" ry="7" fill="#06b6d4" transform="rotate(-20 46 50)" />
            {/* Wings */}
            <ellipse cx="40" cy="38" rx="16" ry="6" fill="#3b82f6" opacity="0.8" transform="rotate(-50 40 38)" />
            {/* Long needle beak */}
            <line x1="56" y1="46" x2="80" y2="40" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            {/* Flower */}
            <circle cx="82" cy="40" r="5" fill="#f43f5e" />
            <circle cx="84" cy="42" r="3" fill="#fbbf24" />
          </svg>
        );

      case 'amarun':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f0fdf4" />
            {/* Sacred serpent */}
            <path
              d="M 20 70 Q 35 30 50 70 T 80 40"
              stroke="#15803d"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            {/* Diamond scales */}
            <circle cx="35" cy="50" r="2.5" fill="#facc15" />
            <circle cx="50" cy="70" r="2.5" fill="#facc15" />
            <circle cx="65" cy="50" r="2.5" fill="#facc15" />
            {/* Snake head */}
            <ellipse cx="82" cy="38" rx="7" ry="5" fill="#166534" />
            <circle cx="84" cy="36" r="1.5" fill="#ef4444" />
          </svg>
        );

      // --- FAMILIA Y COMUNIDAD ---
      case 'yaya':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ede9fe" />
            {/* Andean father with hat and poncho */}
            <ellipse cx="50" cy="50" rx="18" ry="20" fill="#fcd34d" />
            {/* Fedora / Sombrero de paño */}
            <ellipse cx="50" cy="34" rx="26" ry="7" fill="#1e293b" />
            <path d="M 32 34 C 32 18 68 18 68 34 Z" fill="#334155" />
            <rect x="34" y="31" width="32" height="3" fill="#dc2626" />
            {/* Poncho */}
            <polygon points="15,90 50,68 85,90" fill="#4338ca" />
            <polygon points="35,90 50,75 65,90" fill="#f59e0b" />
          </svg>
        );

      case 'mama':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fdf2f8" />
            {/* Andean mother with embroidered blouse and golden huallcas necklace */}
            <circle cx="50" cy="44" r="18" fill="#fed7aa" />
            {/* Black hair with middle part */}
            <path d="M 32 42 C 32 24 68 24 68 42 C 60 34 40 34 32 42 Z" fill="#0f172a" />
            {/* Golden beads necklace (Huallcas de Otavalo) */}
            <path d="M 40 56 Q 50 64 60 56" stroke="#f59e0b" strokeWidth="4" fill="none" strokeDasharray="3 3" />
            {/* Embroidered white blouse with floral colors */}
            <path d="M 25 90 C 25 70 75 70 75 90 Z" fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="50" cy="74" r="3" fill="#ec4899" />
            <circle cx="42" cy="76" r="2" fill="#3b82f6" />
            <circle cx="58" cy="76" r="2" fill="#10b981" />
          </svg>
        );

      case 'wawa':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef3c7" />
            {/* Baby wrapped in traditional swaddling cloth (Chumpi / Faja) */}
            <ellipse cx="50" cy="62" rx="18" ry="26" fill="#f43f5e" />
            {/* Wrapped swaddle lines */}
            <line x1="34" y1="52" x2="66" y2="60" stroke="#fef08a" strokeWidth="3" />
            <line x1="66" y1="62" x2="34" y2="70" stroke="#fef08a" strokeWidth="3" />
            <line x1="34" y1="72" x2="66" y2="80" stroke="#fef08a" strokeWidth="3" />
            {/* Baby head with knit cap */}
            <circle cx="50" cy="32" r="14" fill="#fed7aa" />
            <path d="M 36 30 C 36 18 64 18 64 30 Z" fill="#0284c7" />
            <circle cx="50" cy="18" r="3" fill="#f59e0b" />
            <circle cx="46" cy="34" r="1.5" fill="#0f172a" />
            <circle cx="54" cy="34" r="1.5" fill="#0f172a" />
            <path d="M 48 38 Q 50 40 52 38" stroke="#0f172a" strokeWidth="1" fill="none" />
          </svg>
        );

      case 'churi':
      case 'ushushi':
      case 'mashi':
      case 'runa':
      case 'hatun-yaya':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f5f3ff" />
            {/* Person silhouette with heart and hat */}
            <circle cx="50" cy="38" r="18" fill="#fbcfe8" />
            <path d="M 22 88 C 22 66 78 66 78 88 Z" fill="#6366f1" />
            <circle cx="50" cy="38" r="12" fill="#fbbf24" />
            <circle cx="50" cy="74" r="6" fill="#ef4444" />
          </svg>
        );

      // --- NATURALEZA Y PACHAMAMA ---
      case 'inti':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fefce8" />
            {/* Golden Inti Sol with geometric rays */}
            <circle cx="50" cy="50" r="22" fill="#f59e0b" />
            <circle cx="50" cy="50" r="17" fill="#fbbf24" />
            {/* 8 bold cardinal rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <polygon
                key={i}
                points="47,20 53,20 50,10"
                fill="#d97706"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
            {/* Inti face */}
            <circle cx="44" cy="46" r="2.5" fill="#78350f" />
            <circle cx="56" cy="46" r="2.5" fill="#78350f" />
            <path d="M 43 56 Q 50 63 57 56" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'killa':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#0369a1" />
            <path
              d="M 52 20 A 28 28 0 1 0 76 72 A 22 22 0 1 1 52 20 Z"
              fill="#fef08a"
            />
            {/* Glowing aura */}
            <circle cx="75" cy="30" r="2" fill="#ffffff" />
            <circle cx="30" cy="40" r="1.5" fill="#ffffff" />
            <circle cx="38" cy="75" r="2" fill="#ffffff" />
          </svg>
        );

      case 'urku':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#e0f2fe" />
            {/* Chimborazo snowy volcano */}
            <polygon points="10,90 50,22 90,90" fill="#334155" />
            <polygon points="40,90 70,38 98,90" fill="#1e293b" opacity="0.6" />
            {/* Snow cap */}
            <polygon points="38,42 50,22 62,42 56,46 50,42 44,46" fill="#ffffff" />
            {/* Valley base */}
            <rect x="0" y="86" width="100" height="14" fill="#15803d" />
          </svg>
        );

      case 'yaku':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfeff" />
            {/* Sacred water drop */}
            <path
              d="M 50 18 C 50 18 24 50 24 66 C 24 80 36 90 50 90 C 64 90 76 80 76 66 C 76 50 50 18 50 18 Z"
              fill="#06b6d4"
            />
            <path
              d="M 44 58 C 44 48 50 36 50 36 C 50 36 34 52 34 64 C 34 72 40 78 48 80 C 44 76 44 66 44 58 Z"
              fill="#67e8f9"
              opacity="0.8"
            />
          </svg>
        );

      case 'nina':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef2f2" />
            {/* Dancing sacred flame */}
            <path
              d="M 50 15 C 65 35 78 50 78 68 C 78 82 66 90 50 90 C 34 90 22 82 22 68 C 22 48 40 38 50 15 Z"
              fill="#ef4444"
            />
            <path
              d="M 50 40 C 60 52 68 62 68 74 C 68 82 60 86 50 86 C 40 86 32 82 32 74 C 32 60 44 52 50 40 Z"
              fill="#f59e0b"
            />
            <ellipse cx="50" cy="76" rx="10" ry="8" fill="#fef08a" />
          </svg>
        );

      case 'wayra':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f8fafc" />
            <path d="M 15 35 Q 55 35 60 25 A 8 8 0 1 0 46 22" stroke="#0ea5e9" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 10 50 Q 75 50 80 40 A 8 8 0 1 0 66 37" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 20 65 Q 50 65 55 75 A 8 8 0 1 1 42 78" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'allpa':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef3c7" />
            {/* Fertile soil with sprouting shoot */}
            <path d="M 0 65 Q 50 55 100 65 L 100 100 L 0 100 Z" fill="#78350f" />
            <path d="M 50 65 L 50 35" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
            <path d="M 50 45 C 40 40 35 30 50 30" fill="#22c55e" />
            <path d="M 50 40 C 60 35 65 25 50 25" fill="#16a34a" />
          </svg>
        );

      case 'tamya':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f0f9ff" />
            {/* Cloud */}
            <path d="M 30 50 A 15 15 0 0 1 55 40 A 18 18 0 0 1 78 50 A 12 12 0 0 1 70 65 L 30 65 A 12 12 0 0 1 30 50 Z" fill="#94a3b8" />
            {/* Raindrops */}
            <line x1="35" y1="72" x2="30" y2="84" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="72" x2="45" y2="86" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            <line x1="65" y1="72" x2="60" y2="84" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      // --- ALIMENTOS Y SABORES ---
      case 'sara':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef9c3" />
            {/* Corn cob (Choclo) */}
            <ellipse cx="50" cy="48" rx="16" ry="30" fill="#facc15" />
            {/* Kernels grid */}
            <line x1="42" y1="24" x2="42" y2="72" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="50" y2="76" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="58" y1="24" x2="58" y2="72" stroke="#ca8a04" strokeWidth="1.5" />
            {[32, 42, 52, 62].map((y) => (
              <line key={y} x1="36" y1={y} x2="64" y2={y} stroke="#ca8a04" strokeWidth="1.5" />
            ))}
            {/* Green husks */}
            <path d="M 32 75 C 32 50 40 40 34 32 C 26 50 30 80 44 88 Z" fill="#65a30d" />
            <path d="M 68 75 C 68 50 60 40 66 32 C 74 50 70 80 56 88 Z" fill="#4d7c0f" />
          </svg>
        );

      case 'papa':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ffedd5" />
            {/* Andean native potato */}
            <ellipse cx="46" cy="52" rx="28" ry="22" fill="#b45309" transform="rotate(-10 46 52)" />
            {/* Potato eyes */}
            <circle cx="36" cy="46" r="2.5" fill="#78350f" />
            <circle cx="56" cy="42" r="2" fill="#78350f" />
            <circle cx="48" cy="62" r="2.5" fill="#78350f" />
            <circle cx="64" cy="56" r="2" fill="#78350f" />
            <circle cx="30" cy="58" r="1.5" fill="#78350f" />
          </svg>
        );

      case 'kinuwa':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef3c7" />
            {/* Stalk of quinua with colorful seed clusters */}
            <line x1="50" y1="88" x2="50" y2="25" stroke="#a16207" strokeWidth="4" />
            <circle cx="50" cy="22" r="8" fill="#e11d48" />
            <circle cx="42" cy="32" r="7" fill="#ea580c" />
            <circle cx="58" cy="34" r="7" fill="#d97706" />
            <circle cx="38" cy="46" r="8" fill="#ca8a04" />
            <circle cx="62" cy="48" r="8" fill="#e11d48" />
            <circle cx="48" cy="42" r="6" fill="#f59e0b" />
          </svg>
        );

      case 'mote':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ffedd5" />
            {/* Clay bowl of steaming mote */}
            <ellipse cx="50" cy="62" rx="34" ry="18" fill="#c2410c" />
            <ellipse cx="50" cy="58" rx="30" ry="14" fill="#ea580c" />
            {/* White corn kernels */}
            <circle cx="42" cy="56" r="6" fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="52" cy="54" r="7" fill="#f8fafc" stroke="#e2e8f0" />
            <circle cx="60" cy="58" r="6" fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="35" cy="60" r="5" fill="#f8fafc" stroke="#e2e8f0" />
            <circle cx="48" cy="62" r="6" fill="#ffffff" stroke="#e2e8f0" />
            {/* Steam */}
            <path d="M 44 42 Q 40 32 46 22" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 54 40 Q 58 30 52 20" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'machka':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef9c3" />
            <ellipse cx="50" cy="65" rx="30" ry="16" fill="#a16207" />
            <ellipse cx="50" cy="60" rx="26" ry="12" fill="#d97706" />
            <ellipse cx="50" cy="56" rx="22" ry="8" fill="#fef08a" />
          </svg>
        );

      case 'tanta':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fed7aa" />
            {/* Guagua de pan (traditional decorated bread) */}
            <ellipse cx="50" cy="35" rx="14" ry="16" fill="#c2410c" />
            <rect x="36" y="44" width="28" height="42" rx="14" fill="#c2410c" />
            {/* Glaze decorations */}
            <circle cx="46" cy="34" r="2" fill="#ffffff" />
            <circle cx="54" cy="34" r="2" fill="#ffffff" />
            <path d="M 40 54 L 60 54" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
            <path d="M 40 64 L 60 64" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <path d="M 40 74 L 60 74" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'mishki':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fefce8" />
            {/* Clay pot with golden honey / chawar mishki */}
            <ellipse cx="50" cy="62" rx="24" ry="20" fill="#d97706" />
            <rect x="36" y="38" width="28" height="10" rx="4" fill="#b45309" />
            <ellipse cx="50" cy="40" rx="14" ry="4" fill="#fef08a" />
            {/* Honey drop */}
            <circle cx="50" cy="52" r="5" fill="#facc15" />
            <path d="M 50 44 L 50 52" stroke="#facc15" strokeWidth="3" />
          </svg>
        );

      // --- CUERPO HUMANO ---
      case 'uma':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ede9fe" />
            {/* Head profile / thoughtful mind */}
            <ellipse cx="50" cy="46" rx="20" ry="24" fill="#fcd34d" />
            {/* Crown / spark of thought */}
            <circle cx="50" cy="22" r="4" fill="#8b5cf6" />
            <circle cx="36" cy="26" r="3" fill="#a78bfa" />
            <circle cx="64" cy="26" r="3" fill="#a78bfa" />
            <path d="M 42 70 C 42 82 58 82 58 70" stroke="#f59e0b" strokeWidth="4" />
          </svg>
        );

      case 'nawi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f0fdf4" />
            {/* Big expressive Andean eye */}
            <path
              d="M 20 50 Q 50 20 80 50 Q 50 80 20 50 Z"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="4"
            />
            <circle cx="50" cy="50" r="14" fill="#78350f" />
            <circle cx="50" cy="50" r="7" fill="#0f172a" />
            <circle cx="53" cy="47" r="3" fill="#ffffff" />
          </svg>
        );

      case 'shimi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fdf2f8" />
            {/* Speaking mouth with sound waves */}
            <path
              d="M 26 50 Q 50 34 74 50 Q 50 72 26 50 Z"
              fill="#f43f5e"
            />
            <path d="M 32 50 L 68 50" stroke="#881337" strokeWidth="3" />
            <path d="M 80 40 Q 86 50 80 60" stroke="#db2777" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 86 34 Q 94 50 86 66" stroke="#db2777" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'maki':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ecfdf5" />
            {/* Open helping hand */}
            <g transform="translate(15, 15) scale(0.7)">
              <rect x="25" y="45" width="40" height="40" rx="10" fill="#fcd34d" />
              {/* Fingers */}
              <rect x="15" y="42" width="10" height="24" rx="5" fill="#fcd34d" transform="rotate(-25 15 42)" />
              <rect x="27" y="18" width="9" height="32" rx="4.5" fill="#fcd34d" />
              <rect x="39" y="14" width="9" height="36" rx="4.5" fill="#fcd34d" />
              <rect x="51" y="18" width="9" height="32" rx="4.5" fill="#fcd34d" />
              <rect x="63" y="26" width="9" height="24" rx="4.5" fill="#fcd34d" />
              {/* Palm line */}
              <path d="M 32 60 Q 45 68 58 58" stroke="#d97706" strokeWidth="2.5" fill="none" />
            </g>
          </svg>
        );

      case 'chaki':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef3c7" />
            {/* Footprint / walking foot */}
            <ellipse cx="50" cy="62" rx="14" ry="20" fill="#d97706" />
            {/* Toes */}
            <circle cx="40" cy="34" r="5" fill="#d97706" />
            <circle cx="48" cy="33" r="4.5" fill="#d97706" />
            <circle cx="56" cy="35" r="4" fill="#d97706" />
            <circle cx="63" cy="38" r="3.5" fill="#d97706" />
            <circle cx="68" cy="43" r="3" fill="#d97706" />
          </svg>
        );

      case 'shunku':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#fef2f2" />
            {/* Beating Andean heart */}
            <path
              d="M 50 32 C 42 18 22 18 22 36 C 22 56 50 78 50 78 C 50 78 78 56 78 36 C 78 18 58 18 50 32 Z"
              fill="#dc2626"
            />
            {/* Inner glow */}
            <path
              d="M 50 40 C 45 30 32 30 32 40 C 32 52 50 66 50 66 C 50 66 68 52 68 40 C 68 30 55 30 50 40 Z"
              fill="#f87171"
              opacity="0.8"
            />
          </svg>
        );

      case 'rinki':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#ede9fe" />
            {/* Ear with listening vibrations */}
            <path
              d="M 38 25 C 55 20 65 35 60 55 C 56 70 42 78 36 75"
              stroke="#7c3aed"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M 40 40 Q 50 48 44 60" stroke="#a78bfa" strokeWidth="4" fill="none" />
            <path d="M 70 36 Q 78 48 70 60" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 78 30 Q 88 48 78 66" stroke="#ddd6fe" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" rx="16" fill="#f1f5f9" />
            <circle cx="50" cy="50" r="28" fill="#e2e8f0" />
            <text x="50" y="58" fontSize="24" textAnchor="middle" fill="#64748b">
              ✦
            </text>
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-white ${sizeClasses} ${
        animated ? 'transition-transform duration-300 hover:scale-105' : ''
      } ${className}`}
    >
      {renderGraphic()}
    </div>
  );
};
