<div class='size-full relative'>
  <div class='aspect-[4/3] inset-0 absolute m-auto max-w-full max-h-full overflow-hidden'>
    <div id='noise' class='size-full blur-sm scale-105'></div>
  </div>
</div>

<style lang='postcss'>
  /* Source: https://css-tricks.com/making-static-noise-from-a-weird-css-gradient-bug/ */
  #noise {
    background:
      repeating-radial-gradient(#000 0 0.00001%,#666 0 0.00002%) 50% 0/400rem 400rem,
      repeating-conic-gradient(#000 0 0.00001%,#666 0 0.00002%) 60% 60%/400rem 400rem;
    background-blend-mode: difference;
    animation: b .3s infinite alternate;
  }

  @keyframes b {
    100% {background-position: 50% 0, 60% 50%
  }
}
</style>
