"""Create the five short, original looping GameBox music assets using Python's standard library."""
from array import array
from math import asin, copysign, pi, sin
from pathlib import Path
import struct
import wave

RATE = 22050
BEAT = 0.5
TRACKS = [
    ("gamebox-chill", "sine", [60, 64, 67, 72, 67, 64, 59, 62, 65, 71, 65, 62, 57, 60, 64, 69], [48, 45, 41, 43], [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]),
    ("pixel-adventure", "square", [72, 79, 76, 84, 79, 76, 74, 81, 77, 86, 81, 77, 76, 83, 79, 88], [48, 48, 43, 45], [[60, 64, 67], [60, 64, 67], [55, 59, 62], [57, 60, 64]]),
    ("neon-drive", "triangle", [57, 64, 69, 73, 69, 64, 55, 62, 67, 71, 67, 62, 53, 60, 65, 69], [45, 41, 43, 38], [[57, 60, 64], [53, 57, 60], [55, 59, 62], [50, 53, 57]]),
    ("cozy-arcade", "sine", [67, 72, 76, 79, 76, 72, 69, 74, 77, 81, 77, 74, 65, 71, 74, 79], [43, 48, 45, 41], [[55, 59, 62], [60, 64, 67], [57, 60, 64], [53, 57, 60]]),
    ("midnight-game", "sine", [55, 62, 65, 69, 65, 62, 53, 60, 64, 67, 64, 60, 50, 57, 62, 65], [43, 38, 41, 36], [[55, 58, 62], [50, 53, 57], [53, 57, 60], [48, 52, 55]]),
]

def hz(note):
    return 440 * 2 ** ((note - 69) / 12)

def tone(buffer, start, seconds, note, amplitude, shape, attack=.025, release=.12):
    freq = hz(note)
    count = int(seconds * RATE)
    phase = 2 * pi * freq / RATE
    end = min(len(buffer), start + count)
    for absolute in range(start, end):
        pos = absolute - start
        t = pos / RATE
        env = min(1.0, t / attack) * min(1.0, max(0.0, (seconds - t) / release))
        angle = phase * pos
        if shape == "square":
            sample = 1.0 if sin(angle) >= 0 else -1.0
        elif shape == "triangle":
            sample = 2 / pi * asin(sin(angle))
        else:
            sample = sin(angle)
        buffer[absolute] += sample * env * amplitude

def main():
    output = Path(__file__).resolve().parents[1] / "public" / "music"
    output.mkdir(parents=True, exist_ok=True)
    frames = int(RATE * BEAT * 16)
    for name, shape, melody, bass, chords in TRACKS:
        mix = [0.0] * frames
        for beat, note in enumerate(melody):
            tone(mix, int(beat * BEAT * RATE), .42, note, .17 if shape == "square" else .21, shape, .012, .12)
        for bar, root in enumerate(bass):
            tone(mix, int(bar * 4 * BEAT * RATE), 1.85, root, .19, "triangle", .06, .25)
            tone(mix, int((bar * 4 + 2) * BEAT * RATE), 1.85, root + 7, .11, "sine", .06, .25)
            for note in chords[bar]:
                tone(mix, int(bar * 4 * BEAT * RATE), 1.9, note + 12, .055, "sine", .15, .3)
        peak = max(abs(sample) for sample in mix) or 1
        pcm = array("h", (int(max(-1, min(1, sample / peak * .82)) * 32767) for sample in mix))
        if struct.pack("=H", 1) != struct.pack("<H", 1):
            pcm.byteswap()
        with wave.open(str(output / f"{name}.wav"), "wb") as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(RATE)
            wav.writeframes(pcm.tobytes())

if __name__ == "__main__":
    main()
