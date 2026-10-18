import React from 'react';
import { UserStats } from '../types/kichwa';
import { BADGES, KICHWA_WORDS } from '../data/kichwaData';
import { Trophy, Sparkles, Flame, CheckCircle2, Lock, Award, Heart, BookOpen, Star } from 'lucide-react';

interface StatsViewProps {
  stats: UserStats;
  onGoToQuiz: () => void;
  onGoToVocab: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  stats,
  onGoToQuiz,
  onGoToVocab,
}) => {
  // Determine rank based on XP
  let rank = 'Yachakuk (Aprendiz)';
  let nextRankXp = 200;
  let rankDesc = 'Iniciando el camino del saber andino.';
  if (stats.xp >= 500) {
    rank = 'Kichwa Amawta (Sabio Maestro)';
    nextRankXp = 1000;
    rankDesc = 'Posees un profundo dominio de la lengua y cosmovisión.';
  } else if (stats.xp >= 200) {
    rank = 'Yachak (Conocedor)';
    nextRankXp = 500;
    rankDesc = 'Comprendes términos esenciales y frases de la vida diaria.';
  }

  const xpProgressPercent = Math.min(100, Math.round((stats.xp / nextRankXp) * 100));
  const learnedPercent = Math.min(100, Math.round((stats.wordsLearned.length / KICHWA_WORDS.length) * 100));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Hero Profile Card */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 p-1 shadow-lg shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center text-amber-400">
              <Trophy size={44} />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Star size={13} />
              <span>Nivel: {rank}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kichwa Yachakuk
            </h2>
            <p className="text-sm text-slate-300">
              {rankDesc}
            </p>

            {/* XP progress bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Progreso de XP</span>
                <span>{stats.xp} / {nextRankXp} XP</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500 rounded-full"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Flame size={20} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Racha Activa</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats.streakDays} días</div>
          <p className="text-[11px] text-slate-500">Práctica constante</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Puntos XP</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats.xp}</div>
          <p className="text-[11px] text-slate-500">Experiencia ganada</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Dominadas</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.wordsLearned.length} / {KICHWA_WORDS.length}
          </div>
          <p className="text-[11px] text-slate-500">{learnedPercent}% del vocabulario</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Award size={20} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Pruebas Hechas</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.quizHistoryCount}
          </div>
          <p className="text-[11px] text-slate-500">{stats.correctAnswersTotal} aciertos totales</p>
        </div>
      </div>

      {/* Cultural Badges & Medals */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Insignias y Medallas Andinas
          </h3>
          <p className="text-xs text-slate-500">
            Logros desbloqueados mediante tu práctica y constancia
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200/80 opacity-75'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? <Award size={24} /> : <Lock size={20} />}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900">
                      {badge.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ¡Conseguida!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {badge.description}
                  </p>
                  <div className="text-[11px] font-semibold text-slate-400 pt-0.5">
                    Meta: {badge.conditionDescription}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Andean Philosophy Quote Banner */}
      <div className="bg-radial from-rose-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-lg">
        <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
          Amawtakunapak Yachay (Sabiduría Ancestral)
        </span>
        <blockquote className="text-lg sm:text-xl font-bold italic text-rose-100 max-w-xl mx-auto">
          "Ama killa, ama llulla, ama shwa — Shuk shunkuwan, shuk makiwan, shuk yuyaywan."
        </blockquote>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          No ser ocioso, no mentir, no robar. Trabajar con un solo corazón, una sola mano y un solo pensamiento. Principios del Sumak Kawsay (Buen Vivir).
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onGoToQuiz}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Practicar una prueba ahora
          </button>
          <button
            type="button"
            onClick={onGoToVocab}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Explorar más palabras
          </button>
        </div>
      </div>
    </div>
  );
};
