/**
 * MI RUTINA DIARIA — GESTOR DE AUDIO (AUDIO.JS)
 * Control de reproducción de voz, prevención de solapamientos y manejo de autoplay.
 */

import { ASSETS } from './assets.js';
import { state } from './state.js';

class AudioManager {
  constructor() {
    this.currentInstructionAudio = null;
    this.currentSoundAudio = null;
    this.lastInstructionKey = null;
    this.hasUserInteracted = false;
    this.pendingAudio = null;

    // Escuchar primera interacción para desbloquear el AudioContext del navegador
    const unlockAudio = () => {
      this.hasUserInteracted = true;
      if (this.pendingAudio) {
        this.playInstruction(this.pendingAudio);
        this.pendingAudio = null;
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
  }

  /**
   * Reproduce una instrucción o narración de voz principal.
   * Detiene automáticamente cualquier instrucción anterior para evitar solapamientos.
   */
  playInstruction(audioKey, onEnded = null) {
    if (state.get().audioMuted) return null;

    this.lastInstructionKey = audioKey;
    this.stopCurrentInstruction();

    const url = ASSETS.getAudioUrl(audioKey);
    const audio = new Audio(url);
    this.currentInstructionAudio = audio;

    audio.addEventListener('ended', () => {
      if (this.currentInstructionAudio === audio) {
        this.currentInstructionAudio = null;
      }
      if (typeof onEnded === 'function') {
        onEnded();
      }
    });

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        // Bloqueo de autoplay por políticas del navegador
        if (!this.hasUserInteracted) {
          this.pendingAudio = audioKey;
        }
        console.warn(`Autoplay bloqueado para audio ${audioKey}:`, err.message);
      });
    }

    return audio;
  }

  /**
   * Reproduce un efecto sonoro corto o retroalimentación.
   */
  playSound(audioKey, onEnded = null) {
    if (state.get().audioMuted) return null;

    const url = ASSETS.getAudioUrl(audioKey);
    const sound = new Audio(url);

    if (onEnded) {
      sound.addEventListener('ended', onEnded);
    }

    const p = sound.play();
    if (p) {
      p.catch(e => console.warn('Efecto sonoro no pudo reproducirse:', e.message));
    }

    return sound;
  }

  /**
   * Detiene la narración activa.
   */
  stopCurrentInstruction() {
    if (this.currentInstructionAudio) {
      this.currentInstructionAudio.pause();
      this.currentInstructionAudio.currentTime = 0;
      this.currentInstructionAudio = null;
    }
  }

  /**
   * Vuelve a reproducir la última instrucción dada (botón 🔊).
   */
  replayLastInstruction() {
    if (this.lastInstructionKey) {
      this.playInstruction(this.lastInstructionKey);
    }
  }
}

export const soundManager = new AudioManager();
