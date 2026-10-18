import React from 'react';
import { KichwaWord, KichwaCategory } from '../types/kichwa';
import { WordVisual } from './WordVisual';
import { AudioButton } from './AudioButton';
import { X, Sparkles, BookOpen, Volume2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface WordDetailModalProps {
  word: KichwaWord | null;
  category?: KichwaCategory;
  isLearned?: boolean;
  onClose: () => void;
  onToggleLearned?: (wordId: string) => void;
  onPrevWord?: () => void;
  onNextWord?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  category,
  isLearned = false,
  onClose,
  onToggleLearned,
  onPrevWord,
  onNextWord,
  hasPrev = false,
  hasNext = false,
}) => {
  if (!word) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Andean Top Banner */}
        <div className="h-3 andean-faja w-full shrink-0" />

        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            {category && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                {category.nameKichwa} • {category.nameSpanish}
              </span>
            )}
            {isLearned && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={13} />
                Aprendida
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onToggleLearned && (
              <button
                type="button"
                onClick={() => onToggleLearned(word.id)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLearned
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 size={16} className={isLearned ? 'text-emerald-600' : 'text-slate-400'} />
                <span>{isLearned ? 'Dominada' : 'Marcar aprendida'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer ml-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Visual & Word Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-radial from-slate-50 to-amber-50/40 p-5 rounded-2xl border border-amber-100/60">
            <WordVisual visualId={word.visualId} size="xl" className="shadow-md" />

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-md">
                Kichwa Shimi (Ecuador)
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {word.kichwa}
              </h2>

              <div className="text-sm font-mono text-rose-600 font-semibold">
                Guía fonética: {word.phonetic}
              </div>

              {/* Syllables breakdown */}
              {word.syllables && word.syllables.length > 0 && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                  <span className="text-xs text-slate-400">Sílabas:</span>
                  {word.syllables.map((syl, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-mono font-medium shadow-2xs"
                    >
                      {syl}
                    </span>
                  ))}
                </div>
              )}

              {/* Audio Controls */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                <AudioButton
                  text={word.kichwa}
                  size="md"
                  showSlowToggle={true}
                  label="Escuchar pronunciación"
                />
              </div>
            </div>
          </div>

          {/* Meaning in Spanish */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Significado en Español
            </div>
            <div className="text-xl font-bold text-slate-800">
              {word.spanish}
            </div>
          </div>

          {/* Context Example Sentence */}
          <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                <BookOpen size={14} />
                <span>Ejemplo de uso cotidiano</span>
              </div>
              <AudioButton text={word.exampleKichwa} size="sm" variant="ghost" label="Oír frase" />
            </div>

            <p className="text-base font-semibold text-slate-900 italic">
              "{word.exampleKichwa}"
            </p>
            <p className="text-sm text-slate-600">
              "{word.exampleSpanish}"
            </p>
          </div>

          {/* Cultural Context / Cosmovisión Andina */}
          {word.culturalFact && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                <Sparkles size={14} />
                <span>Sabiduría y Cultura del Ecuador</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                {word.culturalFact}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onPrevWord}
            disabled={!hasPrev}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              hasPrev
                ? 'text-slate-700 hover:bg-white hover:shadow-xs'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>

          <span className="text-xs text-slate-400">
            Kichwa Unificado (ALKI)
          </span>

          <button
            type="button"
            onClick={onNextWord}
            disabled={!hasNext}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              hasNext
                ? 'text-slate-700 hover:bg-white hover:shadow-xs'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
