/**
 * Audio synthesis and sound effects for Kichwa pronunciation and gamified feedback
 */

// Web Audio Context for immediate sound effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSoundEffect = (type: 'correct' | 'wrong' | 'click' | 'levelUp' | 'streak' | 'flip') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'click': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'flip': {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case 'correct': {
        // Pentatonic bright chime (reminiscent of Andean charango/flute harmonics)
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const nOsc = ctx.createOscillator();
          const nGain = ctx.createGain();
          nOsc.type = 'sine';
          nOsc.frequency.setValueAtTime(freq, now + idx * 0.07);
          nGain.gain.setValueAtTime(0.12, now + idx * 0.07);
          nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
          nOsc.connect(nGain);
          nGain.connect(ctx.destination);
          nOsc.start(now + idx * 0.07);
          nOsc.stop(now + idx * 0.07 + 0.26);
        });
        break;
      }

      case 'wrong': {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case 'streak':
      case 'levelUp': {
        // Andean celebration fanfare
        const fanfare = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
        fanfare.forEach((freq, idx) => {
          const nOsc = ctx.createOscillator();
          const nGain = ctx.createGain();
          nOsc.type = 'triangle';
          nOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
          nGain.gain.setValueAtTime(0.15, now + idx * 0.09);
          nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
          nOsc.connect(nGain);
          nGain.connect(ctx.destination);
          nOsc.start(now + idx * 0.09);
          nOsc.stop(now + idx * 0.09 + 0.36);
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Audio effect playback not supported:', err);
  }
};

/**
 * Phonetic adaptations to guide the Web Speech Synthesis
 * to pronounce Ecuadorian Kichwa accurately using Latin American / Spanish TTS voices
 */
function prepareKichwaPhoneticsForSpeech(text: string): string {
  let cleaned = text.toLowerCase().trim();

  // Kichwa orthographic phonetic conversion for Spanish TTS:
  // "sh" in Spanish is often read as "s" or "ch". In TTS, "ch" is close or "sh" if supported.
  // We can convert double letters and standard markers
  // "wawa" -> "huahua" or "uaua" ensures proper diphthong in Spanish TTS
  cleaned = cleaned.replace(/\bw/g, 'hu');
  cleaned = cleaned.replace(/([aeiou])w/g, '$1u');
  cleaned = cleaned.replace(/w([aeiou])/g, 'hu$1');

  // "sh" is like English "sh"; in Spanish TTS, writing "sh" is read well by modern voices, or "ch" / "s"
  // Keep clean Kichwa vowels (a, i, u)
  return cleaned;
}

export interface SpeakOptions {
  slow?: boolean;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export function speakKichwa(kichwaText: string, options: SpeakOptions = {}): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not available in this browser');
    return false;
  }

  try {
    // Cancel any previous speaking speech
    window.speechSynthesis.cancel();

    // Small beep to cue user that audio is starting
    playSoundEffect('click');

    const phoneticText = prepareKichwaPhoneticsForSpeech(kichwaText);
    const utterance = new SpeechSynthesisUtterance(phoneticText);

    // Speed adjustment: standard is ~0.85 (clear articulation), slow is ~0.55
    utterance.rate = options.slow ? 0.6 : (options.rate ?? 0.85);
    utterance.pitch = options.pitch ?? 1.05; // slightly higher pitch for clarity

    // Select the best available voice
    const voices = window.speechSynthesis.getVoices();
    
    // Look for Ecuadorian Spanish, Latin American Spanish, or Spanish in general
    const preferredVoice = voices.find(v => v.lang === 'es-EC') ||
      voices.find(v => v.lang.startsWith('es-419')) ||
      voices.find(v => v.lang.startsWith('es-MX')) ||
      voices.find(v => v.lang.startsWith('es-CO')) ||
      voices.find(v => v.lang.startsWith('es')) ||
      voices.find(v => v.lang.includes('es'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    } else {
      utterance.lang = 'es-EC';
    }

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) {
      utterance.onend = options.onEnd;
      utterance.onerror = () => options.onEnd?.();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (options.onEnd) options.onEnd();
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
