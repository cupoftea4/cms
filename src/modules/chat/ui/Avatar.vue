<script setup lang="ts">
import DefaultAvatar from '@/assets/DefaultAvatar.vue';

const props = defineProps<{
  avatar: string | null | undefined;
  size: number;
}>();

</script>
<template>
  <div class="avatar" :style='{display: "flex", "align-items": "center"}'>
    <img v-if="avatar" :src="avatar">
      <DefaultAvatar v-else />
  </div>
</template>
<style scoped>

</style>