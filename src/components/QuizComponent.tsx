import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { KichwaWord, CategoryId, QuizMode } from '../types/kichwa';
import { CATEGORIES, KICHWA_WORDS } from '../data/kichwaData';
import { WordVisual } from './WordVisual';
import { AudioButton } from './AudioButton';
import { playSoundEffect, speakKichwa } from '../utils/audio';
import { recordQuizCompletion } from '../utils/storage';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Volume2,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Award,
  Layers,
  Headphones,
  Keyboard,
  Shuffle
} from 'lucide-react';

interface QuizComponentProps {
  initialCategory?: CategoryId | 'all';
  onStatsUpdated: () => void;
}

interface Question {
  type: 'kichwa-to-spanish' | 'spanish-to-kichwa' | 'listening';
  targetWord: KichwaWord;
  prompt: string;
  options: {
    label: string;
    word: KichwaWord;
    isCorrect: boolean;
  }[];
}

interface MemoryCard {
  id: string;
  wordId: string;
  type: 'kichwa' | 'spanish';
  text: string;
  visualId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  initialCategory = 'all',
  onStatsUpdated,
}) => {
  // Mode selection: 'multiple-choice' | 'listening' | 'memory' | 'spelling'
  const [selectedMode, setSelectedMode] = useState<QuizMode>('multiple-choice');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [quizState, setQuizState] = useState<'setup' | 'playing' | 'results'>('setup');
  
  // Quiz progress
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [practicedWordIds, setPracticedWordIds] = useState<string[]>([]);
  const [quizLength, setQuizLength] = useState<number>(5);

  // Spelling mode states
  const [spellingWord, setSpellingWord] = useState<KichwaWord | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<{ id: string; letter: string; used: boolean }[]>([]);
  const [typedLetters, setTypedLetters] = useState<{ id: string; letter: string }[]>([]);
  const [spellingFeedback, setSpellingFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Memory mode states
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryMatches, setMemoryMatches] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Filter pool of words
  const availableWords = useMemo(() => {
    if (selectedCategory === 'all') return KICHWA_WORDS;
    return KICHWA_WORDS.filter((w) => w.categoryId === selectedCategory);
  }, [selectedCategory]);

  // Setup Standard/Listening Quiz
  const startQuiz = useCallback(() => {
    if (availableWords.length < 4) {
      alert('Esta categoría requiere al menos 4 palabras para generar opciones.');
      return;
    }

    // Shuffle words and pick questions
    const shuffledPool = [...availableWords].sort(() => 0.5 - Math.random());
    const count = Math.min(quizLength, shuffledPool.length);
    const chosenWords = shuffledPool.slice(0, count);

    const generatedQuestions: Question[] = chosenWords.map((target) => {
      // Pick 3 wrong options
      const wrongPool = KICHWA_WORDS.filter((w) => w.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptionsWords = [...wrongPool, target].sort(() => 0.5 - Math.random());

      let type: 'kichwa-to-spanish' | 'spanish-to-kichwa' | 'listening' = 'kichwa-to-spanish';
      if (selectedMode === 'listening') {
        type = 'listening';
      } else {
        type = Math.random() > 0.5 ? 'kichwa-to-spanish' : 'spanish-to-kichwa';
      }

      let prompt = '';
      if (type === 'listening') {
        prompt = '¿Qué palabra acabas de escuchar en Kichwa?';
      } else if (type === 'kichwa-to-spanish') {
        prompt = `¿Cuál es el significado de "${target.kichwa}" en español?`;
      } else {
        prompt = `¿Cómo se dice "${target.spanish}" en Kichwa?`;
      }

      const options = allOptionsWords.map((w) => ({
        label: type === 'kichwa-to-spanish' ? w.spanish : w.kichwa,
        word: w,
        isCorrect: w.id === target.id,
      }));

      return {
        type,
        targetWord: target,
        prompt,
        options,
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setPracticedWordIds([]);
    setQuizState('playing');

    // Auto-play audio on listening mode
    if (selectedMode === 'listening' && generatedQuestions[0]) {
      setTimeout(() => {
        speakKichwa(generatedQuestions[0].targetWord.kichwa);
      }, 350);
    }
  }, [availableWords, quizLength, selectedMode]);

  // Setup Memory Mode
  const startMemoryGame = useCallback(() => {
    const shuffledPool = [...availableWords].sort(() => 0.5 - Math.random());
    const chosen = shuffledPool.slice(0, 6); // 6 pairs = 12 cards

    const cards: MemoryCard[] = [];
    chosen.forEach((w) => {
      // Kichwa card
      cards.push({
        id: `k-${w.id}`,
        wordId: w.id,
        type: 'kichwa',
        text: w.kichwa,
        visualId: w.visualId,
        isFlipped: false,
        isMatched: false,
      });
      // Spanish card
      cards.push({
        id: `s-${w.id}`,
        wordId: w.id,
        type: 'spanish',
        text: w.spanish,
        visualId: w.visualId,
        isFlipped: false,
        isMatched: false,
      });
    });

    setMemoryCards(cards.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMemoryMatches(0);
    setMemoryMoves(0);
    setQuizState('playing');
  }, [availableWords]);

  // Setup Spelling Mode
  const startSpellingGame = useCallback(() => {
    const shuffledPool = [...availableWords].sort(() => 0.5 - Math.random());
    const word = shuffledPool[0];
    if (!word) return;

    setupSpellingWord(word);
    setScore(0);
    setPracticedWordIds([]);
    setCurrentIndex(0);
    setQuizState('playing');
  }, [availableWords]);

  const setupSpellingWord = (word: KichwaWord) => {
    setSpellingWord(word);
    setSpellingFeedback('idle');
    setTypedLetters([]);

    // Letters array
    const cleanLetters = word.kichwa.replace(/\s+/g, '').split('');
    const scrambled = cleanLetters
      .map((letter, idx) => ({ id: `${letter}-${idx}-${Math.random()}`, letter, used: false }))
      .sort(() => 0.5 - Math.random());

    setScrambledLetters(scrambled);
    setTimeout(() => {
      speakKichwa(word.kichwa);
    }, 300);
  };

  // Handle Answer in Multiple Choice / Listening
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;

    setSelectedOptionIndex(idx);
    setIsAnswerSubmitted(true);

    const currentQ = questions[currentIndex];
    const isCorrect = currentQ.options[idx].isCorrect;

    // Track word
    setPracticedWordIds((prev) => [...prev, currentQ.targetWord.id]);

    if (isCorrect) {
      playSoundEffect('correct');
      setScore((prev) => prev + 1);
    } else {
      playSoundEffect('wrong');
    }

    // Play pronunciation of target word
    speakKichwa(currentQ.targetWord.kichwa);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);

      if (selectedMode === 'listening' && questions[nextIndex]) {
        setTimeout(() => {
          speakKichwa(questions[nextIndex].targetWord.kichwa);
        }, 300);
      }
    } else {
      // Quiz finished
      finishQuiz(score, questions.length, practicedWordIds);
    }
  };

  // Memory card click
  const handleCardClick = (idx: number) => {
    if (flippedCards.length >= 2) return;
    const card = memoryCards[idx];
    if (card.isFlipped || card.isMatched) return;

    playSoundEffect('flip');
    const newCards = [...memoryCards];
    newCards[idx].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedCards, idx];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const first = newCards[newFlipped[0]];
      const second = newCards[newFlipped[1]];

      if (first.wordId === second.wordId && first.type !== second.type) {
        // Matched!
        playSoundEffect('correct');
        speakKichwa(first.type === 'kichwa' ? first.text : second.text);
        setTimeout(() => {
          first.isMatched = true;
          second.isMatched = true;
          setMemoryCards([...newCards]);
          setFlippedCards([]);
          const updatedMatches = memoryMatches + 1;
          setMemoryMatches(updatedMatches);

          if (updatedMatches === 6) {
            // Won game
            finishQuiz(6, 6, memoryCards.map((c) => c.wordId));
          }
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          first.isFlipped = false;
          second.isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  // Spelling tile click
  const handlePickLetter = (tileId: string) => {
    if (spellingFeedback === 'correct') return;
    const tile = scrambledLetters.find((t) => t.id === tileId);
    if (!tile || tile.used) return;

    playSoundEffect('click');
    tile.used = true;
    const newTyped = [...typedLetters, { id: tile.id, letter: tile.letter }];
    setTypedLetters(newTyped);

    if (!spellingWord) return;
    const targetSpelling = spellingWord.kichwa.replace(/\s+/g, '');
    const currentWord = newTyped.map((t) => t.letter).join('');

    if (currentWord.length === targetSpelling.length) {
      if (currentWord.toLowerCase() === targetSpelling.toLowerCase()) {
        playSoundEffect('correct');
        setSpellingFeedback('correct');
        setScore((s) => s + 1);
        setPracticedWordIds((p) => [...p, spellingWord.id]);
        speakKichwa(spellingWord.kichwa);
      } else {
        playSoundEffect('wrong');
        setSpellingFeedback('wrong');
      }
    }
  };

  const handleRemoveLetter = (index: number) => {
    if (spellingFeedback === 'correct') return;
    const removed = typedLetters[index];
    const newTyped = typedLetters.filter((_, i) => i !== index);
    setTypedLetters(newTyped);

    // restore in scrambled
    const orig = scrambledLetters.find((t) => t.id === removed.id);
    if (orig) orig.used = false;
    setScrambledLetters([...scrambledLetters]);
    setSpellingFeedback('idle');
  };

  const handleNextSpellingWord = () => {
    if (currentIndex + 1 < quizLength) {
      setCurrentIndex((i) => i + 1);
      const remaining = availableWords.filter((w) => w.id !== spellingWord?.id);
      const nextWord = remaining[Math.floor(Math.random() * remaining.length)] || availableWords[0];
      setupSpellingWord(nextWord);
    } else {
      finishQuiz(score + (spellingFeedback === 'correct' ? 1 : 0), quizLength, practicedWordIds);
    }
  };

  const finishQuiz = (finalScore: number, total: number, words: string[]) => {
    recordQuizCompletion(finalScore, total, words);
    onStatsUpdated();
    setQuizState('results');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Quiz Top Mode Selector (when in setup) */}
      {quizState === 'setup' && (
        <div className="space-y-6">
          {/* Mode Selector Cards */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
              Selecciona el modo de práctica
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode('multiple-choice')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  selectedMode === 'multiple-choice'
                    ? 'border-rose-500 bg-rose-50/50 shadow-sm ring-2 ring-rose-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                  <Layers size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Yachay Quiz (Opción Múltiple)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preguntas con ilustraciones, audio y 4 opciones de respuesta rápida.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('listening')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  selectedMode === 'listening'
                    ? 'border-sky-500 bg-sky-50/50 shadow-sm ring-2 ring-sky-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 shrink-0">
                  <Headphones size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Uyashpa Yachana (Escucha y Acierta)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Entrena tu oído con audio kichwa auténtico y elige el término correcto.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('memory')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  selectedMode === 'memory'
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                  <Shuffle size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Tarjetakuna (Juego de Memoria)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Empareja cartas volteadas de Kichwa con su traducción al español.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('spelling')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  selectedMode === 'spelling'
                    ? 'border-purple-500 bg-purple-50/50 shadow-sm ring-2 ring-purple-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                  <Keyboard size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Killkana (Construye la Palabra)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ordena las letras desordenadas para escribir la palabra correctamente.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Filtrar por categoría temática
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                    selectedCategory === 'all'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tukuy (Todas las palabras • {KICHWA_WORDS.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                      selectedCategory === cat.id
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.nameKichwa} ({cat.nameSpanish})
                  </button>
                ))}
              </div>
            </div>

            {/* Questions count (except memory) */}
            {selectedMode !== 'memory' && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Cantidad de preguntas:
                </span>
                <div className="flex items-center gap-2">
                  {[5, 10, 15].map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setQuizLength(len)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                        quizLength === len
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Start CTA */}
          <button
            type="button"
            onClick={() => {
              if (selectedMode === 'memory') startMemoryGame();
              else if (selectedMode === 'spelling') startSpellingGame();
              else startQuiz();
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Sparkles size={20} />
            <span>¡Comenzar práctica interactiva!</span>
          </button>
        </div>
      )}

      {/* QUIZ PLAYING - MULTIPLE CHOICE & LISTENING */}
      {quizState === 'playing' && (selectedMode === 'multiple-choice' || selectedMode === 'listening') && questions[currentIndex] && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Progress bar */}
          <div className="h-2 bg-slate-100 w-full">
            <div
              className="h-full bg-rose-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Top info: question count & score */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>
                Pregunta {currentIndex + 1} de {questions.length}
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-extrabold">
                <Flame size={14} />
                Aciertos: {score}
              </span>
            </div>

            {/* Prompt header */}
            <div className="text-center space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {questions[currentIndex].prompt}
              </h3>

              {/* In listening mode, prominent audio player */}
              {questions[currentIndex].type === 'listening' ? (
                <div className="flex flex-col items-center justify-center py-4 bg-sky-50 rounded-2xl border border-sky-100">
                  <div className="animate-pulse-subtle mb-3">
                    <AudioButton
                      text={questions[currentIndex].targetWord.kichwa}
                      size="lg"
                      label="Escuchar de nuevo"
                    />
                  </div>
                  <p className="text-xs text-sky-800 font-medium">
                    Haz clic para volver a oír la pronunciación
                  </p>
                </div>
              ) : (
                /* In visual mode, show illustration & audio */
                <div className="flex flex-col items-center justify-center pt-2">
                  <WordVisual
                    visualId={questions[currentIndex].targetWord.visualId}
                    size="xl"
                    className="shadow-sm mb-2"
                  />
                  {questions[currentIndex].type === 'kichwa-to-spanish' && (
                    <div className="flex items-center gap-2">
                      <AudioButton
                        text={questions[currentIndex].targetWord.kichwa}
                        size="sm"
                        variant="secondary"
                      />
                      <span className="text-xs font-mono text-slate-500">
                        {questions[currentIndex].targetWord.phonetic}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {questions[currentIndex].options.map((option, idx) => {
                let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

                if (isAnswerSubmitted) {
                  if (option.isCorrect) {
                    btnStyle = 'bg-emerald-500 border-emerald-600 text-white font-bold shadow-sm';
                  } else if (selectedOptionIndex === idx) {
                    btnStyle = 'bg-rose-500 border-rose-600 text-white font-bold';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border text-left font-semibold text-base transition-all flex items-center justify-between cursor-pointer active:scale-98 ${btnStyle}`}
                  >
                    <span>{option.label}</span>
                    {isAnswerSubmitted && option.isCorrect && (
                      <CheckCircle size={20} className="text-white shrink-0" />
                    )}
                    {isAnswerSubmitted && selectedOptionIndex === idx && !option.isCorrect && (
                      <XCircle size={20} className="text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Continue */}
            {isAnswerSubmitted && (
              <div className="pt-4 border-t border-slate-100 animate-in fade-in duration-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {questions[currentIndex].options[selectedOptionIndex ?? 0]?.isCorrect ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <CheckCircle size={16} />
                        <span>¡Allimi kan! (¡Correcto!)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-700 font-bold text-sm bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                        <XCircle size={16} />
                        <span>
                          Respuesta correcta: {questions[currentIndex].targetWord.kichwa} ={' '}
                          {questions[currentIndex].targetWord.spanish}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ml-auto"
                  >
                    <span>
                      {currentIndex + 1 < questions.length ? 'Siguiente' : 'Ver resultados'}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {questions[currentIndex].targetWord.culturalFact && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                    💡 <strong>Dato cultural:</strong> {questions[currentIndex].targetWord.culturalFact}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUIZ PLAYING - MEMORY MODE */}
      {quizState === 'playing' && selectedMode === 'memory' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-sm font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>Parejas encontradas:</span>
              <span className="text-emerald-600 font-extrabold">{memoryMatches} / 6</span>
            </div>
            <div className="text-slate-400">
              Movimientos: {memoryMoves}
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {memoryCards.map((card, idx) => {
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`h-28 sm:h-32 rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all duration-300 cursor-pointer select-none ${
                    card.isMatched
                      ? 'border-emerald-400 bg-emerald-50 opacity-90'
                      : isRevealed
                      ? 'border-amber-400 bg-amber-50 shadow-md'
                      : 'border-slate-200 bg-radial from-slate-100 to-slate-200 hover:border-slate-300 hover:scale-102'
                  }`}
                >
                  {isRevealed ? (
                    <div className="flex flex-col items-center justify-center space-y-1">
                      {card.type === 'kichwa' && (
                        <WordVisual visualId={card.visualId} size="sm" className="mb-1" />
                      )}
                      <span className={`font-bold leading-tight ${card.type === 'kichwa' ? 'text-sm text-rose-700' : 'text-xs text-slate-800'}`}>
                        {card.text}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {card.type === 'kichwa' ? 'Kichwa' : 'Español'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-400 font-extrabold text-xl">
                      ✦
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center text-xs text-slate-500">
            Encuentra las 6 parejas volteando una palabra en Kichwa y su significado en español.
          </div>
        </div>
      )}

      {/* QUIZ PLAYING - SPELLING MODE */}
      {quizState === 'playing' && selectedMode === 'spelling' && spellingWord && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Palabra {currentIndex + 1} de {quizLength}</span>
            <span className="text-amber-600 font-bold">Aciertos: {score}</span>
          </div>

          <div className="text-center space-y-2">
            <WordVisual visualId={spellingWord.visualId} size="xl" className="mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 capitalize">
              {spellingWord.spanish}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <AudioButton text={spellingWord.kichwa} size="sm" label="Escuchar pronunciación" />
              <span className="text-xs text-slate-400 font-mono">
                {spellingWord.phonetic}
              </span>
            </div>
          </div>

          {/* Slots for typed letters */}
          <div className="flex items-center justify-center gap-2 flex-wrap min-h-12 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {typedLetters.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                Haz clic en las letras abajo para formar la palabra en Kichwa
              </span>
            ) : (
              typedLetters.map((tl, i) => (
                <button
                  key={`${tl.id}-${i}`}
                  type="button"
                  onClick={() => handleRemoveLetter(i)}
                  className="w-10 h-10 rounded-xl bg-white border-2 border-rose-400 text-rose-700 font-extrabold text-lg shadow-xs hover:bg-rose-50 cursor-pointer flex items-center justify-center transition-transform hover:scale-105"
                >
                  {tl.letter}
                </button>
              ))
            )}
          </div>

          {/* Feedback */}
          {spellingFeedback === 'correct' && (
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle size={18} />
              <span>¡Sumak! ¡Escribiste "{spellingWord.kichwa}" a la perfección!</span>
            </div>
          )}

          {spellingFeedback === 'wrong' && (
            <div className="flex items-center justify-center gap-2 text-rose-700 font-bold text-xs bg-rose-50 p-2 rounded-xl border border-rose-200">
              <XCircle size={16} />
              <span>Casi, revisa las letras haciendo clic sobre ellas para corregir.</span>
            </div>
          )}

          {/* Scrambled letter tiles */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap pt-2">
            {scrambledLetters.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={t.used || spellingFeedback === 'correct'}
                onClick={() => handlePickLetter(t.id)}
                className={`w-11 h-11 rounded-xl font-extrabold text-lg transition-all cursor-pointer shadow-xs ${
                  t.used
                    ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed scale-90'
                    : 'bg-slate-900 text-white hover:bg-rose-600 hover:scale-105 active:scale-95'
                }`}
              >
                {t.letter}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setupSpellingWord(spellingWord)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reiniciar letras</span>
            </button>

            {spellingFeedback === 'correct' && (
              <button
                type="button"
                onClick={handleNextSpellingWord}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ml-auto"
              >
                <span>{currentIndex + 1 < quizLength ? 'Siguiente palabra' : 'Ver resultados'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ RESULTS SCREEN */}
      {quizState === 'results' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-600 shadow-inner">
            <Trophy size={40} className="animate-bounce" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ¡Yachay paktashka! (¡Práctica completada!)
            </h3>
            <p className="text-sm text-slate-500">
              Tu esfuerzo fortalece el conocimiento de la lengua y cultura Kichwa.
            </p>
          </div>

          {/* Score card */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase">Aciertos</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {score} / {selectedMode === 'memory' ? 6 : quizLength}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-700 uppercase">Puntos Ganados</span>
              <div className="text-2xl font-extrabold text-amber-700 mt-1 flex items-center justify-center gap-1">
                <Sparkles size={20} />
                +{score * 15} XP
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                if (selectedMode === 'memory') startMemoryGame();
                else if (selectedMode === 'spelling') startSpellingGame();
                else startQuiz();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>Volver a practicar este modo</span>
            </button>

            <button
              type="button"
              onClick={() => setQuizState('setup')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Elegir otro modo o categoría</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
