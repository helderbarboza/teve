<!--
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
-->
<div id='tv-static' style='background-image: url(/tv-static.gif);'></div>

<style>
@keyframes -global-tv-static {
  0% {
    background-position: 0% 0%;
    background-size: calc(1200px / 4);
  }

  100% {
    background-position: 100% 100%;
    background-size: calc(1200px / 8);
  }
}

#tv-static {
  animation: tv-static 48ms linear infinite alternate;
  image-rendering: pixelated;
  background-repeat: repeat;
  width: 100%;
  height: 100%;
}
</style>
