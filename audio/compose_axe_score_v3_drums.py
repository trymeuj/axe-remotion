"""Original louder, bass-forward, drum-led Axe launch score.

The picture is immutable. Every cue below is expressed in seconds against the
locked 34.6-second master. The rhythmic language uses an original marching-pop
cadence at 138 BPM; it does not reproduce the user's musical reference.
"""

from __future__ import annotations

from pathlib import Path
import wave

import numpy as np

import compose_axe_score_v2 as synth


synth.mix = np.zeros((synth.N, 2), dtype=np.float64)
synth.rng = np.random.default_rng(138_905)
OUT = Path(__file__).resolve().parents[1] / "out" / "axe-drum-launch-score-v3.wav"
BEAT = 60 / 138
BAR = BEAT * 4


# D-minor tension with an open F-major colour at the energetic peak.
progression = [(50, 53, 57), (46, 50, 53), (53, 57, 60), (48, 52, 55)]


def marching_hit(at: float, strength: float = 1, pan: float = 0) -> None:
    synth.add(synth.clap(.17), at, .15 * strength, pan)
    synth.add(synth.low_tom(42, .24), at, .055 * strength, pan * .4)


# 0–9s — restrained build: melody first, then low percussion approaches.
for start, chord in [(0, progression[0]), (3.45, progression[1]), (6.90, progression[3])]:
    for i, note in enumerate(chord):
        synth.add(synth.warm_pad(note, 3.9), start, .064 + start * .0028, (-.5, 0, .5)[i])

intro_motif = [74, 77, 81, 79, 77]
for phrase in [1.65, 5.15]:
    for i, note in enumerate(intro_motif):
        synth.add(synth.mallet(note, .72), phrase + i * .31, .095 + phrase * .003, -.28 + i * .14)

intro_beats = [0.35, 1.22, 2.09, 3.39, 4.26, 5.13, 6.00, 6.87, 7.74, 8.39, 8.82]
for i, at in enumerate(intro_beats):
    strength = .11 + i * .012
    synth.add(synth.soft_kick(.4), at, strength)
    if i >= 5:
        synth.add(synth.shaker(.1), at + .22, .025 + i * .002, .22 if i % 2 else -.22)
synth.add(synth.riser(2.2), 6.82, .095)

# 9–28.6s — loud core. A syncopated marching-pop grid creates speed while
# leaving room for the melody and for picture-specific sound effects.
main_start = 9.0
bar_starts = np.arange(main_start, 28.6, BAR)
for bar_index, bar in enumerate(bar_starts):
    chord = progression[bar_index % 4]
    energy = min(1.0, .72 + bar_index * .035)

    # Kick pattern: grounded, syncopated, never four-on-the-floor.
    for step, level in [(0, 1), (1.5, .72), (2.25, .9), (3.5, .68)]:
        synth.add(synth.soft_kick(.38), float(bar + step * BEAT), .40 * level * energy)

    # Original marching cadence with alternating ghost strokes.
    snare_steps = [(1, 1), (1.75, .42), (2.5, .55), (3, 1), (3.5, .48), (3.75, .66)]
    for j, (step, level) in enumerate(snare_steps):
        marching_hit(float(bar + step * BEAT), level * energy, -.18 if j % 2 else .18)

    # Continuous sixteenth-note air gives pace without an EDM hi-hat timbre.
    for step in np.arange(0, 4, .25):
        accent = .064 if int(step * 4) % 4 == 0 else .035
        synth.add(synth.shaker(.085), float(bar + step * BEAT), accent * energy, -.32 if int(step*4)%2 else .32)

    # Bass is deliberately louder than V2 and follows roots/fifths.
    for beat_index in range(4):
        note = chord[0] - 12 if beat_index != 3 else chord[2] - 12
        synth.add(synth.round_bass(note, BEAT * .95), float(bar + beat_index * BEAT), .235 * energy)

    # Wide piano stabs reinforce the harmony and launch-film character.
    for beat_index in (0, 2, 3):
        for note_index, note in enumerate(chord):
            synth.add(synth.piano(note + 12, .72, .78), float(bar + beat_index * BEAT), .058 * energy, (-.35, 0, .35)[note_index])

