<script setup lang="ts">
import { computed, reactive, ref, toRefs, watchEffect } from 'vue';
import PendingIcon from '@/assets/PendingIcon.vue';
import MultilineText from '@/shared/ui/MultilineText.vue';
import { isFileAnImage, getBlobUrlFromFIle, isMyMessage, formatMessageTime } from './helpers';
import { classes } from '@/styles/utils';

import type { ApiMessage, ClientMessage, ApiAttachment } from '@/shared/types';
import styles from './Message.module.scss';


const props = defineProps<{
  message: ApiMessage; 
  state: ClientMessage['state'];
  showAvatar: boolean;
  showName: boolean;
}>();

const { message } = toRefs(props);

const isOwn = computed(() => isMyMessage(message.value));
const isMessageWithImagesOnly = computed(() => message.value.files && !message.value.files.map(isFileAnImage).includes(false));

let files = ref<ApiAttachment[]>(isMessageWithImagesOnly.value ? [] : message.value.files!);
watchEffect(async () => {
  files.value = isMessageWithImagesOnly && message.value.files?.length ? 
    await Promise.all(message.value.files!.map(async (file) => ({...file, url: file.url ?? await getBlobUrlFromFIle(file)}))) 
    : [];
});

</script>

<template>
  <img 
    v-if='showAvatar' 
    :src=message.author.avatar :class=styles.avatar alt="avatar"
  >
  <div :class='classes(styles.content, isOwn && styles.sent)'>
    <span>
      <div v-if=message.replyTo :class=styles.reply>
          {{ message.replyTo.text ? message.replyTo.text : message.replyTo.files![0]?.name }}
      </div>
      <h3 v-if='showName'>{{ message.author.name }}</h3>
      <MultilineText v-if=message.text :text=message.text />
      <div v-if='message.files && message.files.length > 0'>
        <div v-if='isMessageWithImagesOnly'>
          <img 
            v-for='image in message.files' 
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