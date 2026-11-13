/**
 * Web Audio API synthesizer for Dev eSports 40s Promo Video
 * Includes 140 BPM Heavy Trap Beat, 808 Sub-Bass, Snare, Hi-Hat rolls,
 * and Cinematic SFX (Whoosh, Bass Drop, Sniper Headshot, Coin Sound, Booyah Fanfare)
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  public isMuted: boolean = false;
  public masterVolume: number = 0.85;
  public musicVolume: number = 0.75;
  public sfxVolume: number = 0.9;
  public voiceVolume: number = 1.0;

  private isBeatPlaying: boolean = false;
  private beatIntervalId: number | null = null;
  private beatStep: number = 0;
  private bpm: number = 140;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public setVolumes(master: number, music: number, sfx: number, voice: number) {
    this.masterVolume = master;
    this.musicVolume = music;
    this.sfxVolume = sfx;
    this.voiceVolume = voice;

    if (this.ctx && !this.isMuted) {
      if (this.masterGain) this.masterGain.gain.setValueAtTime(master, this.ctx.currentTime);
      if (this.musicGain) this.musicGain.gain.setValueAtTime(music, this.ctx.currentTime);
      if (this.sfxGain) this.sfxGain.gain.setValueAtTime(sfx, this.ctx.currentTime);
    }
  }

  // --- SFX: Whoosh on Transition ---
  public playWhoosh() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.9;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.5, now);
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.18);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.42);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 0.45);
  }

  // --- SFX: Sub Bass Drop (At logo reveal & climax) ---
  public playBassDrop() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.4);
  }

  // --- SFX: Coin Pickup ("Cash Prize" sound) ---
  public playCoinSound() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    
    // First high note (B5 ~ 987.77 Hz)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(987.77, now);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second higher note (E6 ~ 1318.51 Hz)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.51, now + 0.1);
    gain2.gain.setValueAtTime(0.45, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  }

  // --- SFX: Sniper Headshot & Impact ---
  public playHeadshot() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    
    // Sharp crack
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
    oscGain.gain.setValueAtTime(0.7, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.35);

    // Sub thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.4);
    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.45);
  }

  // --- SFX: Booyah Victory Fanfare ---
  public playBooyah() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;
    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.65);
    });
  }

  // --- Trap Beat Engine ---
  public startTrapBeat() {
    if (this.isBeatPlaying) return;
    this.init();
    this.isBeatPlaying = true;
    this.beatStep = 0;

    const stepDurationMs = (60 / this.bpm / 4) * 1000; // 16th note in ms

    this.beatIntervalId = window.setInterval(() => {
      if (!this.isBeatPlaying || this.isMuted || !this.ctx || !this.musicGain) return;
      this.renderBeatStep(this.beatStep % 16);
      this.beatStep++;
    }, stepDurationMs);
  }

  public stopTrapBeat() {
    this.isBeatPlaying = false;
    if (this.beatIntervalId !== null) {
      clearInterval(this.beatIntervalId);
      this.beatIntervalId = null;
    }
  }

  private renderBeatStep(step: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    // 808 Kick on beats 0, 7, 10
    if (step === 0 || step === 7 || step === 10) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(140, now);
      kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.28);
      kickGain.gain.setValueAtTime(0.75, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      kickOsc.connect(kickGain);
      kickGain.connect(this.musicGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.35);
    }

    // Snare / Clap on beats 4 and 12
    if (step === 4 || step === 12) {
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      }
      const snareNoise = this.ctx.createBufferSource();
      snareNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(900, now);

      const snareGain = this.ctx.createGain();
      snareGain.gain.setValueAtTime(0.4, now);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      snareNoise.connect(filter);
      filter.connect(snareGain);
      snareGain.connect(this.musicGain);
      snareNoise.start(now);
      snareNoise.stop(now + 0.13);
    }

    // Fast 16th Hi-Hats with rolling triplets on steps 14, 15
    if (step % 2 === 0 || step >= 14) {
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      hatOsc.type = 'highpass' as unknown as OscillatorType;
      // create small noise pulse for hihat
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(step % 4 === 0 ? 0.3 : 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);
      noise.start(now);
      noise.stop(now + 0.04);
    }

    // Dark synth bassline stab on step 0 and 8
    if (step === 0 || step === 8) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(step === 0 ? 55 : 65.41, now); // A1 or C2
      bassGain.gain.setValueAtTime(0.25, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGain);
      bassOsc.start(now);
      bassOsc.stop(now + 0.45);
    }
  }

  // --- Voiceover Synthesis via SpeechSynthesis ---
  public speakVoiceover(text: string, onEnd?: () => void) {
    if (this.isMuted || this.voiceVolume === 0) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop prior
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to pick Indian English or Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes('hi') || v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Hindi')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Energetic dost tone settings
    utterance.rate = 1.08;  // brisk and hyped
    utterance.pitch = 1.05; // upbeat friendly
    utterance.volume = this.voiceVolume;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopAllVoice() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new SoundEngine();
