<script lang='ts'>
  import type { MediaPlayerElement } from 'vidstack/elements'
  import { onMount } from 'svelte'
  import { isYouTubeProvider } from 'vidstack'
  import { VidstackPlayer } from 'vidstack/global/player'
  import 'vidstack/player/styles/default/theme.css'
  import 'vidstack/player/styles/default/layouts/audio.css'
  import 'vidstack/player/styles/default/layouts/video.css'

  const noop = function () {}
  let target: HTMLDivElement

  // let player = $state<MediaPlayerElement>()

  interface Props {
    readonly player?: MediaPlayerElement
    readonly isPlaying?: boolean
    readonly isMuted?: boolean
    readonly canPlay?: boolean
    readonly isPlayerReady?: boolean
    onReady?: (player: MediaPlayerElement) => void
    videoId: string
  }

  let {
    player = $bindable(),
    isPlaying = $bindable(false),
    isMuted = $bindable(true),
    canPlay = $bindable(false),
    isPlayerReady = $bindable(false),
    videoId = $bindable(),
    onReady = noop,
    ...rest
  }: Props = $props()

  let src = $state<string>()

  $effect.pre(() => {
    src = `youtube/${videoId}`
  })
  console.log(src)

  export function mute() {
    if (!(player && isYouTubeProvider(player.provider)))
      throw new Error('player is undefined')

    player.provider.setMuted(true)
  }

  export function unmute() {
    if (!(player && isYouTubeProvider(player.provider)))
      throw new Error('player is undefined')

    player.provider.setMuted(false)
  }

  export function play() {
    if (!(player && isYouTubeProvider(player.provider)))
      throw new Error('player is undefined')

    player.provider.play()
  }

  export function pause() {
    if (!(player && isYouTubeProvider(player.provider)))
      throw new Error('player is undefined')

    player.provider.pause()
  }

  export function setVolume(volume: number) {
    if (!(player && isYouTubeProvider(player.provider)))
      throw new Error('player is undefined')

    player.provider.setVolume(volume)
  }

  export function getVolume() {
    if (!(player && isYouTubeProvider(player.provider)))
      throw new Error('player is undefined')
    return player.volume * 100
  }

  export function playVideoAt(videoId: string, currentTime: number) {
    if (!(player && isYouTubeProvider(player.provider)))
      throw new Error('player is undefined')

    player.src = `youtube/${videoId}`
    player.currentTime = currentTime
  }

  export function getDuration() {
    if (!(player && isYouTubeProvider(player.provider)))
      throw new Error('player is undefined')

    return player.duration
  }

  onMount(async () => {
    player = await VidstackPlayer.create({
      target,
      src,
      load: 'eager',
      viewType: 'video',
      streamType: 'on-demand',
      logLevel: 'debug',
      crossOrigin: true,
      playsInline: true,
      controls: false,
      muted: true,
      autoplay: true,
      preload: 'auto',
    })
    onReady(player)

    isPlayerReady = true

    player.className = 'size-full'

    player.addEventListener('provider-change', async (event) => {
      const provider = event.detail
      if (isYouTubeProvider(provider))
        provider.cookies = false
    })

    player.addEventListener('auto-play', () => {
      if (player && isYouTubeProvider(player.provider))
        player.provider?.setMuted(true)
    })

    player.addEventListener('playing', () => {
      setTimeout(() => {
        isPlaying = true
      }, 300)
    })

    player.addEventListener('pause', () => {
      isPlaying = false
    })

    player.addEventListener('can-play', () => {
      canPlay = true
    })
  })

</script>

<div bind:this={target} {...rest} class='size-full'>
  <!-- <div class='flex gap-4'>
    <button onclick={() => {
      if (player && isYouTubeProvider(player.provider))
        player.provider.setMuted(true)
    }}>mute</button>
    <button onclick={() => {
      if (player && isYouTubeProvider(player.provider))
        player.provider.setMuted(false)
    }}>unmute</button>
    <button onclick={() => {
      if (player && isYouTubeProvider(player.provider))
        player.provider.play()
    }}>play</button>
    <button onclick={() => {
      if (player && isYouTubeProvider(player.provider))
        player.provider.pause()
    }}>pause</button>
  </div> -->
</div>
