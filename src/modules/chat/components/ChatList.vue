<script setup lang="ts">

import { ref } from 'vue';
import type { ApiChat } from '@/shared/types';
import { emitCreateChat } from '../gateway';
import { formatDate } from '../helpers';

import NewChat from './NewChat.vue';
import Avatar from '@/modules/chat/ui/Avatar.vue';

import styles from './ChatList.module.scss';

const { chats } = defineProps<{
  chats: ApiChat[];
}>();

const showCreateChat = ref(false);

function createChat() {
  console.log('create chat');
  const data = emitCreateChat({ name: 'New chat', isPrivate: true, userIds: [1, 2]});
  console.log(data);
}

</script>

<template>
  <div :class=styles.root>
    <ol :class=styles.list>
      <li v-for="chat in chats" :key="chat.id" :class='styles["chat-li"]'   >
        <router-link :to="{ name: 'chat', params: { id: chat.id } }">
          <div :class='styles.info'>
            <Avatar :avatar=chat.avatar :size=50 />
            <p :class="styles.data">
              {{ chat.name }}
              <p :class=styles.preview>{{ chat.lastMessage ? chat.lastMessage.text : "Chat is empty." }}</p> 
            </p> 
          </div>
          <span :class=styles.date>
            {{chat.lastMessage && formatDate(chat.lastMessage.timestamp) }}
          </span>
        </router-link>
      </li>
      <li>
        <button @click='showCreateChat = true' :class=styles.button>+ New Chat</button>
      </li>
    </ol>
  </div>
  <NewChat v-if=showCreateChat />
</template>
