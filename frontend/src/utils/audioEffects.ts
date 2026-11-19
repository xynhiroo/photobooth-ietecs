// Web Audio API Synthesizer for Photobooth sound effects (Offline & Instant)

class PhotoboothAudio {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Countdown Beep (3... 2...)
  playCountdownBeep(frequency = 700) {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // Final high pitch tone (1...)
  playFinalCountdownBeep() {
    this.playCountdownBeep(1000);
  }

  // Realistic Camera Mechanical Shutter Click
  playShutterSound() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. Initial click (high frequency snap)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1400, now);
      clickOsc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      clickGain.gain.setValueAtTime(0.4, now);
      clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.05);

      // 2. White noise mechanical texture (mirror flap)
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1800;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now + 0.02);
      noise.stop(now + 0.1);

      // 3. Second mechanical click (curtain release)
      const releaseOsc = ctx.createOscillator();
      const releaseGain = ctx.createGain();
      releaseOsc.type = 'sine';
      releaseOsc.frequency.setValueAtTime(600, now + 0.08);
      releaseOsc.frequency.exponentialRampToValueAtTime(80, now + 0.14);
      releaseGain.gain.setValueAtTime(0.35, now + 0.08);
      releaseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      releaseOsc.connect(releaseGain);
      releaseGain.connect(ctx.destination);
      releaseOsc.start(now + 0.08);
      releaseOsc.stop(now + 0.15);
    } catch (e) {
      console.warn('Shutter sound error', e);
    }
  }

  // Success Crystal Chime (when photo is ready)
  playCrystalChime() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } catch (e) {
      console.warn('Chime error', e);
    }
  }
}

export const soundEffects = new PhotoboothAudio();
