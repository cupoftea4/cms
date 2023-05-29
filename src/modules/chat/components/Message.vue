<script setup lang="ts">
import { computed, ref, toRefs, watchEffect } from 'vue';
import { isFileAnImage, getBlobUrlFromFIle, isMyMessage, formatMessageTime } from '../helpers';
import type { ApiMessage, ClientMessage, ApiAttachment } from '@/shared/types';

import { classes } from '@/styles/utils';
import MultilineText from '@/shared/ui/MultilineText.vue';
import PendingIcon from '@/assets/PendingIcon.vue';

import styles from './Message.module.scss';
import { useUserStore } from '@/stores/user';
import Avatar from '../ui/Avatar.vue';
import { CHAT_SERVER_ORIGIN } from '@/shared/constants';


const props = defineProps<{
  message: ApiMessage; 
  state: ClientMessage['state'];
  isChatPrivate: boolean;
  showAvatar: boolean;
  showName: boolean;
  jumpToMessage: (messageId: string) => void;
}>();

const { message } = toRefs(props);
const userStore = useUserStore();

const isOwn = computed(() => isMyMessage(message.value, userStore.user));
const isMessageWithImagesOnly = computed(() => message.value.attachments && !message.value.attachments.map(isFileAnImage).includes(false));

let files = ref<ApiAttachment[]>(isMessageWithImagesOnly.value ? [] : message.value.attachments!);
watchEffect(async () => {
  files.value = isMessageWithImagesOnly && message.value.attachments?.length ? 
    await Promise.all(message.value.attachments!.map(async (file) => ({...file, path: (file?.path && `${CHAT_SERVER_ORIGIN}/${file.path}`) ?? await getBlobUrlFromFIle(file)}))) 
    : [];
});

</script>

<template>
  <Avatar v-if="showAvatar" :avatar=message.sender.avatar :size=50  :class='styles.avatar'/>
  <div :class='classes(styles.content, isOwn && styles.sent, (!showAvatar && !isChatPrivate) && styles["no-avatar"])'>
    <span>
      <h3 v-if='showName'>{{ message.sender.name }}</h3>
      <div v-if=message.replyTo :class=styles.reply @click=jumpToMessage(message.replyTo.id)>
          {{ message.replyTo && (message.replyTo?.preview) }}
      </div>
      <MultilineText v-if=message.text :text=message.text />
      <div v-if='message.attachments && message.attachments.length > 0'>
        <div v-if='isMessageWithImagesOnly'>
          <img 
            v-for='image in message.attachments' 
            :src='image?.data ?? `${CHAT_SERVER_ORIGIN}/${image.path}`' :class=styles.image alt="image"
          >
        </div>
        <div v-else>
          <a 
            v-for='file in files' 
            :href='file.path' :class=styles.file alt="file"
            :download=file.name
          >
            {{ file.name }}
          </a>
        </div>
      </div>
    </span>
    <span :class=styles.time>{{ formatMessageTime(message.timestamp) }}</span>

    <span v-if='isOwn && state === "pending"' :class=styles.status>
      <PendingIcon />
    </span>
    <span v-else-if='isOwn && state === "sent"' :class='classes(styles.status, styles.sent)'>✓</span>
    <span v-else-if='isOwn && state === "read"' :class='classes(styles.status, styles.read)'>✓✓</span>
    <span v-else-if='isOwn && state === "failed"' :class='classes(styles.status, styles.failed)'>x</span>
  </div>
</template>

<style scoped>

</style>
   