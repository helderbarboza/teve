<script lang='ts'>
  import type { Channel, Video } from './(data)/data'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import Control from './(components)/control.svelte'
  import Noise from './(components)/noise.svelte'
  import Osd from './(components)/osd.svelte'
  import StandBy from './(components)/stand-by.svelte'
  import Vidstack from './(components)/vidstack.svelte'
  import { userData } from './(data)/data'

  const channels = userData.channels
    .filter(channel => channel.videos.length > 0)

  channels.unshift({ name: 'Random', videos: channels.flatMap(channel => (channel.videos)) })

  let player: Vidstack
  let osd: Osd
  let isUserMuted = $state(true)
  let isPlayerMuted = $state(true)
  let volume = $state(100)

  const getChannelFromParams = (channels: Channel[]) => {
    const value = page.url.searchParams.get('channel')

    if (!value)
      return 0

    const channelIndex = channels.findIndex(channel => channel.name === value)

    if (channelIndex < 0)
      return 0

    return channelIndex
  }

  let currentChannelIndex = $state(getChannelFromParams(channels))
  const currentChannel = $derived<Channel>(channels.at(currentChannelIndex)!)

  let currentVideo = $state<Video>((() => {
    const { video } = getChannelCurrentVideo(currentChannel)
    return video
  })())
  let currentTime = $state<number>()
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

  const unmute = () => {
    isUserMuted = false
    osd.onVolumeChange()
  }

  const toggleMute = () => {
    isUserMuted ? unmute() : mute()
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
        player.unmute()
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

  $effect(() => {
    if (isInteracted && isPlaying) {
      isUserMuted ? player.mute() : player.unmute()
      isPlayerMuted = isUserMuted
    }
  })

  $effect.pre(() => {
    const searchParams = new URLSearchParams()
    searchParams.set('channel', currentChannel.name)
    goto(`?${searchParams.toString()}`)
  })

  function getChannelCurrentVideo(channel: Channel, currentTime: number = Date.now() / 1000) {
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

  $effect.pre(() => {
    const { video: { id: videoId }, playAt } = getChannelCurrentVideo(currentChannel)
  })

  const userInteracted = () => {
    if (!isInteracted)
      isInteracted = true
  }

</script>

<svelte:document
  onclickcapture={userInteracted}
  onkeydowncapture={userInteracted}
  ontouchstartcapture={userInteracted}
></svelte:document>

<main class='relative size-full bg-black text-white overflow-hidden'>
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
  <Vidstack
    bind:this={player}
    bind:isPlayerReady
    videoId={currentVideo.id}
  />
  <!-- <div class={`inset-0 absolute ${showErrorOverlay || showTuningOverlay ? 'bg-black' : 'opacity-0'} transition-opacity duration-200 select-none`}>
    {#if showErrorOverlay}
      <StandBy />
    {:else if showTuningOverlay}
      <Noise />
    {/if}
  </div> -->
  <div class='absolute inset-0 flex justify-center items-center pointer-events-none'>
    <Osd
      bind:this={osd}
      volume={volume}
      {volumeUnits}
      isMuted={isPlayerMuted}
      {channelName}
      channelId={currentChannelIndex + 1}
    />
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
      <Control {isPlayerReady} controlName='mute' handler={() => { toggleMute() }}></Control>
    </div>
    <div>
      <div class='text-xs mb-1'>VOL</div>
      <div class='space-y-1'>
        <Control {isPlayerReady} controlName='vol-up' handler={() => { volumeUp() }}>➕</Control>
        <Control {isPlayerReady} controlName='vol-down' handler={() => { volumeDown() }}>➖</Control>
      </div>
    </div>
    <div>
      <div class='text-xs mb-1'>CH</div>
      <div class='space-y-1'>
        <Control {isPlayerReady} controlName='next-channel' handler={() => { setChannelByOffset(1) }}>➕</Control>
        <Control {isPlayerReady} controlName='prev-channel' handler={() => { setChannelByOffset(-1) }}>➖</Control>
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
