import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Sparkles } from 'lucide-react';
import { MOODS, AVAILABLE_TAGS, addMoodLog } from '../store/moodStore';
import MoodSphere from './MoodSphere';

export default function MoodLogger({ isOpen, onClose, onSaved }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [note, setNote] = useState('');
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = () => {
    if (!selectedMood) return;
    setSaving(true);

    const log = {
      moodScore: selectedMood,
      tags: selectedTags,
      energyLevel,
      note: note.trim(),
    };

    addMoodLog(log);

    setTimeout(() => {
      setSaving(false);
      setSelectedMood(null);
      setSelectedTags([]);
      setEnergyLevel(5);
      setNote('');
      setStep(1);
      onSaved?.();
      onClose();
    }, 600);
  };

  const handleClose = () => {
    setSelectedMood(null);
    setSelectedTags([]);
    setEnergyLevel(5);
    setNote('');
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          id="mood-logger-modal"
        >
          {/* Header */}
          <div className="modal-header">
            <div>
              <h2 className="modal-title">
                {step === 1 ? 'How are you feeling?' : step === 2 ? 'What happened today?' : 'Any thoughts?'}
              </h2>
              <div className="text-sm text-secondary" style={{ marginTop: 4 }}>
                Step {step} of 3
              </div>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={handleClose} id="close-mood-logger">
              <X size={20} />
            </button>
          </div>

          {/* Step 1: Mood Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 3D Sphere Preview */}
              <MoodSphere moodScore={selectedMood || 0} height={200} />

              <div className="mood-selector" style={{ marginTop: 'var(--space-xl)' }}>
                {MOODS.map(mood => (
                  <motion.div
                    key={mood.score}
                    className={`mood-option ${selectedMood === mood.score ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(mood.score)}
                    whileTap={{ scale: 0.95 }}
                    id={`mood-option-${mood.score}`}
                  >
                    <span className="mood-emoji">{mood.emoji}</span>
                    <span className="mood-label">{mood.label}</span>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-xl)' }}>
                <button
                  className="btn btn-primary"
                  disabled={!selectedMood}
                  onClick={() => setStep(2)}
                  id="mood-step-1-next"
                  style={{ opacity: selectedMood ? 1 : 0.5 }}
                >
                  Next
                  <Sparkles size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Tags + Energy */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Energy Level */}
              <div className="slider-container" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="slider-header">
                  <span className="slider-label">⚡ Energy Level</span>
                  <span className="slider-value">{energyLevel}/10</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  id="energy-slider"
                  style={{
                    background: `linear-gradient(to right, #a855f7 ${(energyLevel - 1) / 9 * 100}%, rgba(124, 58, 237, 0.1) ${(energyLevel - 1) / 9 * 100}%)`,
                  }}
                />
              </div>

              {/* Tags */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <p className="slider-label" style={{ marginBottom: 'var(--space-md)' }}>🏷️ Tags (optional)</p>
                <div className="tag-container">
                  {AVAILABLE_TAGS.map(tag => (
                    <motion.span
                      key={tag.id}
                      className={`tag ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag.id)}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tag.emoji} {tag.label}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-xl)' }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)} id="mood-step-2-next">
                  Next
                  <Sparkles size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Notes */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <textarea
                className="textarea"
                placeholder="Write about your day... (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                id="mood-note-input"
              />

              {/* Summary */}
              <div className="card" style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)' }}>
                <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-sm)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{MOODS.find(m => m.score === selectedMood)?.emoji}</span>
                  <span className="font-semibold">{MOODS.find(m => m.score === selectedMood)?.label}</span>
                  <span className="text-secondary text-sm">• Energy {energyLevel}/10</span>
                </div>
                {selectedTags.length > 0 && (
                  <div className="tag-container">
                    {selectedTags.map(tagId => {
                      const tag = AVAILABLE_TAGS.find(t => t.id === tagId);
                      return tag ? (
                        <span key={tagId} className="tag selected" style={{ cursor: 'default' }}>
                          {tag.emoji} {tag.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-xl)' }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                <motion.button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                  whileTap={{ scale: 0.95 }}
                  id="save-mood-btn"
                >
                  {saving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Entry
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
