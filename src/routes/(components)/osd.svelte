<script lang='ts'>
  interface Props {
    volume: number
    volumeUnits: number
    isMuted: boolean
    channelName: string
    channelId: number
  }

  const { volume, volumeUnits, isMuted, channelName, channelId }: Props = $props()
  const filledChar = '|'
  const emptyChar = '.'
  let currentViewTimeoutId = $state<number>()
  let currentView = $state<(() => ReturnType<import('svelte').Snippet>)>(emptyView)

  export function onVolumeChange() {
    if (currentView !== volumeMeter)
      currentView = volumeMeter

    if (currentViewTimeoutId)
      clearTimeout(currentViewTimeoutId)

    resetViewWithDelay()
  }

  export function onChannelChange() {
    if (currentView !== channelInfo)
      currentView = channelInfo

    if (currentViewTimeoutId)
      clearTimeout(currentViewTimeoutId)

    resetViewWithDelay()
  }

  export function onMute() {
    if (currentView !== emptyView)
      currentView = emptyView

    if (currentViewTimeoutId)
      clearTimeout(currentViewTimeoutId)
  }

  function progressArray(length: number, ratio: number) {
    const filledCount = Math.ceil(length * ratio)
    return Array.from({ length }, (_, i) => i < filledCount)
  }

  const delayTimeout = 3000

  function resetView() {
    currentView = emptyView
    currentViewTimeoutId = undefined
  }

  function resetViewWithDelay() {
    currentViewTimeoutId = setTimeout(() => {
      resetView()
    }, delayTimeout)
  }

</script>

<svelte:head>
  <link href='https://fonts.cdnfonts.com/css/vcr-osd-mono' rel='stylesheet'>
</svelte:head>

{#snippet padding(count: number)}
  {#each { length: count } as _}
    <p></p>
  {/each}
{/snippet}

{#snippet volumeMeter()}
  <p>VOLUME</p>
  <p class='tracking-half'>
    {#each progressArray(volumeUnits, volume / 100) as bar}
      {bar ? filledChar : emptyChar}
    {/each}</p>
{/snippet}

{#snippet channelInfo()}
  <p>{channelId} {channelName}</p>
{/snippet}

{#snippet mutedIndicator()}
  <p>MUTED</p>
{/snippet}

{#snippet emptyView()}
  {#if isMuted}
    {@render mutedIndicator()}
  {/if}
{/snippet}

<div class='text-[#0F0] [container-type:size] flex items-end aspect-[4/3] max-w-min max-h-min w-[calc(75vh_*_4_/_3)] h-[calc(75vw_*_3_/_4)]'>
  <div class='*:truncate w-full'>
    {#if currentView}
      {@render currentView()}
    {/if}
  </div>
</div>

<style lang='postcss'>
  * {
    @apply text-[12.5cqh] leading-none;
    font-family: 'VCR OSD Mono', 'Courier New', Courier, monospace;
    font-smooth: never !important;
    -webkit-font-smoothing: none !important;
    user-select: none;
  }

  .tracking-half {
    @apply -tracking-[0.5ch];
  }
</style>
