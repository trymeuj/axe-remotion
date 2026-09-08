"""Adapt the approved Pixabay Football V5 mix to the 29.233s middle cut.

The licensed music, tempo, sound palette, and ending logic are unchanged. Only
picture-locked cue times and the final-act splice are adapted to the new edit.
The approved 34.6-second V5 builder and keepers are never modified.
"""

from __future__ import annotations

import math
import shutil
import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 48_000
DURATION = 877 / 30
N = round(SR * DURATION)
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "audio" / "reference-pixabay-football-551346.mp3"
OUT = ROOT / "out" / "keepers" / "AXE-middle-cut-pixabay-football-v5.wav"
RNG = np.random.default_rng(551_346)


def decode_mp3(path: Path) -> np.ndarray:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg is required")
    raw = subprocess.check_output([
        ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(path),
        "-f", "f32le", "-acodec", "pcm_f32le", "-ar", str(SR),
        "-ac", "2", "pipe:1",
    ])
    return np.frombuffer(raw, dtype="<f4").reshape(-1, 2).astype(np.float64)


def stereo(x: np.ndarray, pan: float = 0.0) -> np.ndarray:
    angle = (np.clip(pan, -1.0, 1.0) + 1.0) * math.pi / 4
    return np.column_stack((x * math.cos(angle), x * math.sin(angle)))


def envelope(n: int, attack: float, release: float) -> np.ndarray:
    result = np.ones(n)
    a, r = min(n, round(attack * SR)), min(n, round(release * SR))
    if a:
        result[:a] = np.linspace(0.0, 1.0, a, endpoint=False)
    if r:
        result[-r:] *= np.linspace(1.0, 0.0, r)
    return result


def add(bus: np.ndarray, sound: np.ndarray, at: float, gain: float, pan: float = 0.0) -> None:
    start = round(at * SR)
    if start >= N:
        return
    if sound.ndim == 1:
        sound = stereo(sound, pan)
    length = min(len(sound), N - start)
    if length > 0:
        bus[start:start + length] += sound[:length] * gain


def chime(pitch: float = 1.0, duration: float = 0.62) -> np.ndarray:
    t = np.arange(round(duration * SR)) / SR
    first = np.sin(2 * np.pi * 920 * pitch * t) * np.exp(-t * 7.0)
    shifted = np.maximum(t - 0.075, 0.0)
    second = np.sin(2 * np.pi * 1380 * pitch * shifted) * np.exp(-shifted * 8.5) * (t >= 0.075)
    shimmer = np.sin(2 * np.pi * 1840 * pitch * t + 0.25) * np.exp(-t * 12.0)
    return (first + 0.62 * second + 0.18 * shimmer) * envelope(len(t), 0.004, 0.18)


def soft_hit(duration: float = 0.38) -> np.ndarray:
    t = np.arange(round(duration * SR)) / SR
    phase = 2 * np.pi * (74 * t + 34 * (1 - np.exp(-t * 19)) / 19)
    body = np.sin(phase) * np.exp(-t * 10.0)
    air = RNG.normal(0, 1, len(t)) * np.exp(-t * 28.0) * 0.055
    return (body + air) * envelope(len(t), 0.002, 0.08)


def tick(duration: float = 0.055) -> np.ndarray:
    t = np.arange(round(duration * SR)) / SR
    return np.sin(2 * np.pi * 1750 * t) * np.exp(-t * 75.0)


def whoosh(duration: float = 0.42, inward: bool = True) -> np.ndarray:
    t = np.arange(round(duration * SR)) / SR
    noise = RNG.normal(0, 1, len(t))
    smooth = np.convolve(noise, np.ones(34) / 34, mode="same")
    airy = np.concatenate(([0.0], np.diff(smooth)))
    shape = np.sin(np.pi * np.linspace(0, 1, len(t))) ** 1.7
    motion = np.linspace(0.18, 1.0, len(t)) if inward else np.linspace(1.0, 0.18, len(t))
    return airy * shape * motion * 2.2


def count_riser(duration: float = 2.55) -> np.ndarray:
    t = np.arange(round(duration * SR)) / SR
    phase = 2 * np.pi * (480 * t + 920 * t * t / (2 * duration))
    tone = np.sin(phase) * (np.linspace(0.08, 1.0, len(t)) ** 1.5)
    noise = RNG.normal(0, 1, len(t))
    smooth = np.convolve(noise, np.ones(40) / 40, mode="same")
    return (0.34 * tone + smooth) * envelope(len(t), 0.08, 0.20)


def gain_curve(points: list[tuple[float, float]]) -> np.ndarray:
    times = np.arange(N) / SR
    return np.interp(times, [p[0] for p in points], [p[1] for p in points])


