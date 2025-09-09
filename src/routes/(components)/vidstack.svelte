<script lang='ts'>
  import type { MediaEndedEvent, MediaPlayer, MediaPlayerProps, PlayerSrc } from 'vidstack'
  import type { MediaPlayerElement } from 'vidstack/elements'
  import type { MediaPlayerAttributes } from 'vidstack/svelte'
  import { onMount } from 'svelte'
  import { isYouTubeProvider, MediaRemoteControl } from 'vidstack'
  import { VidstackPlayer } from 'vidstack/global/player'
  import 'vidstack/bundle'

  const remote = new MediaRemoteControl()
  let playerEl = $state<MediaPlayerElement>()

  const noop = function () {}

  interface Props extends Partial<MediaPlayerProps> {
    readonly player?: MediaPlayerElement
    readonly isPlaying?: boolean
    readonly isMuted?: boolean
    readonly canPlay?: boolean
    readonly isPlayerReady?: boolean
    volume: number
    onReady?: (player: MediaPlayerElement) => void
    onEnded?: (this: HTMLElement, ev: MediaEndedEvent) => any
  }

  // type Props = CustomProps & Partial<MediaPlayerProps>

  let {
    player = $bindable(),
    isPlaying = $bindable(false),
    isMuted = $bindable(true),
    canPlay = $bindable(false),
    isPlayerReady = $bindable(false),
    volume = $bindable(1),
    onReady = noop,
    onEnded = noop,
    ...rest
  }: Props = $props()

  $effect(() => {
    if (rest.src && playerEl)
      playVideoAt(rest.src, 0)
  })

  export function mute() {
    if (!(playerEl && isYouTubeProvider(playerEl.provider)))
      throw new Error('player is undefined')

    playerEl.provider.setMuted(true)
  }

  export function unmute() {
    if (!(playerEl && isYouTubeProvider(playerEl.provider)))
      throw new Error('player is undefined')

    playerEl.provider.setMuted(false)
  }

  export function play() {
    if (!(playerEl && isYouTubeProvider(playerEl.provider)))
      throw new Error('player is undefined')

    playerEl.provider.play()
  }

  export function pause() {
    if (!(playerEl && isYouTubeProvider(playerEl.provider)))
      throw new Error('player is undefined')

    playerEl.provider.pause()
  }

  export function setVolume(value: number) {
    if (!(playerEl && isYouTubeProvider(playerEl.provider)))
      throw new Error('player is undefined')

    playerEl.provider.setVolume(value)
    volume = value
  }

  export function getVolume() {
    if (!(playerEl && isYouTubeProvider(playerEl.provider)))
      throw new Error('player is undefined')
    return playerEl.volume
  }

  export function playVideoAt(videoId: PlayerSrc, currentTime: number) {
    if (!(playerEl))
      throw new Error('player is undefined')

    playerEl.src = `youtube/${videoId}`
    playerEl.currentTime = currentTime
  }

  export function getDuration() {
    if (!(playerEl && isYouTubeProvider(playerEl.provider)))
      throw new Error('player is undefined')

    return playerEl.duration
  }

  onMount(async () => {
    if (playerEl === undefined)
      throw new Error('Player is undefined')

    player = playerEl

    isPlayerReady = true

    player.addEventListener('provider-change', async (event) => {
      console.info('provider-change')
      const provider = event.detail
      if (isYouTubeProvider(provider))
        provider.cookies = false
    })

    player.addEventListener('auto-play', () => {
      console.info('auto-play')
      if (player && isYouTubeProvider(player.provider))
        player.provider?.setMuted(true)
    })

    player.addEventListener('playing', () => {
      console.info('playing')
      // player!.provider?.setVolume(volume)
      player?.volume = volume

      setTimeout(() => {
        isPlaying = true
      }, 350)
    })

    player.addEventListener('pause', () => {
      console.info('pause')
      isPlaying = false
    })

    player.addEventListener('can-play', () => {
      console.info('can-play')
      player!.play()
      canPlay = true
    })

    player.addEventListener('ended', onEnded)
  })

</script>

<!-- <div bind:this={target} {...rest} class='size-full' id='player-parent'> -->
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
<!-- </div> -->

<media-player
  bind:this={playerEl}
  class='size-full'
  autoplay
  viewType='video'
  load='eager'
  streamType='on-demand'
  crossOrigin
  playsInline
  controls={false}
  muted
  preload='auto'
  logLevel='info'
  {...rest}
>
  <!-- //   target: '#player-parent',
    //   src,
    //   load: 'eager',
    //   viewType: 'video',
    //   streamType: 'on-demand',
    //   // logLevel: 'debug',
    //   crossOrigin: true,
    //   playsInline: true,
    //   controls: false,
    //   muted: true,
    //   autoplay: true,
    //   preload: 'auto', -->
  <media-provider></media-provider>
</media-player>
