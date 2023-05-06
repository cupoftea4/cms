
<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue';
import { isMobile } from '@/shared/utils';

import ChatList from '@/modules/chat/ChatList.vue';
import Chat from '@/modules/chat/Chat.vue';
import { getChats } from '@/modules/chat/api';

import { useWindowResize } from '@/composables/useWindowResize';
import { useRouter } from 'vue-router';
import type { ApiChat } from '@/shared/types';

const chats = ref<ApiChat[]>([]);

const selectedChatId = ref<number>();
const { width } = useWindowResize();
const { currentRoute } = useRouter();

watchEffect(() => {
  const id = Number(currentRoute.value.hash.slice(1));
  selectedChatId.value = id || undefined;
});

const selectedChat = computed(() => chats.value.find((chat) => chat.id === selectedChatId.value));

function selectChat(id: number) {
  location.hash = `#${id}`;
}

onMounted(() => {
  getChats().then((data) => {
    chats.value = data;
  });
})

</script>

<template>
  <div class="messenger">
    <ChatList v-if="!isMobile(width) || !selectedChat" :chats=chats :selectChat=selectChat></ChatList>
    <Chat v-if=selectedChat :chat=selectedChat></Chat>
  </div>
</template>

<style scoped lang="scss">

.messenger {
  width: 100%; 
  display: flex; 
}

</style>
