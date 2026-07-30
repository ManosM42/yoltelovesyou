import React, { useState, useEffect, useRef } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Timer για την πρόοδο (0% -> 100%)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Trigger για Fade Out
  useEffect(() => {
    if (progress < 100) return;

    let fadeTimer;
    const initialTimer = setTimeout(() => {
      setIsFadingOut(true);

      fadeTimer = setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 800);
    }, 300);

    return () => {
      clearTimeout(initialTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [progress]);

  // Κλίση μπουκαλιού προς τα δεξιά κατά το άδειασμα
  const bottleRotation = Math.max(-25 - progress * 0.5, -65); 
  const bottleLiquidHeight = 100 - progress;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-800 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-5xl h-[550px]">
        
        {/* --- 1. Μπουκάλι Sprite (Πάνω Αριστερά) --- */}
        <div 
          className="absolute top-10 left-[18%] sm:left-[24%] w-20 sm:w-24 h-40 sm:h-48 z-20 transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${bottleRotation}deg)` }}
        >
          <svg viewBox="0 0 140 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
            <defs>
              {/* Χρώμα βυσσινάδας */}
              <linearGradient id="sourCherry" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="40%" stopColor="#c084fc" />
                <stop offset="80%" stopColor="#7e22ce" />
                <stop offset="100%" stopColor="#3b0764" />
              </linearGradient>

              {/* Σχήμα μπουκαλιού Sprite */}
              <clipPath id="chubbySpriteClip">
                <path d="
                  M 55 15 
                  L 85 15 
                  L 85 45 
                  C 85 55, 100 80, 118 110 
                  C 125 125, 122 150, 116 165 
                  C 122 180, 124 205, 118 225
                  C 116 260, 108 285, 98 290
                  C 88 295, 52 295, 42 290
                  C 32 285, 24 260, 22 225
                  C 16 205, 18 180, 24 165
                  C 18 150, 15 125, 22 110
                  C 40 80, 55 55, 55 45 
                  Z" 
                />
              </clipPath>
            </defs>

            {/* Πράσινο Καπάκι */}
            <rect x="52" y="3" width="36" height="12" rx="3" fill="#22c55e" />
            <line x1="55" y1="9" x2="85" y2="9" stroke="#15803d" strokeWidth="1.5" />

            {/* Γυάλινο Περίγραμμα */}
            <path
              d="
                M 55 15 
                L 85 15 
                L 85 45 
                C 85 55, 100 80, 118 110 
                C 125 125, 122 150, 116 165 
                C 122 180, 124 205, 118 225
                C 116 260, 108 285, 98 290
                C 88 295, 52 295, 42 290
                C 32 285, 24 260, 22 225
                C 16 205, 18 180, 24 165
                C 18 150, 15 125, 22 110
                C 40 80, 55 55, 55 45 
                Z"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3.5"
              opacity="0.8"
            />

            {/* Υγρό που αδειάζει */}
            <rect
              x="0"
              y={300 - (300 * bottleLiquidHeight) / 100}
              width="140"
              height="300"
              fill="url(#sourCherry)"
              clipPath="url(#chubbySpriteClip)"
              className="transition-all duration-75"
            />

            {/* Ανάγλυφες νευρώσεις Sprite */}
            <g stroke="#4ade80" strokeWidth="2" opacity="0.4" fill="none">
              <path d="M 30 135 Q 70 142 110 135" />
              <path d="M 28 185 Q 70 192 112 185" />
              <path d="M 28 235 Q 70 242 112 235" />
            </g>

            {/* Επιγραφή "Sprite" */}
            <g transform="translate(70, 185) rotate(10)">
              <rect x="-38" y="-16" width="76" height="32" rx="6" fill="#15803d" opacity="0.85" />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="18"
                fontWeight="900"
                fontStyle="italic"
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                Sprite
              </text>
            </g>
          </svg>
        </div>

        {/* --- 2. Ροή Υγρού (Από αριστερά προς το κέντρο) --- */}
        {progress > 0 && progress < 100 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
              <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
            </defs>
            
            <path
              d="M 41% 30% Q 46% 45% 50% 60%"
              fill="none"
              stroke="url(#streamGrad)"
              strokeWidth={Math.min(10, 3 + progress * 0.08)}
              strokeLinecap="round"
              className="animate-pulse"
              opacity="0.9"
            />
          </svg>
        )}

        {/* --- 3. Κείμενο YOLTE (Στο κέντρο, πιο κάτω) --- */}
        <div className="relative w-full max-w-4xl flex justify-center items-center z-0 mt-32">
          <svg className="w-full h-[180px] sm:h-[230px]" viewBox="0 0 900 180">
            <defs>
              {/* Mask με τα χοντρά γράμματα YOLTE */}
              <mask id="yolteBoldMask">
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="140"
                  fontWeight="900"
                  fontFamily="'Space Grotesk', 'Impact', sans-serif"
                  letterSpacing="28"
                  textLength="780"
                  lengthAdjust="spacingAndGlyphs"
                >
                  YOLTE
                </text>
              </mask>

              {/* Gradient για το μωβ υγρό */}
              <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="30%" stopColor="#c084fc" />
                <stop offset="70%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>
            </defs>

            {/* Background Outline */}
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="none"
              stroke="#581c87"
              strokeWidth="4"
              fontSize="140"
              fontWeight="900"
              fontFamily="'Space Grotesk', 'Impact', sans-serif"
              letterSpacing="28"
              textLength="780"
              lengthAdjust="spacingAndGlyphs"
              opacity="0.4"
            >
              YOLTE
            </text>

            {/* Υγρό που γεμίζει τα γράμματα */}
            <g mask="url(#yolteBoldMask)">
              <rect
                x="0"
                y={180 - (180 * progress) / 100}
                width="900"
                height="180"
                fill="url(#liquidGradient)"
                className="transition-all duration-75 ease-linear"
              />
            </g>
          </svg>

          {/* Glow Effect */}
          <div 
            className="absolute inset-0 pointer-events-none filter blur-3xl opacity-50 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, rgba(168,85,247,${progress / 100}) 0%, transparent 70%)`
            }}
          />
        </div>

      </div>

      {/* --- Progress Counter --- */}
      <div className="mt-2 flex flex-col items-center gap-2 font-mono z-20">
        <span className="text-purple-400 text-2xl font-black tracking-widest drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]">
          {progress}%
        </span>
        <span className="text-xs text-zinc-500 tracking-[0.4em] uppercase font-bold">
          444 // YOLTE
        </span>
      </div>
    </div>
  );
}