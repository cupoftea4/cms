<template>
<div class="fulfilling-bouncing-circle-spinner">
  <div class="circle"></div>
  <div class="orbit"></div>
</div>
</template>

<style scoped>


.fulfilling-bouncing-circle-spinner, .fulfilling-bouncing-circle-spinner * {
      box-sizing: border-box;
    }

    .fulfilling-bouncing-circle-spinner {
      --size: 20px;
      --color: #fff;

      height: var(--size);
      width: var(--size);
      position: relative;
      animation: fulfilling-bouncing-circle-spinner-animation infinite 4000ms ease;
    }

    .fulfilling-bouncing-circle-spinner .orbit {
      height: var(--size);
      width: var(--size);
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 50%;
      border: calc(var(--size) * 0.03) solid var(--color);
      animation: fulfilling-bouncing-circle-spinner-orbit-animation infinite 4000ms ease;
    }

    .fulfilling-bouncing-circle-spinner .circle {
      height: var(--size);
      width: var(--size);
      color: var(--color);
      display: block;
      border-radius: 50%;
      position: relative;
      border: calc(var(--size) * 0.1) solid #fff;
      animation: fulfilling-bouncing-circle-spinner-circle-animation infinite 4000ms ease;
      transform: rotate(0deg) scale(1);
    }

    @keyframes fulfilling-bouncing-circle-spinner-animation {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes fulfilling-bouncing-circle-spinner-orbit-animation {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1);
      }
      62.5% {
        transform: scale(0.8);
      }
      75% {
        transform: scale(1);
      }
      87.5% {
        transform: scale(0.8);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes fulfilling-bouncing-circle-spinner-circle-animation {
      0% {
        transform: scale(1);
        border-color: transparent;
        border-top-color: inherit;
      }
      16.7% {
        border-color: transparent;
        border-top-color: initial;
        border-right-color: initial;
      }
      33.4% {
        border-color: transparent;
        border-top-color: inherit;
        border-right-color: inherit;
        border-bottom-color: inherit;
      }
      50% {
        border-color: inherit;
        transform: scale(1);
      }
      62.5% {
        border-color: inherit;
        transform: scale(1.3);
      }
      75% {
        border-color: inherit;
        transform: scale(1);
        opacity: 1;
      }
      87.5% {
        border-color: inherit;
        transform: scale(1.3);
      }
      100% {
        border-color: transparent;
        border-top-color: inherit;
        transform: scale(1);
      }
    }
</style>