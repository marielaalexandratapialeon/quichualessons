import React from 'react';
import { KichwaWord, KichwaCategory } from '../types/kichwa';
import { WordVisual } from './WordVisual';
import { AudioButton } from './AudioButton';
import { CheckCircle2, Info } from 'lucide-react';

interface WordCardProps {
  word: KichwaWord;
  category?: KichwaCategory;
  isLearned?: boolean;
  onSelectWord: (word: KichwaWord) => void;
  onToggleLearned?: (wordId: string) => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  category,
  isLearned = false,
  onSelectWord,
  onToggleLearned,
}) => {
  return (
    <div
      onClick={() => onSelectWord(word)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-rose-300 p-4 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 overflow-hidden"
    >
      {/* Top Tag & Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {category && (
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
            {category.nameKichwa}
          </span>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          {onToggleLearned && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLearned(word.id);
              }}
              title={isLearned ? 'Palabra dominada' : 'Marcar como aprendida'}
              className={`p-1 rounded-full transition-colors ${
                isLearned
                  ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                  : 'text-slate-300 hover:text-slate-500'
              }`}
            >
              <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Illustration + Texts */}
      <div className="flex items-center gap-4 my-1">
        <WordVisual visualId={word.visualId} size="lg" animated />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-700 transition-colors tracking-tight">
              {word.kichwa}
            </h3>
          </div>

          <div className="text-xs text-rose-600/90 font-medium my-0.5 font-mono">
            {word.phonetic}
          </div>

          <p className="text-sm font-semibold text-slate-600 capitalize truncate">
            {word.spanish}
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600">
          <Info size={14} />
          <span>Ver detalle</span>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <AudioButton text={word.kichwa} size="sm" variant="secondary" label="Oír" />
        </div>
      </div>
    </div>
  );
};
