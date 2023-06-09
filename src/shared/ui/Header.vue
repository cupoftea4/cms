<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import styles from './Header.module.scss';
import BellIcon from '@/shared/ui/icons/BellIcon.vue';
import { useUserStore } from '@/stores/user';
import { toast } from 'vue3-toastify';
import { RouterLink } from 'vue-router';
import { useMessagesStore } from '@/stores/messages';
import { formatMessageTime, sortMessages } from '@/modules/chat/helpers';
import { classes } from '@/styles/utils';

const userStore = useUserStore();
const messagesStore = useMessagesStore();
let lastUnreadMessagesLength = 0;
const playAnimation = ref<boolean>(false);


watchEffect(() => {
  playAnimation.value = messagesStore.unreadMessages.length > lastUnreadMessagesLength; 
  lastUnreadMessagesLength = messagesStore.unreadMessages.length;
  setTimeout(() => {
    playAnimation.value = false;
  }, 1000);
});

const notifications = computed(() => {
  const unreadMessages = sortMessages(messagesStore.unreadMessages);
  const notificationsByChat = unreadMessages.reduce((acc, message) => {
    if (!acc[message.chatId]) {
      acc[message.chatId] = [];
    }
    if (acc[message.chatId].length > 4) return acc;
    acc[message.chatId].push(message);
    return acc;
  }, {} as Record<string, typeof messagesStore.unreadMessages>);
  return notificationsByChat;
});

onMounted(() => {
  userStore.updateProfileIfExists();
});

function logout() {
  userStore.logout().then(() => {
    toast.warn("You logged out");
  });
}


</script>

<template>
  <header :class=styles.header>
    <h1> <RouterLink to="/"> CMS</RouterLink></h1>
    <span :class="styles['header-left']" @click="" >
      <div class="hover-panel">
        <button :class='classes(styles.bell, playAnimation && styles.new)'>
          <BellIcon/>
        </button>
        <div class="panel">
          <ul v-if="Object.keys(notifications).length">
            <li v-for='chat in Object.keys(notifications)' :key=chat>
              <RouterLink :to="{ name: 'chat', params: { id: chat } }" >
              <h3>{{ notifications[chat][0].chatName }}</h3>
                <p v-for='notification in notifications[chat]' 
                  :key=notification.id 
                  :class=styles.notification
                >
                  <p :class=styles.preview>{{ notification.preview }}</p>
                  <span :class=styles.time>{{ formatMessageTime(notification.timestamp) }}</span>
                </p>
              </RouterLink>
            </li>
          </ul>
          <div v-else :style='{padding: "1rem"}'>No new messages</div>
        </div>
      </div>
      <div class="hover-panel">
        <div :class=styles.user>
          <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" height="34" width="34" />
          <RouterLink v-if=userStore.user to="/">{{ userStore.user.name }}</RouterLink>
          <RouterLink v-else to="/login">Log In</RouterLink>
        </div>
        <div :class='(styles.logout, "panel")' :style="{minWidth: '10rem'}">
          <ul>
            <li>
              <button @click=logout>Log Out</button>
            </li>
          </ul>
        </div>
      </div>
    </span>
  </header>
</template>
