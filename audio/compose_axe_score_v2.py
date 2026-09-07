"""Original melodic launch-film score for the locked 34.6s Axe video.

Reference-informed, but fully synthesized from scratch: warm keys and mallets,
rounded bass, clean pop percussion, restrained synth support, and UI SFX.
"""

from __future__ import annotations

import math
import wave
from pathlib import Path

import numpy as np


SR = 48_000
DURATION = 34.6
N = int(SR * DURATION)
OUT = Path(__file__).resolve().parents[1] / "out" / "axe-melodic-launch-score-v2.wav"
mix = np.zeros((N, 2), dtype=np.float64)
rng = np.random.default_rng(120_346)


def hz(note: float) -> float:
    return 440 * 2 ** ((note - 69) / 12)


def pan_mono(x: np.ndarray, pan: float = 0) -> np.ndarray:
    angle = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    return np.column_stack((x * np.cos(angle), x * np.sin(angle)))


def add(x: np.ndarray, at: float, gain: float = 1, pan: float = 0) -> None:
    start = int(at * SR)
    if start < 0 or start >= N:
        return
    if x.ndim == 1:
        x = pan_mono(x, pan)
    size = min(len(x), N - start)
    mix[start : start + size] += x[:size] * gain


def envelope(n: int, attack: float, release: float) -> np.ndarray:
    e = np.ones(n)
    a = min(n, int(attack * SR))
    r = min(n, int(release * SR))
    if a:
        e[:a] = np.linspace(0, 1, a, endpoint=False)
    if r:
        e[-r:] *= np.linspace(1, 0, r)
    return e


def piano(note: int, dur: float = 0.9, soft: float = 0.5) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    f = hz(note)
    strike = rng.normal(0, 1, len(t)) * np.exp(-t * 85) * 0.025
    tone = np.zeros_like(t)
    for harmonic, level, decay in ((1, 1, 2.1), (2, .34, 3.2), (3, .16, 4.3), (4, .07, 5.8)):
        tone += level * np.sin(2 * np.pi * f * harmonic * t + harmonic * .09) * np.exp(-t * decay)
    return (tone * (0.72 + soft * .18) + strike) * envelope(len(t), .004, .16) / 1.48


def mallet(note: int, dur: float = 0.52) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    f = hz(note)
    tone = (
        np.sin(2 * np.pi * f * t)
        + .28 * np.sin(2 * np.pi * f * 2.01 * t)
        + .12 * np.sin(2 * np.pi * f * 3.98 * t)
    )
    return tone * np.exp(-t * 6.5) * envelope(len(t), .003, .11) / 1.35


def warm_pad(note: int, dur: float) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    f = hz(note)
    tone = np.sin(2*np.pi*f*t) + .16*np.sin(2*np.pi*f*2*t+.3) + .18*np.sin(2*np.pi*f*.998*t+.7)
    return tone * envelope(len(t), .38, .72) / 1.4


def round_bass(note: int, dur: float = .44) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    f = hz(note)
    tone = np.sin(2*np.pi*f*t) + .16*np.sin(2*np.pi*f*2*t)
    return np.tanh(tone * 1.1) * np.exp(-t * 2.8) * envelope(len(t), .012, .1)


def soft_kick(dur: float = .34) -> np.ndarray:
    t = np.arange(int(dur*SR))/SR
    phase = 2*np.pi*(47*t + 47*(1-np.exp(-t*22))/22)
    return np.sin(phase) * np.exp(-t*9.2) * envelope(len(t), .002, .06)


def clap(dur: float = .19) -> np.ndarray:
    t = np.arange(int(dur*SR))/SR
    n = rng.normal(0, 1, len(t))
    high = np.concatenate(([0], np.diff(n)))
    bursts = np.maximum(0, np.sin(2*np.pi*34*t)) ** 5
    return high * (.45 + .55*bursts) * np.exp(-t*22) * .22


