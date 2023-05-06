<script setup lang="ts">

import styles from './LoadingMessages.module.scss';
import { classes } from '@/styles/utils';

const MESSAGE_SHAPES_COUNT = 6;

function randomInteger(max: number) {
  return Math.ceil(Math.random() * max);
}

function isMyMessage(messageIndex: number) {
  return messageIndex % 3 === 0;
}

</script>

<template>
  <div 
    v-for='messageIndex in Array.from(Array(MESSAGE_SHAPES_COUNT).keys())' 
    :class='classes(styles.message, isMyMessage(messageIndex) && styles.sent)' 
    :style='{"--random-for-width": `${randomInteger(350)}px`, "--random-for-height": `${randomInteger(2)}`}'
  >
    <div :class=styles.avatar v-if='!isMyMessage(messageIndex)'></div>
    <div :class=styles.shape></div>
  </div>
</template>




