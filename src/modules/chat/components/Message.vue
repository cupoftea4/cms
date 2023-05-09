<script setup lang="ts">
import { computed, ref, toRefs, watchEffect } from 'vue';
import { isFileAnImage, getBlobUrlFromFIle, isMyMessage, formatMessageTime } from '../helpers';
import type { ApiMessage, ClientMessage, ApiAttachment } from '@/shared/types';

import { classes } from '@/styles/utils';
import MultilineText from '@/shared/ui/MultilineText.vue';
import PendingIcon from '@/assets/PendingIcon.vue';

import styles from './Message.module.scss';
import { useUserStore } from '@/stores/user';


const props = defineProps<{
  message: ApiMessage; 
  state: ClientMessage['state'];
  showAvatar: boolean;
  showName: boolean;
}>();

const { message } = toRefs(props);
const userStore = useUserStore();

const isOwn = computed(() => isMyMessage(message.value, userStore.user));
const isMessageWithImagesOnly = computed(() => message.value.attachments && !message.value.attachments.map(isFileAnImage).includes(false));

let files = ref<ApiAttachment[]>(isMessageWithImagesOnly.value ? [] : message.value.attachments!);
watchEffect(async () => {
  files.value = isMessageWithImagesOnly && message.value.attachments?.length ? 
    await Promise.all(message.value.attachments!.map(async (file) => ({...file, url: file.url ?? await getBlobUrlFromFIle(file)}))) 
    : [];
});

</script>

<template>
  <img 
    v-if='showAvatar' 
    :src=message.sender.avatar :class=styles.avatar alt="avatar"
  >
  <div :class='classes(styles.content, isOwn && styles.sent)'>
    <span>
      <div v-if=message.replyTo :class=styles.reply>
          {{ message.replyTo && (message.replyTo?.preview) }}
      </div>
      <h3 v-if='showName'>{{ message.sender.name }}</h3>
      <MultilineText v-if=message.text :text=message.text />
      <div v-if='message.attachments && message.attachments.length > 0'>
        <div v-if='isMessageWithImagesOnly'>
          <img 
            v-for='image in message.attachments' 
            :src=image.data :class=styles.image alt="image"
          >
        </div>
        <div v-else>
          <a 
            v-for='file in files' 
            :href='file.url' :class=styles.file alt="file"
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