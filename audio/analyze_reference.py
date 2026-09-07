"""Small dependency-free music analyser for local reference WAV files."""

from __future__ import annotations

import sys
import wave

import numpy as np


path = sys.argv[1]
with wave.open(path, "rb") as wav:
    sr = wav.getframerate()
    channels = wav.getnchannels()
    raw = wav.readframes(wav.getnframes())

audio = np.frombuffer(raw, dtype="<i2").astype(np.float64) / 32768.0
audio = audio.reshape(-1, channels).mean(axis=1)

win = 2048
hop = 512
window = np.hanning(win)
frames = np.lib.stride_tricks.sliding_window_view(audio, win)[::hop]
spec = np.abs(np.fft.rfft(frames * window, axis=1))
freqs = np.fft.rfftfreq(win, 1 / sr)
times = (np.arange(len(frames)) * hop + win / 2) / sr

# Positive spectral flux gives a robust onset envelope even with vocals present.
flux = np.maximum(0, np.diff(spec, axis=0)).sum(axis=1)
flux = np.concatenate(([0.0], flux))
flux /= np.max(flux) + 1e-12
smooth = np.convolve(flux, np.ones(5) / 5, mode="same")
smooth -= np.convolve(smooth, np.ones(81) / 81, mode="same")
smooth = np.maximum(0, smooth)

# Tempo from onset-envelope autocorrelation, preferring the musically gradeable
# 90–180 BPM range. Report useful half/double alternatives as well.
acf = np.correlate(smooth, smooth, mode="full")[len(smooth) - 1 :]
min_lag = int(round(sr * 60 / (hop * 180)))
max_lag = int(np.ceil(sr * 60 / (hop * 90)))
lag = min_lag + int(np.argmax(acf[min_lag : max_lag + 1]))
bpm = 60 * sr / (hop * lag)

rms = np.sqrt(np.mean(frames * frames, axis=1))
centroid = (spec * freqs).sum(axis=1) / (spec.sum(axis=1) + 1e-12)
roll_sum = np.cumsum(spec, axis=1)
roll_target = roll_sum[:, -1:] * 0.85
roll_idx = np.argmax(roll_sum >= roll_target, axis=1)
rolloff = freqs[roll_idx]

# Pitch-class energy for a broad tonal-centre estimate.
mask = (freqs >= 70) & (freqs <= 4000)
valid_freqs = freqs[mask]
pitch = np.rint(69 + 12 * np.log2(valid_freqs / 440.0)).astype(int) % 12
energy = (spec[:, mask] ** 1.35).sum(axis=0)
chroma = np.zeros(12)
for pc in range(12):
    chroma[pc] = energy[pitch == pc].sum()
chroma /= chroma.sum() + 1e-12
names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
major = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
minor = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
scores = []
for root in range(12):
    scores.append((np.corrcoef(chroma, np.roll(major, root))[0, 1], f"{names[root]} major"))
    scores.append((np.corrcoef(chroma, np.roll(minor, root))[0, 1], f"{names[root]} minor"))
scores.sort(reverse=True)

# Strongest separated accents.
threshold = np.percentile(smooth, 87)
candidates = np.where((smooth[1:-1] > smooth[:-2]) & (smooth[1:-1] >= smooth[2:]) & (smooth[1:-1] > threshold))[0] + 1
ranked = sorted(candidates, key=lambda i: smooth[i], reverse=True)
peaks = []
for idx in ranked:
    if all(abs(times[idx] - t) > 0.22 for t in peaks):
        peaks.append(float(times[idx]))
    if len(peaks) == 14:
        break
peaks.sort()

print(f"duration={len(audio)/sr:.3f}s sample_rate={sr} channels={channels}")
print(f"tempo={bpm:.1f} BPM (half={bpm/2:.1f}, double={bpm*2:.1f})")
print(f"integrated_rms={20*np.log10(np.sqrt(np.mean(audio*audio))+1e-12):.1f} dBFS peak={20*np.log10(np.max(np.abs(audio))+1e-12):.1f} dBFS")
print(f"spectral_centroid_median={np.median(centroid):.0f} Hz rolloff85_median={np.median(rolloff):.0f} Hz")
print("key_candidates=" + ", ".join(f"{name} ({score:.2f})" for score, name in scores[:4]))
print("strong_accents=" + ", ".join(f"{t:.2f}s" for t in peaks))

segment = 2.0
print("energy_2s:")
for start in np.arange(0, len(audio) / sr, segment):
    sel = (times >= start) & (times < start + segment)
    if np.any(sel):
        level = 20 * np.log10(np.mean(rms[sel]) + 1e-12)
        attack = np.mean(smooth[sel])
        print(f"  {start:4.1f}-{min(start+segment,len(audio)/sr):4.1f}s  level={level:5.1f}dB  onset={attack:.3f}")