def shaker(dur: float = .09) -> np.ndarray:
    t = np.arange(int(dur*SR))/SR
    n = rng.normal(0, 1, len(t))
    high = np.concatenate(([0], np.diff(n)))
    return high*np.exp(-t*42)*.16


def low_tom(note: int = 35, dur: float = .5) -> np.ndarray:
    t = np.arange(int(dur*SR))/SR
    f = hz(note)
    return np.sin(2*np.pi*(f*t + 10*(1-np.exp(-t*15))/15))*np.exp(-t*7)


def click(dur: float = .035) -> np.ndarray:
    t = np.arange(int(dur*SR))/SR
    return np.sin(2*np.pi*1450*t)*np.exp(-t*90)


def sparkle(note: int = 88, dur: float = .75) -> np.ndarray:
    t = np.arange(int(dur*SR))/SR
    f = hz(note)
    return (np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*f*2.02*t))*np.exp(-t*4.5)*envelope(len(t),.002,.18)


def sweep(dur: float = .4, inward: bool = True) -> np.ndarray:
    t = np.arange(int(dur*SR))/SR
    n = rng.normal(0,1,len(t))
    smooth = np.convolve(n,np.ones(28)/28,mode="same")
    airy = np.concatenate(([0],np.diff(smooth)))
    curve = np.sin(np.pi*np.linspace(0,1,len(t)))**2
    tilt = np.linspace(.22,1,len(t)) if inward else np.linspace(1,.22,len(t))
    return airy*curve*tilt*1.3


def riser(dur: float) -> np.ndarray:
    t=np.arange(int(dur*SR))/SR
    n=rng.normal(0,1,len(t))
    smooth=np.convolve(n,np.ones(44)/44,mode="same")
    return smooth*(np.linspace(0,1,len(t))**1.7)*(.72+.28*np.sin(2*np.pi*(2*t+1.5*t*t)))


# 120 BPM. Harmonic language: G# minor tension, opening into B-major colour.
BEAT=.5
BAR=2.0
progression=[(44,47,51),(40,44,47),(47,51,54),(42,46,49)]  # G#m, E, B, F#

# Pads establish melody and warmth without a synthetic club pulse.
for bar_start in np.arange(0,30, BAR):
    chord=progression[int(bar_start/BAR)%4]
    gain=.055 if bar_start<8 else .075 if bar_start<18 else .105
    for i,note in enumerate(chord):
        add(warm_pad(note,2.35),float(bar_start),gain,(-.46,0,.46)[i])

# Main launch motif: clear, singable, and repeated with variation.
motif_a=[68,71,75,73,71,68]
motif_b=[71,75,78,75,73,71]
for phrase_start,notes,level in [
    (1.75,motif_a,.085),(5.35,motif_a,.09),(8.15,motif_b,.095),
    (12.15,motif_a,.11),(16.15,motif_b,.12),(20.15,motif_a,.14),
    (24.15,motif_b,.155),(27.95,motif_a,.13),
]:
    spacing=.25
    for i,note in enumerate(notes):
        add(mallet(note,.58),phrase_start+i*spacing,level,-.3+i*.12)

# Piano rhythm: syncopated eighth-note pattern, not a rigid techno arpeggio.
pattern=[0,.5,1.25,1.5]
for bar_start in np.arange(4,30,BAR):
    chord=progression[int(bar_start/BAR)%4]
    for j,offset in enumerate(pattern):
        note=chord[(j+1)%3]+12
        level=.06 if bar_start<10 else .08 if bar_start<18 else .105
        add(piano(note,.62,.65),float(bar_start+offset),level,-.18 if j%2 else .18)

# Restrained opening heartbeat; the proper pop groove enters with the reply.
for t0 in np.arange(0,7.5,1.0):
    add(soft_kick(),float(t0),.14)
for t0 in np.arange(7.5,30,.5):
    energy=.24 if t0<11.2 else .31 if t0<18.6 else .39
    add(soft_kick(),float(t0),energy)
