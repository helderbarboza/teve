<script lang='ts'>
  import type { MediaPlayerElement } from 'vidstack/elements'
  import { onMount } from 'svelte'
  import { isYouTubeProvider } from 'vidstack'
  import { VidstackPlayer } from 'vidstack/global/player'
  import 'vidstack/player/styles/default/theme.css'
  import 'vidstack/player/styles/default/layouts/audio.css'
  import 'vidstack/player/styles/default/layouts/video.css'

  let target: HTMLDivElement
  // let player = $state<MediaPlayerElement>()

  interface Props {
    readonly isPlaying?: boolean
    readonly isMuted?: boolean
    readonly player?: MediaPlayerElement
    readonly mute?: () => void
    readonly unmute?: () => void
    readonly play?: () => void
    readonly pause?: () => void
  }

  let {
    isPlaying = $bindable(false),
    isMuted = $bindable(true),
    player = $bindable(),
    ...rest
  }: Props = $props()

  export function mute() {
    if (player && isYouTubeProvider(player.provider))
      player.provider.setMuted(true)
  }

  export function unmute() {
    if (player && isYouTubeProvider(player.provider))
      player.provider.setMuted(false)
  }

  export function play() {
    if (player && isYouTubeProvider(player.provider))
      player.provider.play()
  }

  export function pause() {
    if (player && isYouTubeProvider(player.provider))
      player.provider.pause()
  }

  export function setVolume(volume) {
    if (player && isYouTubeProvider(player.provider))
      player.provider.setVolume(volume)
  }

  export function getVolume() {
    if (player && isYouTubeProvider(player.provider))
      return player.volume * 100
  }

  onMount(async () => {
    player = await VidstackPlayer.create({
      target,
      src: 'youtube/UeoBikpUIwg',
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

    player.addEventListener('provider-change', async (event) => {
      const provider = event.detail
      if (isYouTubeProvider(provider)) {
        provider.cookies = false
      }
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

  // player.addEventListener('can-play', (event) => {
    //   event.detail.provider.play()
    // })
  })

</script>

<!-- <main class='bg-black size-full text-white'> -->
<div bind:this={target} {...rest}></div>
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
<!-- </main> -->
