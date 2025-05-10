<script lang='ts'>
  import type { MediaPlayerElement } from 'vidstack/elements'
  import { onMount } from 'svelte'
  import { isYouTubeProvider } from 'vidstack'
  import { VidstackPlayer, VidstackPlayerLayout } from 'vidstack/global/player'
  import 'vidstack/player/styles/default/theme.css'
  import 'vidstack/player/styles/default/layouts/audio.css'
  import 'vidstack/player/styles/default/layouts/video.css'

  const layout = new VidstackPlayerLayout({ when: false })

  let isPlaying = $state(false)

  let target: HTMLDivElement
  let player: MediaPlayerElement

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
      layout,
    })

    player.addEventListener('provider-change', async (event) => {
      const provider = event.detail
      if (isYouTubeProvider(provider)) {
        provider.cookies = false
      // await provider.play()
      }
    })

    player.addEventListener('auto-play', (event) => {
      const requestEvent = event.request
      console.log(JSON.stringify(requestEvent))
      player.provider?.setMuted(true)
      console.log(event.detail.muted)
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

<main class='bg-black text-white size-full'>
  <div class:opacity-0={!isPlaying} bind:this={target}></div>

  <div class='flex gap-4'>
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
  </div>
  <div class='text-lg'>{isPlaying}</div>
</main>
