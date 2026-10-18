import * as Tone from 'tone';

export class SoundEngine {
  constructor() {
    this.enabled = true;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await Tone.start();

    this.stoneSlide = new Tone.NoiseSynth({
      noise: { type: 'brown' },
      envelope: { attack: 0.04, decay: 0.35, sustain: 0.05, release: 0.2 }
    }).toDestination();
    this.stoneSlide.volume.value = -12;

    this.impactSynth = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 4,
      envelope: { attack: 0.001, decay: 0.5, sustain: 0.01, release: 0.4 }
    }).toDestination();
    this.impactSynth.volume.value = -4;

    this.shatterSynth = new Tone.MetalSynth({
      frequency: 240,
      envelope: { attack: 0.002, decay: 0.45, release: 0.25 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 3200,
      octaves: 1.5
    }).toDestination();
    this.shatterSynth.volume.value = -10;

    this.chimeSynth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.chimeSynth.volume.value = -10;

    this.initialized = true;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  async playSelect() {
    if (!this.enabled) return;
    await this.init();
    this.chimeSynth.triggerAttackRelease(['C5'], '16n');
  }

  async playMove() {
    if (!this.enabled) return;
    await this.init();
    this.stoneSlide.triggerAttackRelease('8n');
    this.impactSynth.triggerAttackRelease('C2', '16n', '+0.25');
  }

  async playShatter() {
    if (!this.enabled) return;
    await this.init();
    this.impactSynth.triggerAttackRelease('G1', '4n');
    this.shatterSynth.triggerAttackRelease('16n', '+0.03');
  }

  async playCheck() {
    if (!this.enabled) return;
    await this.init();
    this.chimeSynth.triggerAttackRelease(['E4', 'B4', 'E5'], '4n');
  }
}
