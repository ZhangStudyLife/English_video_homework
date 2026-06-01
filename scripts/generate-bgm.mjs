import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const sampleRate = 24000;
const seconds = 260;
const channels = 1;
const totalSamples = sampleRate * seconds;
const outFile = join("public", "audio", "bgm", "soft-documentary-bed.wav");

const writeString = (buffer, offset, value) => {
  for (let i = 0; i < value.length; i++) buffer.writeUInt8(value.charCodeAt(i), offset + i);
};

const wav = Buffer.alloc(44 + totalSamples * 2);
writeString(wav, 0, "RIFF");
wav.writeUInt32LE(36 + totalSamples * 2, 4);
writeString(wav, 8, "WAVE");
writeString(wav, 12, "fmt ");
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(channels, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * channels * 2, 28);
wav.writeUInt16LE(channels * 2, 32);
wav.writeUInt16LE(16, 34);
writeString(wav, 36, "data");
wav.writeUInt32LE(totalSamples * 2, 40);

const bpm = 96;
const beat = 60 / bpm;
const chords = [
  [55, 65.41, 82.41, 98.0],
  [49.0, 61.74, 73.42, 92.5],
  [43.65, 55.0, 65.41, 82.41],
  [51.91, 65.41, 77.78, 98.0],
];

const env = (x, attack, release) => {
  const a = Math.max(0, Math.min(1, x / attack));
  const r = Math.max(0, Math.min(1, (1 - x) / release));
  return Math.min(a, r);
};

const noise = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const beatPos = (t / beat) % 1;
  const beatIndex = Math.floor(t / beat);
  const bar = Math.floor(beatIndex / 4);
  const chord = chords[bar % chords.length];
  const root = chord[0];

  const chordTone = chord.reduce((sum, freq, idx) => {
    const drift = Math.sin(t * 0.17 + idx) * 0.003;
    return sum + Math.sin(2 * Math.PI * freq * (1 + drift) * t + idx * 0.8) * (0.12 / (idx + 1));
  }, 0);

  const bassNote = bar % 2 === 0 ? root : root * 1.5;
  const bassGate = beatIndex % 2 === 0 ? env(beatPos, 0.04, 0.45) : env(beatPos, 0.02, 0.22) * 0.45;
  const bass = Math.sin(2 * Math.PI * bassNote * t) * bassGate * 0.19;

  const kick = Math.sin(2 * Math.PI * (52 - beatPos * 28) * t) * env(beatPos, 0.006, 0.16) * (beatIndex % 4 === 0 ? 0.42 : 0.18);
  const snarePos = (beatIndex % 4 === 2) ? env(beatPos, 0.004, 0.12) : 0;
  const snare = noise(i) * snarePos * 0.075;
  const hatStep = ((t / (beat / 2)) % 1);
  const hat = noise(i * 3) * env(hatStep, 0.002, 0.05) * 0.026;
  const shimmer =
    Math.sin(2 * Math.PI * (root * 8) * t + Math.sin(t * 0.45)) * 0.018 +
    Math.sin(2 * Math.PI * (root * 12) * t + 1.8) * 0.011;
  const sidechain = 0.72 + 0.28 * Math.min(1, beatPos / 0.28);
  const fadeIn = Math.min(1, t / 5);
  const fadeOut = Math.min(1, (seconds - t) / 6);
  const value = ((chordTone + shimmer) * sidechain + bass + kick + snare + hat) * fadeIn * fadeOut * 0.75;
  wav.writeInt16LE(Math.max(-1, Math.min(1, value)) * 32767, 44 + i * 2);
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, wav);
console.log(`Generated ${outFile}`);
