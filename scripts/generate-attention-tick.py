#!/usr/bin/env python3
"""Generate the short percussive tick used on every teaser match cut."""

import math
import random
import struct
import wave
from pathlib import Path


SAMPLE_RATE = 48_000
DURATION = 0.13
OUTPUT = Path(__file__).resolve().parents[1] / "public/audio/axe-attention-tick.wav"


def main() -> None:
    random.seed(112_000)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    samples = []

    for index in range(int(SAMPLE_RATE * DURATION)):
        t = index / SAMPLE_RATE
        sharp_decay = math.exp(-t * 72)
        body_decay = math.exp(-t * 31)
        click = random.uniform(-1, 1) * sharp_decay * 0.32
        high = math.sin(2 * math.pi * 1_420 * t) * sharp_decay * 0.42
        body = math.sin(2 * math.pi * 235 * t) * body_decay * 0.22
        value = max(-1.0, min(1.0, click + high + body))
        samples.append(struct.pack("<h", int(value * 32767)))

    with wave.open(str(OUTPUT), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(b"".join(samples))

    print(OUTPUT)


if __name__ == "__main__":
    main()