def duck(curve: np.ndarray, start: float, end: float, floor: float) -> None:
    a = max(0, round((start - 0.12) * SR))
    b = max(a + 1, round(start * SR))
    c = min(N, round(end * SR))
    d = min(N, round((end + 0.18) * SR))
    if b > a:
        curve[a:b] *= np.linspace(1.0, floor, b - a)
    curve[b:c] *= floor
    if d > c:
        curve[c:d] *= np.linspace(floor, 1.0, d - c)


if not SOURCE.exists():
    raise FileNotFoundError(SOURCE)
source = decode_mp3(SOURCE)
if len(source) < round(54 * SR):
    raise RuntimeError("Reference track is shorter than expected")

# Preserve V5's natural opening, then make the same beat-aligned jump into the
# source's quieter breakdown early enough for the shorter film's final act.
bed = source[:N].copy()
splice, outro_source, crossfade = 24.10, 48.366, 0.28
splice_sample = round(splice * SR)
fade_start = round((splice - crossfade) * SR)
outro_start = round((outro_source - crossfade) * SR)
remaining = N - fade_start
outro = source[outro_start:outro_start + remaining]
if len(outro) < remaining:
    outro = np.pad(outro, ((0, remaining - len(outro)), (0, 0)))
blend_len = splice_sample - fade_start
blend = np.linspace(0.0, 1.0, blend_len)[:, None]
bed[fade_start:splice_sample] = bed[fade_start:splice_sample] * (1 - blend) + outro[:blend_len] * blend
bed[splice_sample:] = outro[blend_len:remaining]

music_gain = gain_curve([
    (0.0, 0.40), (1.20, 0.48), (6.72, 0.50), (7.05, 0.76),
    (12.20, 0.84), (15.30, 0.89), (23.75, 0.86), (24.10, 0.66),
    (25.80, 0.52), (27.20, 0.29), (29.15, 0.0), (DURATION, 0.0),
])
duck(music_gain, 2.60, 4.45, 0.74)
duck(music_gain, 13.13, 15.15, 0.82)
duck(music_gain, 18.13, 19.35, 0.84)
duck(music_gain, 22.73, 23.90, 0.80)
duck(music_gain, 25.23, 27.05, 0.73)
bed *= music_gain[:, None]

fx = np.zeros_like(bed)

for when, gain, pan, inward in [
    (0.20, 0.055, -0.10, True), (2.20, 0.050, 0.12, False),
    (4.60, 0.070, 0.08, True), (6.27, 0.052, -0.08, True),
    (10.13, 0.072, 0.08, True), (19.73, 0.050, -0.12, True),
    (21.23, 0.055, 0.12, True), (22.73, 0.060, 0.0, True),
]:
    add(fx, whoosh(inward=inward), when, gain, pan)

for when, gain in [(1.20, 0.105), (5.47, 0.105), (24.23, 0.12)]:
    add(fx, soft_hit(), when, gain)

for i, (when, pitch, gain) in enumerate([
    (2.60, 1.00, 0.115), (13.13, 1.00, 0.080),
    (14.00, 1.06, 0.080), (14.93, 1.12, 0.085),
    (18.13, 1.07, 0.095), (22.73, 1.12, 0.105),
    (25.23, 1.00, 0.120),
]):
    add(fx, chime(pitch), when, gain, -0.16 + (i % 3) * 0.16)

for i, when in enumerate(np.arange(7.28, 9.72, 0.108)):
    add(fx, tick(0.035), float(when), 0.010 + (i % 3) * 0.0015, -0.24 + (i % 5) * 0.12)
add(fx, tick(0.075), 9.73, 0.070)
add(fx, soft_hit(0.46), 9.75, 0.135)
add(fx, count_riser(), 10.45, 0.036)
for i, when in enumerate(np.linspace(10.55, 13.03, 14)):
    add(fx, tick(), float(when), 0.010 + i * 0.0009, -0.28 + (i % 5) * 0.14)
for i, when in enumerate(np.linspace(15.52, 17.78, 6)):
    add(fx, whoosh(0.22, inward=i % 2 == 0), float(when), 0.026, -0.38 if i % 2 else 0.38)
    add(fx, tick(0.04), float(when + 0.055), 0.022, 0.34 if i % 2 else -0.34)

add(fx, soft_hit(0.82), 27.23, 0.18)
add(fx, chime(0.75, 0.95), 27.26, 0.052, 0.08)

mix = np.tanh((bed + fx) * 1.06)
mix[:round(0.025 * SR)] *= np.linspace(0, 1, round(0.025 * SR))[:, None]
mix[-round(0.10 * SR):] *= np.linspace(1, 0, round(0.10 * SR))[:, None]
mix *= 0.92 / (np.max(np.abs(mix)) + 1e-12)

OUT.parent.mkdir(parents=True, exist_ok=True)
pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2")
with wave.open(str(OUT), "wb") as wav:
    wav.setnchannels(2)
    wav.setsampwidth(2)
    wav.setframerate(SR)
    wav.writeframes(pcm.tobytes())
print(OUT)
