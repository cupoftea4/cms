<script setup lang="ts">

import styles from './ChatList.module.scss';
import type { ApiChat } from '@/shared/types';
import { formatDate } from './helpers';

const { chats } = defineProps<{
  chats: ApiChat[];
  selectChat: (id: number) => void;
}>();


</script>

<template>
  <div :class=styles.root>
    <ol :class=styles.list>
      <li v-for="chat in chats" :key="chat.id" :class='styles["chat-li"]' @click=selectChat(chat.id)>
        <router-link :to="{ name: 'chat', params: { id: chat.id } }">
          <div :class='styles.info'>
            <img :class=styles.avatar :src=chat.avatar />
            <p :class="styles.data">
              {{ chat.name }}
              <p :class=styles.preview>{{ chat.lastMessage.text }}</p> 
            </p> 
          </div>
          <span :class=styles.date>
            {{ formatDate(chat.lastMessage.timestamp) }}
          </span>
        </router-link>
      </li>
    </ol>
  </div>
</template>
