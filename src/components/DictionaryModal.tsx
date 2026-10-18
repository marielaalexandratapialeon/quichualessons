import React, { useState, useMemo } from 'react';
import { KichwaWord } from '../types/kichwa';
import { KICHWA_WORDS, CATEGORIES } from '../data/kichwaData';
import { WordVisual } from './WordVisual';
import { AudioButton } from './AudioButton';
import { Search, X, Sparkles, BookOpen } from 'lucide-react';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord: (word: KichwaWord) => void;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  isOpen,
  onClose,
  onSelectWord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return KICHWA_WORDS;
    return KICHWA_WORDS.filter(
      (w) =>
        w.kichwa.toLowerCase().includes(q) ||
        w.spanish.toLowerCase().includes(q) ||
        w.phonetic.toLowerCase().includes(q) ||
        (w.culturalFact && w.culturalFact.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Diccionario Rápido Kichwa - Español
              </h3>
              <p className="text-xs text-slate-500">
                Encuentra cualquier término con pronunciación y significado
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por palabra en Kichwa o Español (ej. Puka, Sol, Shuk, Saludo...)"
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-500">
            <span>Resultados: {filteredWords.length} palabras</span>
            <span>Kichwa Unificado del Ecuador</span>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-base font-semibold">No se encontraron términos para "{searchQuery}"</p>
              <p className="text-xs mt-1">Prueba con palabras como "rojo", "allku", "sol", "urku", "chunka"</p>
            </div>
          ) : (
            filteredWords.map((word) => {
              const category = CATEGORIES.find((c) => c.id === word.categoryId);
              return (
                <div
                  key={word.id}
                  onClick={() => {
                    onSelectWord(word);
                    onClose();
                  }}
                  className="p-3 rounded-2xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <WordVisual visualId={word.visualId} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 group-hover:text-rose-700 text-sm">
                          {word.kichwa}
                        </span>
                        <span className="text-[11px] font-mono text-rose-600">
                          {word.phonetic}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 capitalize truncate">
                        {word.spanish}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {category && (
                      <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {category.nameKichwa}
                      </span>
                    )}
                    <AudioButton text={word.kichwa} size="sm" variant="ghost" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
