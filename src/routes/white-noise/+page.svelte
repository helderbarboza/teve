<script lang='ts'>
  import { browser } from '$app/environment'

  const noise = () => {
    const audioContext = new AudioContext()
    const bufferSize = 2 * audioContext.sampleRate
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = audioContext.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true
    whiteNoise.start(0)

    whiteNoise.connect(audioContext.destination)
  }
</script>

<button onclick={noise}>go</button>
