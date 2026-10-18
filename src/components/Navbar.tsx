import React from 'react';
import { UserStats } from '../types/kichwa';
import { Sparkles, Flame, BookOpen, Brain, Trophy, Search, Sun } from 'lucide-react';

interface NavbarProps {
  activeTab: 'vocab' | 'quiz' | 'stats' | 'dictionary';
  setActiveTab: (tab: 'vocab' | 'quiz' | 'stats' | 'dictionary') => void;
  userStats: UserStats;
  onOpenDictionary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userStats,
  onOpenDictionary,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Andean textile traditional top ribbon */}
      <div className="h-2 w-full andean-faja" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('vocab')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <Sun size={24} className="animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1">
                Yachakuna <span className="text-rose-600">Kichwa</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-0.5">
                Runa Shimi • Ecuador
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('vocab')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'vocab'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen size={15} />
              <span>Vocabulario</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Brain size={15} />
              <span>Pruebas Interactivas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'stats'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy size={15} />
              <span>Progreso y Medallas</span>
            </button>
          </nav>

          {/* Right Stats & Quick Search */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenDictionary}
              title="Buscar en el diccionario rápido"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search size={15} />
              <span className="hidden sm:inline">Buscar palabra</span>
            </button>

            {/* Streak Pill */}
            <div
              title={`${userStats.streakDays} días de racha aprendiendo`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-extrabold"
            >
              <Flame size={15} className="text-orange-500 fill-orange-500" />
              <span>{userStats.streakDays}d</span>
            </div>

            {/* XP Pill */}
            <div
              title={`${userStats.xp} puntos de experiencia acumulados`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold"
            >
              <Sparkles size={14} className="text-amber-500 fill-amber-500" />
              <span>{userStats.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('vocab')}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-1 ${
              activeTab === 'vocab' ? 'bg-rose-50 text-rose-700' : 'text-slate-600'
            }`}
          >
            <BookOpen size={14} />
            <span>Vocabulario</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-1 ${
              activeTab === 'quiz' ? 'bg-rose-50 text-rose-700' : 'text-slate-600'
            }`}
          >
            <Brain size={14} />
            <span>Pruebas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`py-1.5 px-3 rounded-lg flex items-center gap-1 ${
              activeTab === 'stats' ? 'bg-rose-50 text-rose-700' : 'text-slate-600'
            }`}
          >
            <Trophy size={14} />
            <span>Medallas</span>
          </button>
        </div>
      </div>
    </header>
  );
};
