from pydub import AudioSegment
import numpy as np
from scipy.fft import fft

# Function to calculate loudness
def calculate_loudness(sound_chunk):
    samples = np.array(sound_chunk.get_array_of_samples())
    rms_value = np.sqrt(np.mean(samples**2))
    return 20 * np.log10(rms_value) if rms_value > 0 else -float("inf")

# Function to check if a chunk contains scream-like sounds based on volume and frequency content
def is_scream(sound_chunk, loudness_threshold=-20.0, pitch_threshold=800):
    # Calculate loudness in dB
    loudness = calculate_loudness(sound_chunk)
    
    # Fast Fourier Transform to analyze frequency content
    samples = np.array(sound_chunk.get_array_of_samples())
    fft_values = np.abs(fft(samples))
    freqs = np.fft.fftfreq(len(samples), 1 / sound_chunk.frame_rate)
    
    # Check for loudness and frequency threshold
    loud_enough = loudness > loudness_threshold
    high_pitch_content = any(freq for freq, amp in zip(freqs, fft_values) if amp > pitch_threshold and freq > 1000)
    
    return loud_enough and high_pitch_content

# Main function to process audio file and detect screams
def detect_screams(file_path, segment_duration_ms=500):
    # Load audio file
    audio = AudioSegment.from_file(file_path)
    
    # Divide the audio into segments of specified duration
    segments = [audio[i:i + segment_duration_ms] for i in range(0, len(audio), segment_duration_ms)]
    
    scream_segments = []
    for i, segment in enumerate(segments):
        if is_scream(segment):
            scream_segments.append((i * segment_duration_ms / 1000, (i + 1) * segment_duration_ms / 1000))
    
    return scream_segments

# Example usage
file_path = "80s-scream-255968.mp3"  # Replace with your audio file path
scream_segments = detect_screams(file_path)
if scream_segments:
    print("Scream detected in the following segments (in seconds):")
    for start, end in scream_segments:
        print(f"From {start:.2f} to {end:.2f} seconds")
else:
    print("No scream detected.")
