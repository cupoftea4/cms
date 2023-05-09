<script setup lang="ts">
import DefaultAvatar from '@/assets/DefaultAvatar.vue';

const props = defineProps<{
  avatar: string | null | undefined;
  size: number;
}>();

</script>
<template>
  <div class="avatar" :style="{
    width: `${size}px`,
    height: `${size}px`,
  }">
    <img v-if="avatar" :src="avatar">
    <div v-else class="default" >
      <DefaultAvatar />
    </div>
  </div>
</template>
<style scoped>

</style>