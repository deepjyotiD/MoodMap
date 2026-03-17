// Sound Manager - Handles all UI sound effects
const SOUNDS = {
  click: {
    frequency: 800,
    duration: 0.05,
    volume: 0.3,
  },
  success: {
    frequency: 1200,
    duration: 0.08,
    volume: 0.4,
  },
  hover: {
    frequency: 600,
    duration: 0.03,
    volume: 0.15,
  },
  select: {
    frequency: 900,
    duration: 0.06,
    volume: 0.35,
  },
};

// Create a simple beep sound using Web Audio API
function playTone(frequency, duration, volume = 0.3) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.debug('Audio context not available:', e);
  }
}

export const playSound = (soundName) => {
  const sound = SOUNDS[soundName];
  if (!sound) {
    console.warn(`Sound "${soundName}" not found`);
    return;
  }
  playTone(sound.frequency, sound.duration, sound.volume);
};

export const addSoundToButton = (element, soundName = 'click') => {
  if (!element) return;

  element.addEventListener('click', () => playSound(soundName));
  element.addEventListener('mouseenter', () => playSound('hover'));
};

// Disable sounds (useful for testing or user preference)
export const SoundManager = {
  enabled: true,
  toggle: function() {
    this.enabled = !this.enabled;
    localStorage.setItem('moodmap_sound_enabled', this.enabled);
  },
  isEnabled: function() {
    const stored = localStorage.getItem('moodmap_sound_enabled');
    if (stored !== null) return stored === 'true';
    return true;
  },
  play: function(soundName) {
    if (this.isEnabled()) {
      playSound(soundName);
    }
  },
};

export default SoundManager;
