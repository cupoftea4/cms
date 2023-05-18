
<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue';
import { isMobile } from '@/shared/utils';

import ChatList from '@/modules/chat/components/ChatList.vue';
import Chat from '@/modules/chat/components/Chat.vue';

import { useWindowResize } from '@/composables/useWindowResize';
import { useRouter } from 'vue-router';
import { emitGetChats, emitGetUnreadMessages, subscribeToNewMessage } from '@/modules/chat/gateway';
import type { ApiChat, ApiMessage } from '@/shared/types';
import { useMessagesStore } from '@/stores/messages';
import { socket } from '@/services/socketio.service';

const chats = ref<ApiChat[]>([]);

const selectedChatId = ref<string>();
const { width } = useWindowResize();
const messagesStore = useMessagesStore();
const router = useRouter();

const selectedChat = computed(() => chats.value.find((chat) => chat.id === selectedChatId.value));

onMounted(() => {
  socket.connect();
  socket.on('connected', () => {
    console.log('connected');
    updateChats();
    subscribeToNewMessage('all', (message, chatId) => {
      if (!chatId) return;
      updateLastMessage(message, chatId);
      const chatName = chats.value.find(c => c.id === chatId)?.name;
      if (!chatName) throw new Error('Chat from received message not found');
      messagesStore.unreadMessages.push({
        id: message.id,
        preview: message.text ?? 'Attachment',
        timestamp: message.timestamp,
        chatId, 
        chatName,
      });
    });
    emitGetUnreadMessages(data => messagesStore.unreadMessages = data);
  });

})

function updateChats(chat?: ApiChat) {
  if (chat) {
    chats.value = chats.value.filter(c => c.id !== chat.id);
    chats.value.unshift(chat);
    return;
  }
  emitGetChats(data => chats.value = data);
}

watchEffect(() => {
  const id = router.currentRoute.value.params.id as string;
  selectedChatId.value = id || undefined;
});

function updateLastMessage(message: ApiMessage, chatId: string) {
  let chat: ApiChat | undefined;
  chats.value = chats.value.filter(c => {
    if (c.id === chatId) {
      chat = c;
      return false;
    } 
    return true;
  });
  if (!chat) return;
  chat.lastMessage = {
    id: message.id,
    text: message.text ?? 'Attachment',
    timestamp: message.timestamp,
  };
  chats.value.unshift(chat);
}

</script>

<template>
  <div class="messenger">
    <ChatList v-if="!isMobile(width) || !selectedChat" :chats=chats :updateChats=updateChats ></ChatList>
    <Chat v-if=selectedChat :chat=selectedChat :onMessage='(m: ApiMessage) => updateLastMessage(m, selectedChatId!)'></Chat>
  </div>
</template>

<style scoped lang="scss">

.messenger {
  width: 100%; 
  display: flex; 
}

</style>
