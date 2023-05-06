<script setup lang="ts">

import { computed } from 'vue';

const { text } = defineProps<{ text: string; }>();

const lines = computed(() => text.split('\n'));

</script>

<template>
  <div style="word-break: break-all;">
    <p v-for="(line, index) in lines" :key="index">
      {{ line }}
    </p>
  </div>
</template>
