import React, { useState } from 'react';
import { Volume2, VolumeX, Turtle } from 'lucide-react';
import { speakKichwa, stopSpeaking } from '../utils/audio';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  showSlowToggle?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'minimal';
  className?: string;
  label?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  size = 'md',
  showSlowToggle = false,
  variant = 'primary',
  className = '',
  label,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  const handlePlay = (e: React.MouseEvent, slowMode = isSlow) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speakKichwa(text, {
      slow: slowMode,
      onEnd: () => setIsPlaying(false),
    });
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs gap-1',
    md: 'p-2.5 text-sm gap-1.5',
    lg: 'p-3 text-base gap-2',
  }[size];

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  }[size];

  const variantClasses = {
    primary: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-md active:scale-95',
    secondary: 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 active:scale-95',
    ghost: 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95',
    minimal: 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full active:scale-90',
  }[variant];

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={(e) => handlePlay(e, isSlow)}
        title={isPlaying ? 'Detener audio' : `Escuchar pronunciación: "${text}"`}
        aria-label={`Pronunciar ${text}`}
        className={`inline-flex items-center justify-center font-medium rounded-xl transition-all cursor-pointer ${sizeClasses} ${variantClasses} ${
          isPlaying ? 'ring-2 ring-rose-400 ring-offset-1 animate-pulse' : ''
        } ${className}`}
      >
        {isPlaying ? (
          <VolumeX size={iconSizes} className="animate-bounce" />
        ) : (
          <Volume2 size={iconSizes} />
        )}
        {label && <span className="font-semibold">{label}</span>}
      </button>

      {showSlowToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const nextSlow = !isSlow;
            setIsSlow(nextSlow);
            handlePlay(e, nextSlow);
          }}
          title={isSlow ? 'Modo normal' : 'Escuchar pronunciación lenta paso a paso'}
          className={`inline-flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer border ${
            isSlow
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <Turtle size={iconSizes - 2} />
        </button>
      )}
    </div>
  );
};
