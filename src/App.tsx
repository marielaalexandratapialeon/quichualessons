import React, { useState, useEffect, useMemo } from 'react';
import { KichwaWord, CategoryId, UserStats } from './types/kichwa';
import { CATEGORIES, KICHWA_WORDS } from './data/kichwaData';
import { loadUserStats, saveUserStats } from './utils/storage';
import { Navbar } from './components/Navbar';
import { WordCard } from './components/WordCard';
import { WordDetailModal } from './components/WordDetailModal';
import { QuizComponent } from './components/QuizComponent';
import { StatsView } from './components/StatsView';
import { DictionaryModal } from './components/DictionaryModal';
import { AudioButton } from './components/AudioButton';
import {
  Search,
  BookOpen,
  Brain,
  Sparkles,
  Volume2,
  Info,
  CheckCircle2,
  HelpCircle,
  Filter,
  SlidersHorizontal,
  GraduationCap,
  Sun,
  Flame,
  Globe2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'vocab' | 'quiz' | 'stats' | 'dictionary'>('vocab');
  const [userStats, setUserStats] = useState<UserStats>(loadUserStats());
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<KichwaWord | null>(null);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [showPronunciationGuide, setShowPronunciationGuide] = useState(false);

  // Sync stats
  const refreshStats = () => {
    setUserStats(loadUserStats());
  };

  const handleToggleLearned = (wordId: string) => {
    const current = loadUserStats();
    const set = new Set(current.wordsLearned);
    if (set.has(wordId)) {
      set.delete(wordId);
    } else {
      set.add(wordId);
    }
    const updated = {
      ...current,
      wordsLearned: Array.from(set),
    };
    saveUserStats(updated);
    setUserStats(updated);
  };

  // Filter words
  const filteredWords = useMemo(() => {
    return KICHWA_WORDS.filter((word) => {
      const matchesCategory =
        selectedCategory === 'all' || word.categoryId === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        word.kichwa.toLowerCase().includes(q) ||
        word.spanish.toLowerCase().includes(q) ||
        word.phonetic.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Modal Next/Prev navigation
  const currentModalIndex = useMemo(() => {
    if (!selectedWord) return -1;
    return filteredWords.findIndex((w) => w.id === selectedWord.id);
  }, [selectedWord, filteredWords]);

  const handleNextWord = () => {
    if (currentModalIndex >= 0 && currentModalIndex + 1 < filteredWords.length) {
      setSelectedWord(filteredWords[currentModalIndex + 1]);
    }
  };

  const handlePrevWord = () => {
    if (currentModalIndex > 0) {
      setSelectedWord(filteredWords[currentModalIndex - 1]);
    }
  };

  const selectedWordCategory = useMemo(() => {
    if (!selectedWord) return undefined;
    return CATEGORIES.find((c) => c.id === selectedWord.categoryId);
  }, [selectedWord]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStats={userStats}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ================= TAB 1: VOCABULARIO ================= */}
        {activeTab === 'vocab' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Hero Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-red-700 via-rose-700 to-amber-600 text-white p-6 sm:p-10 shadow-lg overflow-hidden">
              {/* Andean decorative pattern overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-amber-200 border border-white/20">
                  <Sun size={14} className="text-amber-300" />
                  <span>Kichwa Unificado del Ecuador (ALKI)</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Aprende Kichwa con Audio e Ilustraciones
                </h1>

                <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
                  Explora las palabras categorizadas como colores, números, saludos, animales andinos y alimentos. Escucha la pronunciación auténtica y pon a prueba tus conocimientos.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('quiz')}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Brain size={18} />
                    <span>Hacer pruebas de práctica</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPronunciationGuide(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle size={17} />
                    <span>Guía de pronunciación</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Chips Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter size={13} />
                  <span>Categorías Temáticas</span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredWords.length} términos disponibles
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === 'all'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Tukuy (Todos • {KICHWA_WORDS.length})
                </button>

                {CATEGORIES.map((cat) => {
                  const count = KICHWA_WORDS.filter((w) => w.categoryId === cat.id).length;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-200'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.nameKichwa}</span>
                      <span className="text-xs opacity-75">({cat.nameSpanish})</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por palabra en Kichwa o Español (ej. Alli puncha, Puka, Shuk, Kuri, Sol...)"
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Word Cards Grid */}
            {filteredWords.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
                <p className="text-lg font-bold text-slate-700">No se encontraron términos</p>
                <p className="text-xs text-slate-400">Intenta buscar con otra palabra o selecciona otra categoría.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                >
                  Ver todo el vocabulario
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWords.map((word) => {
                  const cat = CATEGORIES.find((c) => c.id === word.categoryId);
                  const isLearned = userStats.wordsLearned.includes(word.id);

                  return (
                    <WordCard
                      key={word.id}
                      word={word}
                      category={cat}
                      isLearned={isLearned}
                      onSelectWord={(w) => setSelectedWord(w)}
                      onToggleLearned={handleToggleLearned}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: PRUEBAS INTERACTIVAS ================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                <Brain size={14} />
                <span>Pruebas Interactivas de Vocabulario</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pon a prueba lo aprendido
              </h2>
              <p className="text-sm text-slate-500">
                Elige tu modo favorito: selección múltiple, escucha auditiva, juego de memoria o deletreo.
              </p>
            </div>

            <QuizComponent
              initialCategory={selectedCategory}
              onStatsUpdated={refreshStats}
            />
          </div>
        )}

        {/* ================= TAB 3: PROGRESO Y MEDALLAS ================= */}
        {activeTab === 'stats' && (
          <StatsView
            stats={userStats}
            onGoToQuiz={() => setActiveTab('quiz')}
            onGoToVocab={() => setActiveTab('vocab')}
          />
        )}
      </main>

      {/* Word Detail Modal */}
      <WordDetailModal
        word={selectedWord}
        category={selectedWordCategory}
        isLearned={selectedWord ? userStats.wordsLearned.includes(selectedWord.id) : false}
        onClose={() => setSelectedWord(null)}
        onToggleLearned={handleToggleLearned}
        onNextWord={handleNextWord}
        onPrevWord={handlePrevWord}
        hasNext={currentModalIndex >= 0 && currentModalIndex + 1 < filteredWords.length}
        hasPrev={currentModalIndex > 0}
      />

      {/* Quick Dictionary Modal */}
      <DictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        onSelectWord={(word) => setSelectedWord(word)}
      />

      {/* Pronunciation Guide Modal */}
      {showPronunciationGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <Volume2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Guía de Pronunciación Kichwa
                  </h3>
                  <p className="text-xs text-slate-500">
                    Alfabeto Unificado Kichwa del Ecuador (ALKI)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPronunciationGuide(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="font-bold text-amber-800">Tres vocales puras:</span>
                <p className="text-amber-950">
                  En Kichwa unificado solo existen 3 vocales: <strong>a, i, u</strong>. No existen las vocales 'e' ni 'o' en la escritura unificada.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">Consonantes clave:</span>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-rose-600 font-mono text-base shrink-0">sh</strong>
                    <span>Como la "sh" del inglés (ej. <em>shuk</em>, <em>ishkay</em>, <em>chishi</em>).</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-rose-600 font-mono text-base shrink-0">ll</strong>
                    <span>Pronunciada como /zh/ o /y/ suave en la sierra ecuatoriana (ej. <em>alli</em>, <em>waylla</em>).</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-rose-600 font-mono text-base shrink-0">w</strong>
                    <span>Como la semivocal "hu" o "u" (ej. <em>wawa</em> [huahua], <em>wayra</em> [huayra]).</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-rose-600 font-mono text-base shrink-0">k</strong>
                    <span>Siempre con sonido fuerte /k/ como en kilo o casa (ej. <em>kuri</em>, <em>kuntur</em>).</span>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">Acentuación regular:</span>
                <p className="text-rose-950">
                  Casi todas las palabras en Kichwa son <strong>graves (llanas)</strong>: el acento recae naturalmente en la penúltima sílaba (ej. <em>I-ma-NAL-la</em>, <em>AL-li PUNCH-a</em>, <em>Yup-ay-CHA-ni</em>).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPronunciationGuide(false)}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm cursor-pointer hover:bg-slate-800 transition-colors"
            >
              Entendido, volver a aprender
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-700">
          <Globe2 size={16} className="text-rose-600" />
          <span>Yachakuna Kichwa • Lengua ancestral y oficial de relación intercultural del Ecuador</span>
        </div>
        <p>
          Basado en el Kichwa Unificado (ALKI - Academia de la Lengua Kichwa del Ecuador).
        </p>
        <p className="text-[11px] text-slate-400">
          "Alli shamushka kapay kichwa shimita yachankapak" (Bienvenido a aprender el idioma kichwa)
        </p>
      </footer>
    </div>
  );
}
