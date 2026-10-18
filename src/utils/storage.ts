import { UserStats, Badge } from '../types/kichwa';
import { BADGES } from '../data/kichwaData';
import confetti from 'canvas-confetti';
import { playSoundEffect } from './audio';

const STORAGE_KEY = 'kichwa_yachakuk_stats_v1';

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streakDays: 1,
  lastPlayedDate: new Date().toISOString().split('T')[0],
  wordsLearned: [],
  quizHistoryCount: 0,
  correctAnswersTotal: 0,
  unlockedBadgeIds: [],
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    
    // Check daily streak
    const today = new Date().toISOString().split('T')[0];
    const lastDate = parsed.lastPlayedDate || today;

    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastDate === yesterday) {
        // Maintained streak!
        parsed.streakDays = (parsed.streakDays || 1) + 1;
      } else {
        // Missed a day
        parsed.streakDays = 1;
      }
      parsed.lastPlayedDate = today;
      saveUserStats(parsed);
    }

    return { ...DEFAULT_STATS, ...parsed };
  } catch (err) {
    console.warn('Failed to load stats:', err);
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn('Failed to save stats:', err);
  }
}

export interface ProgressDelta {
  xpGained: number;
  newBadges: string[];
  newWordsLearned: string[];
}

export function recordQuizCompletion(
  correctCount: number,
  totalQuestions: number,
  wordIdsPracticed: string[]
): ProgressDelta {
  const current = loadUserStats();
  
  // Base XP: 15 XP per correct answer, +20 bonus for perfect score
  let xpGained = correctCount * 15;
  if (correctCount === totalQuestions && totalQuestions > 0) {
    xpGained += 25;
  }

  const updatedLearnedSet = new Set(current.wordsLearned);
  const newlyLearned: string[] = [];

  // If score is good (>= 75%), mark words as mastered
  if (correctCount / totalQuestions >= 0.7) {
    wordIdsPracticed.forEach((id) => {
      if (!updatedLearnedSet.has(id)) {
        updatedLearnedSet.add(id);
        newlyLearned.push(id);
      }
    });
  }

  const updatedTotalQuizzes = current.quizHistoryCount + 1;
  const updatedCorrectAnswers = current.correctAnswersTotal + correctCount;
  const updatedXp = current.xp + xpGained;

  // Evaluate badge unlocks
  const unlockedBadges = new Set(current.unlockedBadgeIds);
  const newlyUnlockedBadges: string[] = [];

  BADGES.forEach((badge) => {
    if (unlockedBadges.has(badge.id)) return;

    let qualifies = false;
    if (badge.id === 'primer-paso' && updatedTotalQuizzes >= 1) qualifies = true;
    if (badge.id === 'hijo-del-sol' && updatedXp >= 200) qualifies = true;
    if (badge.id === 'sabio-andino' && updatedXp >= 500 && updatedLearnedSet.size >= 25) qualifies = true;
    if (badge.id === 'maestro-numeros') {
      const numbers = ['shuk', 'ishkay', 'kimsa', 'chusku', 'pichka', 'sukta', 'kanchis', 'pusak', 'iskun', 'chunka'];
      const learnedCount = numbers.filter(n => updatedLearnedSet.has(n)).length;
      if (learnedCount >= 8) qualifies = true;
    }

    if (qualifies) {
      unlockedBadges.add(badge.id);
      newlyUnlockedBadges.push(badge.id);
    }
  });

  const newStats: UserStats = {
    ...current,
    xp: updatedXp,
    quizHistoryCount: updatedTotalQuizzes,
    correctAnswersTotal: updatedCorrectAnswers,
    wordsLearned: Array.from(updatedLearnedSet),
    unlockedBadgeIds: Array.from(unlockedBadges),
    lastPlayedDate: new Date().toISOString().split('T')[0],
  };

  saveUserStats(newStats);

  // Trigger celebration effects
  if (correctCount > 0) {
    triggerConfetti();
  }

  return {
    xpGained,
    newBadges: newlyUnlockedBadges,
    newWordsLearned: newlyLearned,
  };
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#dc2626', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
    });
    playSoundEffect('levelUp');
  } catch {
    // ignore if canvas blocked
  }
}

export function triggerStreakCelebration() {
  try {
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#d97706'],
    });
    playSoundEffect('streak');
  } catch {
    // ignore
  }
}
