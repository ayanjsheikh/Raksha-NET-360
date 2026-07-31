// Web Audio API Synthesizer Engine for Emergency SOS & Siren Alarms

class AudioEngine {
  private ctx: AudioContext | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private sirenInterval: any = null;
  private isSirenActive: boolean = false;
  private masterVolume: number = 0.8;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  // Play short hold countdown tick
  public playCountdownTick(pitch = 800) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15 * this.masterVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio Context error", e);
    }
  }

  // Start continuous loud police/emergency siren
  public startSiren() {
    if (this.isSirenActive) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.isSirenActive = true;
      const now = this.ctx.currentTime;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.masterVolume, now);
      this.gainNode.connect(this.ctx.destination);

      this.sirenOsc1 = this.ctx.createOscillator();
      this.sirenOsc2 = this.ctx.createOscillator();

      this.sirenOsc1.type = "sawtooth";
      this.sirenOsc2.type = "sine";

      this.sirenOsc1.connect(this.gainNode);
      this.sirenOsc2.connect(this.gainNode);

      let step = 0;
      const freqLow = 650;
      const freqHigh = 1250;

      // Dual pitch oscillating siren cycle
      this.sirenOsc1.frequency.setValueAtTime(freqLow, now);
      this.sirenOsc2.frequency.setValueAtTime(freqHigh, now);

      this.sirenOsc1.start(now);
      this.sirenOsc2.start(now);

      this.sirenInterval = setInterval(() => {
        if (!this.ctx || !this.sirenOsc1 || !this.sirenOsc2 || !this.isSirenActive) return;
        const curTime = this.ctx.currentTime;
        step = (step + 1) % 2;
        const targetFreq1 = step === 0 ? freqLow : freqHigh;
        const targetFreq2 = step === 0 ? freqHigh : freqLow;

        this.sirenOsc1.frequency.linearRampToValueAtTime(targetFreq1, curTime + 0.35);
        this.sirenOsc2.frequency.linearRampToValueAtTime(targetFreq2, curTime + 0.35);
      }, 400);

    } catch (e) {
      console.error("Failed to start siren audio synth", e);
    }
  }

  // Stop siren alarm
  public stopSiren() {
    this.isSirenActive = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    try {
      if (this.sirenOsc1) {
        this.sirenOsc1.stop();
        this.sirenOsc1.disconnect();
        this.sirenOsc1 = null;
      }
      if (this.sirenOsc2) {
        this.sirenOsc2.stop();
        this.sirenOsc2.disconnect();
        this.sirenOsc2 = null;
      }
    } catch (e) {
      // ignore
    }
  }

  // High pitch Emergency Whistle pulse
  public playWhistleAlert() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2800, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.4 * this.masterVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.error("Whistle audio error", e);
    }
  }

  // Voice Announcement via Web Speech API
  public announceEmergency(message = "Emergency SOS Alert Activated! Live coordinates dispatched.") {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel ongoing speech
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = this.masterVolume;
      window.speechSynthesis.speak(utterance);
    }
  }

  public getIsSirenActive(): boolean {
    return this.isSirenActive;
  }
}

export const audioEngine = new AudioEngine();