for t0 in np.arange(8.0,30,1.0):
    add(clap(),float(t0),.13 if t0<18.6 else .18,.08)
for i,t0 in enumerate(np.arange(7.75,30,.25)):
    add(shaker(),float(t0),.037 if i%2==0 else .055,-.3 if i%2 else .3)

# Bass follows the chords in long, rounded notes.
for i,t0 in enumerate(np.arange(8,30,.5)):
    root=progression[(i//4+4)%4][0]-12
    add(round_bass(root),float(t0),.12 if t0<18.6 else .17)

# Locked visual accents. These support, rather than dominate, the music.
for when,gain,pan in [
    (.20,.07,-.1),(2.62,.065,.1),(5.34,.09,0),(7.62,.07,-.1),
    (11.58,.10,.1),(15.58,.08,0),(23.25,.08,0),(24.92,.07,-.1),
    (26.58,.075,.1),(28.58,.09,0),
]:
    add(sweep(),when,gain,pan)

add(low_tom(34),1.66,.15)
add(sparkle(83),3.34,.105,-.12)
add(sparkle(90),3.43,.052,.18)
add(low_tom(36),6.53,.13)

# Typing and send moment.
for i,when in enumerate(np.arange(8.76,10.95,.105)):
    add(click(),float(when),.014+(i%3)*.002,-.3+(i%5)*.15)
add(click(.07),11.18,.085)
add(low_tom(35,.62),11.20,.24)
add(piano(71,.9,.8),11.22,.12)

# Growth curve: light ticks increase without turning into arcade SFX.
for i,when in enumerate(np.linspace(12.65,15.25,16)):
    add(click(),float(when),.012+i*.0013,-.35+(i%5)*.17)
for i,when in enumerate([15.72,16.48,17.22]):
    add(sparkle(83+i*2),when,.08,-.25+i*.25)

# Peak build through the repeated-replies and consistency passage.
add(riser(4.55),18.58,.075)
for i,when in enumerate(np.arange(18.72,23.15,.48)):
    add(sweep(.24,i%2==0),float(when),.032,-.45 if i%2 else .45)
add(sparkle(87),23.30,.11)
add(sparkle(92),23.40,.045,.25)
add(low_tom(36,.7),24.05,.16)
add(low_tom(38,.7),26.05,.17)
add(low_tom(39,.8),28.62,.22)
add(sparkle(90),28.68,.10)

# Thesis and callback: rhythm releases, melody remains.
add(low_tom(35,.85),30.10,.22)
for i,note in enumerate((71,75,78)):
    add(piano(note,1.1,.7),30.16+i*.3,.11,-.25+i*.25)
add(sparkle(83),31.28,.10,-.12)
add(sparkle(90),31.39,.045,.2)

# Axe: clean B-major resolve and a single confident impact.
add(low_tom(35,1.2),33.27,.34)
for i,note in enumerate((47,51,54,59)):
    add(warm_pad(note,1.5),33.27,.15,(-.55,-.18,.18,.55)[i])
add(piano(71,1.25,.8),33.30,.15,-.15)
add(sparkle(90,1.1),33.34,.085,.2)

# Short room-like echoes glue the organic synthetic instruments together.
dry=mix.copy()
for delay,level,cross in [(.12,.07,False),(.24,.038,True)]:
    d=int(delay*SR)
    echo=dry[:-d,::-1] if cross else dry[:-d]
    mix[d:]+=echo*level

mix=np.tanh(mix*1.12)
fade=int(.3*SR)
mix[:int(.02*SR)]*=np.linspace(0,1,int(.02*SR))[:,None]
mix[-fade:]*=np.linspace(1,0,fade)[:,None]
mix*=.91/(np.max(np.abs(mix))+1e-12)
pcm=(mix*32767).astype('<i2')

OUT.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(OUT),'wb') as wav:
    wav.setnchannels(2); wav.setsampwidth(2); wav.setframerate(SR); wav.writeframes(pcm.tobytes())
print(OUT)
