<script lang='ts'>
  import type { Snippet } from 'svelte'

  interface Props {
    controlName: string
    handler: () => void
    isPlayerReady: boolean
    children?: Snippet
  }

  let { controlName, handler, isPlayerReady = $bindable(), children }: Props = $props()

  let repeatingActionIntervalId: number
  let repeatingActionTimeoutId: number

  const startRepeatingAction = (handler: Function) => {
    handler()

    repeatingActionTimeoutId = setTimeout(() => {
      clearInterval(repeatingActionIntervalId)
      repeatingActionIntervalId = setInterval(handler, 100)
    }, 500)
  }

  const stopRepeatingAction = () => {
    clearTimeout(repeatingActionTimeoutId)
    clearInterval(repeatingActionIntervalId)
  }

</script>

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
    onmousedown: () => startRepeatingAction(handler),
    ontouchstart: () => startRepeatingAction(handler),
    onmouseup: () => stopRepeatingAction(),
    onmouseleave: () => stopRepeatingAction(),
    ontouchend: () => stopRepeatingAction(),
    ontouchcancel: () => stopRepeatingAction(),
  }}
>
  {#if children}
    <span class='text-shadow-inset leading-none'>{@render children?.()}</span>
  {/if}
</button>
