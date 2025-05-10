<script lang='ts'>

  import type { SvelteComponent } from 'svelte'
  import type { MediaPlayerElement } from 'vidstack/elements'
  import type { Channel, Video } from './(data)/data'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import Noise from './(components)/noise.svelte'
  import Osd from './(components)/osd.svelte'
  import StandBy from './(components)/stand-by.svelte'
  import Vidstack from './(components)/vidstack.svelte'
  import { userData } from './(data)/data'

  const channels = userData.channels
    .filter(channel => channel.videos.length > 0)

  const allVideos = channels.flatMap(channel => (channel.videos))

  channels.unshift({ name: 'Random', videos: allVideos })

  let playerElement: HTMLElement
  let player: Vidstack

  let osd: Osd
  // TODO: Use persistent state

  // User states
  let isUserMuted = $state(true)

  // Player states
  let isPlayerMuted = $state(true)

  let volume = $state(100)

  const getCurrentChannelFromParams = () => {
    const value = page.url.searchParams.get('channel')

    if (!value)
      return 0

    const channelIndex = channels.findIndex(channel => channel.name === value)

    if (channelIndex < 0)
      return 0

    return channelIndex
  }

  let currentChannelIndex = $state(getCurrentChannelFromParams())
  const currentChannel = $derived<Channel>(channels.at(currentChannelIndex)!)
  let currentVideo = $state<Video>()
  let currentTime = $state<number>()
  let tuningIntervalId: number
  let showTuningOverlay = $state(true)
  let showErrorOverlay = $state(false)
  let isInteracted = $state(false)
  let isPlaying = $state(false)
  let hasBegun = $state(false)
  let isPlayerReady = $state(false)
  const channelName = $derived(currentChannel.name)
  const volumeUnits = 30
  const volumeStep = 100 / volumeUnits
  const debugPlayback = page.url.searchParams.get('debug') === '1'

  const mute = () => {
    isUserMuted = true
    osd.onMute()
  }

  const unMute = () => {
    isUserMuted = false
    osd.onVolumeChange()
  }

  const toggleMute = () => {
    isUserMuted ? unMute() : mute()
  }

  const volumeUp = () => {
    isUserMuted = false
    const newVolume = Math.min(player.getVolume() + volumeStep, 100)
    player.setVolume(newVolume)
    volume = newVolume
    osd.onVolumeChange()
  }

  const volumeDown = () => {
    isUserMuted = false
    const newVolume = Math.max(player.getVolume() - volumeStep, 0)
    player.setVolume(newVolume)
    volume = newVolume
    osd.onVolumeChange()
  }

  const disableTuning = () => {
    const action = () => {
      showTuningOverlay = false
      if (!isUserMuted && isInteracted) {
        player.unMute()
        isPlayerMuted = false
      }
    }

    if (hasBegun) {
      action()
    }
    else {
      tuningIntervalId = setTimeout(
        () => { action() },
        3_500,
      )
    }
  }

  const enableTuning = () => {
    showTuningOverlay = true
    player.mute()
    tuningIntervalId && clearInterval(tuningIntervalId)
  }

  $effect(() => {
    if (isInteracted && isPlaying) {
      isUserMuted ? player.mute() : player.unMute()
      isPlayerMuted = isUserMuted
    }
  })

  $effect(() => {
    const searchParams = new URLSearchParams()
    searchParams.set('channel', currentChannel.name)
    goto(`?${searchParams.toString()}`)
  })

  const getChannelCurrentVideo = (channel: Channel, currentTime: number = Date.now() / 1000) => {
    if (!channel.videos.length)
      throw new Error(`Channel '${channel.name}' has no videos.`)
    const durations = channel.videos.map(video => video.end - video.start)
    const totalDuration = durations.reduce((acc, duration) => acc + duration, 0)
    const loopOffset = currentTime % totalDuration
    let accumulated = 0
    for (let i = 0; i < channel.videos.length; i++) {
      const duration = durations[i]
      if (loopOffset < accumulated + duration) {
        const video = channel.videos[i]
        const playAt = video.start + (loopOffset - accumulated)
        return { video, playAt: Math.floor(playAt) }
      }
      accumulated += duration
    }

    throw new Error(`Failed to determine current video for channel '${channel.name}'. Total duration: ${totalDuration}, loopOffset: ${loopOffset}`)
  }

  const loadChannelCurrentVideo = async (channel: Channel) => {
    enableTuning()
    const { video: realtimeVideo, playAt } = getChannelCurrentVideo(channel)
    player.cueVideoById(realtimeVideo.id, playAt)
    currentVideo = realtimeVideo

    await ((timeout = 3000): Promise<void> => {
      return new Promise((resolve, reject) => {
        const start = Date.now()

        const check = () => {
          const duration = player.getDuration()
          if (duration > 0) {
            resolve()
          }
          else if (Date.now() - start > timeout) {
            reject(new Error('Timed out waiting for video duration'))
          }
          else {
            requestAnimationFrame(check)
          }
        }

        check()
      })
    })()

    const duration = player.getDuration()

    if (playAt > duration) {
      throw new Error(
        `Invalid playAt time (${playAt}s) exceeds video (${currentVideo.id}) duration (${duration}s)`,
      )
    }
    if (playAt > realtimeVideo.end) {
      // Handle case where playAt exceeds end
      console.error(`play at ${playAt} exceeds ${realtimeVideo.end}, video: ${realtimeVideo.id}`)
    }

    console.log(`queued ${currentVideo.id}`)
  }

  const setChannelByOffset = (offset: number) => {
    currentChannelIndex = ((currentChannelIndex + offset) % channels.length + channels.length) % channels.length

    loadChannelCurrentVideo(currentChannel)
    osd.onChannelChange()
  }

  const onReady: YT.Events['onReady'] = () => {
    volume = player.getVolume()

    loadChannelCurrentVideo(currentChannel)
  }

  const onError: YT.Events['onError'] = ({ data }: { data: YT.PlayerError }) => {
    console.error(data)

    if ([101, 150, 100].includes(data)) {
      showErrorOverlay = true
      const timeout = 5000
      console.info(`Player error ${data}, retrying in ${timeout}ms.`)
      setTimeout(() => {
        loadChannelCurrentVideo(currentChannel)
      }, timeout)
    }
  }

  const onStateChange: YT.Events['onStateChange'] = ({ data }) => {
    console.log({
      [-1]: 'UNSTARTED',
      0: 'ENDED',
      1: 'PLAYING',
      2: 'PAUSED',
      3: 'BUFFERING',
      5: 'CUED',
    }[data], currentVideo?.id)

    if (currentVideo && (data === YT.PlayerState.PLAYING || data === YT.PlayerState.ENDED)) {
      disableTuning()
      if (data === YT.PlayerState.PLAYING) {
        hasBegun = true
        isPlaying = true
      }

      const intervalId = setInterval(async () => {
        currentTime = player.getCurrentTime()
        volume = player.getVolume()

        if (currentVideo && (currentTime >= currentVideo.end || data === YT.PlayerState.ENDED)) {
          clearInterval(intervalId)
          hasBegun = false
          isPlaying = false
          loadChannelCurrentVideo(currentChannel)
        }
      }, 1_000)
    }
    else if (data === YT.PlayerState.CUED || data === YT.PlayerState.UNSTARTED) {
      player.playVideo()
      console.log(player.videoTitle)
      showErrorOverlay = false
      isPlaying = false
    }
    else if (data === YT.PlayerState.PAUSED) {
      isPlaying = false
      enableTuning()
    }
  }

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player(playerElement, {
      width: '100%',
      height: '100%',
      playerVars: ({
        autoplay: 1,
        controls: 1,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        rel: 0,
      }),
      events: { onReady, onStateChange, onError },
    })
    isPlayerReady = true
  }

  const userInteraction = () => {
    if (!isInteracted)
      isInteracted = true
  }

  let repeatingActionIntervalId: number
  let repeatingActionTimeoutId: number

  const startRepeatingAction = (eventHandler: Function) => {
    eventHandler()

    repeatingActionTimeoutId = setTimeout(() => {
      clearInterval(repeatingActionIntervalId)
      repeatingActionIntervalId = setInterval(eventHandler, 100)
    }, 500)
  }

  const stopRepeatingAction = () => {
    clearTimeout(repeatingActionTimeoutId)
    clearInterval(repeatingActionIntervalId)
  }

