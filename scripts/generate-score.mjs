import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// 120 BPM at 30fps: every beat is exactly 15 frames, every bar is 60 frames.
const sr = 48000,
  duration = 30,
  length = sr * duration,
  beat = 0.5;
const L = new Float32Array(length),
  R = new Float32Array(length);
let seed = 271828;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2147483648 - 1;
};
const add = (t, d, fn, pan = 0, g = 1) => {
  const s = Math.floor(t * sr),
    n = Math.floor(d * sr),
    lg = Math.sqrt((1 - pan) / 2),
    rg = Math.sqrt((1 + pan) / 2);
  for (let i = 0; i < n && s + i < length; i++) {
    const v = fn(i / sr, i / n) * g;
    L[s + i] += v * lg;
    R[s + i] += v * rg;
  }
};
const kick = (t, g = 1) =>
  add(
    t,
    0.42,
    (x) =>
      Math.sin(2 * Math.PI * (46 * x + (72 * (1 - Math.exp(-x * 26))) / 26)) *
      Math.exp(-x * 12),
    0,
    0.86 * g,
  );
const clap = (t, g = 1) =>
  add(
    t,
    0.2,
    (x) =>
      (rnd() * 0.58 + Math.sin(2 * Math.PI * 190 * x) * 0.16) *
      Math.exp(-x * 22),
    0.08,
    0.48 * g,
  );
const hat = (t, pan = 0, g = 1) =>
  add(t, 0.055, (x) => rnd() * Math.exp(-x * 72), pan, 0.17 * g);
const sub = (t, hz, d = 0.42, g = 1) =>
  add(
    t,
    d,
    (x) =>
      (Math.sin(2 * Math.PI * hz * x) +
        0.22 * Math.sin(2 * Math.PI * hz * 2 * x)) *
      Math.min(1, x * 45) *
      Math.exp(-x * 3.8),
    0,
    0.27 * g,
  );
const tick = (t, pan = 0, g = 1) =>
  add(
    t,
    0.07,
    (x) =>
      (Math.sin(2 * Math.PI * 1450 * x) + rnd() * 0.12) * Math.exp(-x * 55),
    pan,
    0.18 * g,
  );
const impact = (t, g = 1) => {
  add(
    t,
    1.25,
    (x) =>
      (Math.sin(2 * Math.PI * (61 - 18 * x) * x) * 0.7 + rnd() * 0.12) *
      Math.exp(-x * 4.7),
    0,
    0.78 * g,
  );
  add(t, 0.16, (x) => rnd() * Math.exp(-x * 24), 0, 0.46 * g);
};
const rise = (t, d, g = 0.2) =>
  add(
    t,
    d,
    (x, p) =>
      (rnd() * 0.5 + Math.sin(2 * Math.PI * (90 + p * 760) * x) * 0.35) * p * p,
    0,
    g,
  );

const cuts = [0, 1.67, 3.2, 4.33, 5.5, 8.6, 10, 11.17, 12.27, 13, 14, 15, 16, 21, 23, 25.33, 27.33, 28.67];
const duckAt = (t) => cuts.some((c) => t >= c - 0.18 && t < c + 0.06);
const notes = [36.71, 36.71, 43.65, 32.7, 36.71, 49, 43.65, 32.7];
for (let b = 0; b * beat < 28.67; b++) {
  const t = b * beat,
    section =
      t < 5.5
        ? 0.72
        : t < 8.6
          ? 0.78
          : t < 13
            ? 1.02
            : t < 16
              ? 0.94
              : t < 21
                ? 1.1
                : t < 27.33
                  ? 1.02
                : 0.72;
  if (!duckAt(t)) {
    kick(t, section);
    sub(t, notes[b % notes.length], beat * 0.78, section);
    if (b % 2 === 1) clap(t, section);
  }
  if (t >= 5.5 && t < 27.33)
    for (let h = 0; h < 4; h++)
      if (!duckAt(t + h * 0.125))
        hat(
          t + h * 0.125,
          h % 2 ? 0.45 : -0.45,
          section * (h === 3 ? 1.25 : 0.78),
        );
}

// UI-synchronous detail: camera travel, composer typing, native metrics and navigation.
for (let t = 0.35; t < 5.35; t += 0.5) tick(t, Math.sin(t * 3) * 0.55, 0.58);
for (let t = 6.25; t < 8.42; t += 0.09) tick(t, (t % 1) - 0.5, 0.3);
for (let t = 16.2; t < 20.8; t += 0.3)
  tick(t, ((t * 10) % 2) - 1, 0.46 + (t - 16.2) * 0.1);
rise(0.72, 0.9, 0.09);
rise(3.35, 0.85, 0.11);
rise(7.55, 1.02, 0.14);
rise(11.45, 0.78, 0.15);
rise(15.05, 0.85, 0.15);
rise(19.65, 1.18, 0.16);
rise(24.45, 0.82, 0.14);
rise(26.35, 0.9, 0.16);
for (const [t, g] of [
  [1.67, 0.84],
  [3.2, 0.52],
  [4.33, 0.88],
  [5.5, 0.76],
  [8.6, 1.14],
  [10, 0.76],
  [11.17, 0.9],
  [12.27, 1.08],
  [13.07, 0.68],
  [14, 0.8],
  [14.93, 0.94],
  [16, 0.78],
  [16.67, 0.7],
  [17.53, 0.78],
  [18.4, 0.86],
  [19.27, 0.94],
  [20.13, 1.02],
  [21, 1.12],
  [23, 0.84],
  [23.53, 0.68],
  [24, 0.78],
  [24.47, 0.9],
  [24.93, 1.06],
  [25.93, 1.22],
  [27.33, 0.88],
  [28.67, 1.04],
])
  impact(t, g);

// Native-feeling send click at frame 258, then a short silence pocket before the result.
tick(8.52, 0, 1.7);
add(
  8.64,
  0.2,
  (x) => Math.sin(2 * Math.PI * 820 * x) * Math.exp(-x * 28),
  0,
  0.22,
);
// Final resolve: low fundamental and a restrained fifth, no cinematic neon wash.
add(
  28.67,
  2,
  (x) => Math.sin(2 * Math.PI * 36.71 * x) * Math.exp(-x * 0.58),
  0,
  0.24,
);
add(
  28.71,
  2,
  (x) => Math.sin(2 * Math.PI * 55 * x) * Math.exp(-x * 0.72),
  0,
  0.09,
);

let peak = 0;
for (let i = 0; i < length; i++)
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const gain = 0.94 / Math.max(peak, 0.94);
const buffer = Buffer.alloc(44 + length * 4);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(buffer.length - 8, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(sr, 24);
buffer.writeUInt32LE(sr * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(length * 4, 40);
for (let i = 0; i < length; i++) {
  buffer.writeInt16LE(
    Math.max(-32768, Math.min(32767, L[i] * gain * 32767)),
    44 + i * 4,
  );
  buffer.writeInt16LE(
    Math.max(-32768, Math.min(32767, R[i] * gain * 32767)),
    46 + i * 4,
  );
}
const out = resolve("public/audio/axe-native-score.wav");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buffer);
console.log(`Generated ${out} (${duration}s, 120 BPM, cut-synced)`);