# Melodic phrases ride above the drum core rather than behaving like an arp.
main_melodies = [
    (9.22, [74, 77, 81, 84, 81, 79]),
    (12.70, [77, 81, 84, 86, 84, 81]),
    (16.18, [74, 77, 81, 79, 77, 74]),
    (19.66, [77, 81, 84, 86, 89, 86]),
    (23.14, [81, 84, 86, 89, 86, 84]),
    (26.62, [77, 81, 84, 81, 79, 77]),
]
for phrase, notes in main_melodies:
    for i, note in enumerate(notes):
        synth.add(synth.mallet(note, .62), phrase + i * (BEAT / 2), .142, -.3 + i * .12)

# Locked visual SFX: restrained but audible against the louder score.
for when, gain, pan in [
    (.20, .075, -.1), (2.62, .07, .1), (5.34, .10, 0), (7.62, .08, -.1),
    (11.58, .12, .1), (15.58, .10, 0), (23.25, .10, 0), (24.92, .085, -.1),
    (26.58, .09, .1), (28.58, .10, 0),
]:
    synth.add(synth.sweep(.42), when, gain, pan)

# Text and notification cues.
for when, note in [(1.66, 38), (6.53, 40), (30.10, 38)]:
    synth.add(synth.low_tom(note, .62), when, .22)
for when, note in [(3.34, 84), (15.72, 84), (16.48, 87), (17.22, 91), (23.30, 88), (28.68, 91), (31.28, 84)]:
    synth.add(synth.sparkle(note), when, .095)

# Typing, reply post and view-count lift.
for i, when in enumerate(np.arange(8.76, 10.95, .105)):
    synth.add(synth.click(), float(when), .016 + (i % 3) * .002, -.32 + (i % 5) * .16)
synth.add(synth.click(.075), 11.18, .11)
synth.add(synth.low_tom(36, .75), 11.20, .31)
for i, when in enumerate(np.linspace(12.65, 15.25, 18)):
    synth.add(synth.click(), float(when), .014 + i * .0014, -.38 + (i % 5) * .19)
synth.add(synth.riser(2.65), 12.62, .12)

# Reply cards pop quickly in the high-energy middle.
for i, when in enumerate(np.arange(18.72, 23.15, .46)):
    synth.add(synth.sweep(.22, i % 2 == 0), float(when), .042, -.5 if i % 2 else .5)

# 28.6–34.6s — outgoing deceleration. Beat gaps widen and every hit becomes
# quieter; the music reaches near-silence before the final frame.
tail_times = [28.62, 29.08, 29.58, 30.14, 30.80, 31.58, 32.52, 33.58]
for i, at in enumerate(tail_times):
    level = .29 * (1 - i / (len(tail_times) + 1))
    synth.add(synth.soft_kick(.42), at, level)
    if i < 5:
        marching_hit(at + .24, level * 1.4, .12 if i % 2 else -.12)

for i, note in enumerate([74, 77, 81, 79, 77, 74]):
    synth.add(synth.piano(note, 1.25, .72), 29.02 + i * .47, .105 * (1 - i * .1), -.25 + i * .1)

# A soft branded resolve, then silence—not another energy spike.
for i, note in enumerate((53, 57, 60)):
    synth.add(synth.warm_pad(note, 1.25), 33.27, .075, (-.4, 0, .4)[i])
synth.add(synth.sparkle(89, .9), 33.30, .045, .2)

# Cohesion, louder master, and a deliberate final fade.
dry = synth.mix.copy()
for delay, level, cross in [(.105, .065, False), (.21, .034, True)]:
    d = int(delay * synth.SR)
    echo = dry[:-d, ::-1] if cross else dry[:-d]
    synth.mix[d:] += echo * level

# Music-only fade begins at 28.6s while the carefully placed tail cues remain.
fade_start = int(28.6 * synth.SR)
fade = np.linspace(1, .18, synth.N - fade_start) ** 1.2
synth.mix[fade_start:] *= fade[:, None]
synth.mix = np.tanh(synth.mix * 1.28)
synth.mix[:int(.02*synth.SR)] *= np.linspace(0, 1, int(.02*synth.SR))[:, None]
synth.mix[-int(.35*synth.SR):] *= np.linspace(1, 0, int(.35*synth.SR))[:, None]
synth.mix *= .955 / (np.max(np.abs(synth.mix)) + 1e-12)
pcm = (synth.mix * 32767).astype('<i2')

OUT.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(OUT), 'wb') as wav:
    wav.setnchannels(2)
    wav.setsampwidth(2)
    wav.setframerate(synth.SR)
    wav.writeframes(pcm.tobytes())
print(OUT)