</script>

{#snippet control(text: string | undefined, controlName: string, eventHandler: () => void)}
  <button
    class='
      pt-[0.6rem] px-[1.0rem] pb-[0.9rem] transition-all duration-150 ease-in-out
      rounded-full text-neutral-900/40 font-bold bg-neutral-300 text-xl
      shadow-[rgba(99,_99,_99,_0.2)_0_2px_8px_0,_inset_0px_-6px_0px_rgba(0,_0,_0,_0.1),_inset_0px_-2px_0px_rgba(0,_0,_0,_0.15)]
      hover:brightness-[1.1] active:brightness-[0.9]
      active:shadow-[rgba(99,_99,_99,_0.2)_0_2px_6px_0,_inset_0px_-1px_0px_rgba(0,_0,_0,_0.15)]
      active:py-[0.75rem] m-auto min-w-14 flex justify-center disabled:opacity-20 disabled:transition-opacity
    '
    disabled={!isPlayerReady}
    data-control={controlName}
    role='button'
    {...{
      onmousedown: () => startRepeatingAction(eventHandler),
      ontouchstart: () => startRepeatingAction(eventHandler),
      onmouseup: () => stopRepeatingAction(),
      onmouseleave: () => stopRepeatingAction(),
      ontouchend: () => stopRepeatingAction(),
      ontouchcancel: () => stopRepeatingAction(),
    }}
  >
    {#if text}
      <span class='text-shadow-inset leading-none'>{text}</span>
    {/if}
  </button>
{/snippet}

<svelte:head>
  <script src='https://www.youtube.com/iframe_api'></script>
</svelte:head>

<svelte:document
  onclickcapture={userInteraction}
  onkeydowncapture={userInteraction}
  ontouchstartcapture={userInteraction}
></svelte:document>

<main class='relative size-full bg-black text-white'>
  <!-- <div class='left-0 absolute h-svh overflow-scroll text-white'>
    {#each channels as channel}
      <dl>
        <dt class='font-bold text-xs mt-2 mb-1'>{channel.name}</dt>
        {#each channel.videos as video}
          <dd><button onclick={() => loadVideo(video)}>{video.id}</button></dd>
        {/each}
      </dl>
    {/each}
  </div> -->
  <Vidstack bind:this={player} />
  <!-- <div class={`inset-0 absolute ${showErrorOverlay || showTuningOverlay ? 'bg-black' : 'opacity-0'} transition-opacity duration-200 select-none`}>
    {#if showErrorOverlay}
      <StandBy />
    {:else if showTuningOverlay}
      <Noise />
    {/if}
  </div> -->
  <div class='absolute inset-0 flex justify-center items-center pointer-events-none'>
    <Osd bind:this={osd} volume={volume} {volumeUnits} isMuted={isPlayerMuted} {channelName} channelId={currentChannelIndex + 1} />
  </div>
  <div class='bottom-1/2 flex rounded-lg m-4 bg-neutral-900/80 backdrop-blur flex-col justify-end right-0 translate-y-1/2 absolute *:text-white gap-4 text-center p-4'>
    <!-- <p>state: {playerState}</p>
    <p>{currentChannel.name} ({currentChannel.videos.length})</p>
    <p>#{currentVideo ? currentChannel.videos.indexOf(currentVideo) : null} {currentVideo?.id}</p>
    <p>{currentTime?.toFixed(5)}</p>
    <p>playing? {showTuningOverlay ? '🟥' : '✅'}</p>
    <hr class='my-8'> -->
    {#if debugPlayback}
      <div class='text-white text-xs'>
        <div class='select-all'>{currentVideo?.id}</div>
        <div class='select-all'>{currentVideo?.start} - {currentVideo?.end} ({currentVideo && currentVideo?.end - currentVideo?.start}s)</div>
        <div class='select-all'>{currentTime?.toFixed()}</div>
      </div>
    {/if}
    <div>
      <div class='text-xs mb-1'>MUTING</div>
      {@render control(undefined, 'mute', () => { toggleMute() })}
    </div>
    <div>
      <div class='text-xs mb-1'>VOL</div>
      <div class='space-y-1'>
        {@render control('➕', 'vol-up', () => { volumeUp() })}
        {@render control('➖', 'vol-down', () => { volumeDown() })}
      </div>
    </div>
    <div>
      <div class='text-xs mb-1'>CH</div>
      <div class='space-y-1'>
        {@render control('➕', 'next-channel', () => { setChannelByOffset(1) })}
        {@render control('➖', 'prev-channel', () => { setChannelByOffset(-1) })}
      </div>
    </div>
  </div>
</main>

<style class='postcss'>
  .text-shadow-inset {
    text-shadow:
      1px 1px 2px rgba(255, 255, 255, 0.5),
      -0.5px -0.5px 2px rgba(0, 0, 0, 0.5);
    mix-blend-mode: hard-light;

  }

  .control-button {
    transition:
    box-shadow 0.15s,
    transform 0.15s;
  }

  .control-button:hover {
    box-shadow:
      #333 0 2px 8px,
      #333 0 3px 6px -3px;
    transform: translateY(-2px);
  }

  .control-button:active {
    box-shadow: #222 0 3px 7px inset;
    transform: translateY(2px);
  }
</style>
