<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watchEffect } from 'vue';
import { classes } from '@/styles/utils';
import type { ApiAttachment, ApiChat, ApiMessage, ClientMessage } from '@/shared/types';

import { emitCreateMessage, emitGetMessages, onNewMessage } from '../gateway';
import { createMessage, isMyMessage, showAvatar, showName, sortMessagesByDate } from '../helpers';

import Avatar from '@/modules/chat/ui/Avatar.vue';
import SendIcon from '@/assets/SendIcon.vue';
import LoadingMessages from '../ui/LoadingMessages.vue';
import AttachmentButton from './AttachmentButton.vue';
import Message from './Message.vue';

import styles from './Chat.module.scss';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
  chat: ApiChat | undefined; 
  onMessage: (message: ApiMessage) => void;
}>();

const { chat } = toRefs(props);
const { onMessage } = props;

const messages = ref<ClientMessage[] | null>(null);
const currentMessage = ref<{text: string, files: File[]}>({text: '', files: []});
const replyTo = ref<ApiMessage | null>(null);
const messagesByDate = computed(() => sortMessagesByDate(messages.value));
const messagesElement = ref<HTMLElement | null>(null);
const showDragOver = ref(false);
const userStore = useUserStore();

onMounted(() => {
  if (!chat.value) return;
  onNewMessage(chat.value.id, (message) => {
    console.log('new message in Chat', message);
    messages.value!.unshift({...message, state: message.isRead ? 'read' : 'sent'});
    messagesElement.value?.scrollTo(0, 0);
  });
});

watchEffect(() => {
  console.log("Watch messages", messages.value);
})

watchEffect(() => {
  if (!chat.value) return;
  messages.value = null;
  emitGetMessages(
    chat.value.id, 
    data => {
      // setTimeout(() => messages.value = data.map((message) => ({...message, state: message.isRead ? 'read' : 'sent'})), 2000);
      messages.value = data.map((message) => ({...message, state: message.isRead ? 'read' : 'sent'}));
    }
  ); 
});

function sendMessage() {
  if (!messages.value || (!currentMessage.value.text.trim() && !currentMessage.value.files.length)) {
    return;
  }

  const renderFile = (file: ApiAttachment, id: string): void => {
    const message = messages.value!.find(m => m.id === id);
    if (!message) return;
    message.attachments!.push(file);
  };

  const updateMessage = (data: ApiMessage): void => {
    const message = messages.value!.find(m => m.id === msg.id)!;
    if (!message) return;
    message.state = 'sent';
    message.id = data.id;
    message.timestamp = data.timestamp;
    onMessage(data);
  };

  const msg: ApiMessage = createMessage(currentMessage.value, replyTo.value, userStore.user, renderFile);
  emitCreateMessage(msg, chat.value!.id, updateMessage);
  messages.value.unshift(msg);

  replyTo.value = null;
  currentMessage.value.text = '';
  currentMessage.value.files = [];
  messagesElement.value?.scrollTo(0, 0);
}

function handleImageUpload(file: File) {
  currentMessage.value.files.push(file);
}

function onInput(event: KeyboardEvent) {
  if (event.key === 'Enter' && event.shiftKey === false) {
    event.preventDefault();
    sendMessage();
  }
}

function addFile(event: DragEvent) {
  showDragOver.value = false;
  if (!event.dataTransfer) return;
  const file = event.dataTransfer.files[0];
  if (!file) return;
  currentMessage.value.files.push(file);
}

function dragOver() {
  showDragOver.value = true;
}
</script>

<template>
  <div v-if=chat :class=styles.chat>
    <div :class=styles.cheddar>
      <Avatar :avatar='chat.avatar ?? null' :size=50 />
      <h2 :class=styles.name>{{ chat.name }}</h2>
    </div>
    <div :class=styles.container>
      <div ref="messagesElement" 
        v-if=messages 
        :class=styles.messages 
        @mouseout="showDragOver = false" 
        @drop.prevent="addFile" 
        @dragover.prevent="dragOver"
      >
        <div v-if="showDragOver" :class=styles.dragover>
          <span>Drop file to send</span>
        </div>
        <div v-for="date in Object.keys(messagesByDate)" :key=date :class='styles["by-date"]'>
          <div style="position: sticky; " :class="styles.date" >
            <span>
              {{ date }} 
            </span>
          </div>
          <div  v-for='(message, index) in messagesByDate[date]' 
            :class='classes(
              styles.message, 
              isMyMessage(message, userStore.user) && styles.sent, 
              styles.animate, 
              message.state === "failed" && styles.failed
            )' 
            @dblclick="replyTo = message"
          > 
            <Message :key=message.id 
              :message=message 
              :state='message.state ?? "sent"'
              :showAvatar='showAvatar(messages, index, chat.isPrivate, userStore.user)' 
              :showName='showName(message, chat.isPrivate, userStore.user)' 
            >  
            </Message>
          </div>
        </div>
      </div>
      <div v-else :class=styles.messages>
        <LoadingMessages />
      </div>  

      <div :class=styles.chooter>
        <div :class=styles.input>
          <AttachmentButton @fileUpload='handleImageUpload'/>
          <textarea :class=styles.text 
            @keydown=onInput v-model=currentMessage.text 
            type="text" placeholder="Type your message here...">
          </textarea>
          <button :class=styles.send @click=sendMessage()><SendIcon/></button>
        </div>
        <div v-if='messages && (replyTo)' :class='styles.details'> 
          <span :class=styles.info v-if=replyTo>
            Reply to:
            <span :class='styles.message'>
              {{ replyTo.sender.name }}
              <p>{{ replyTo.text }}</p>            
            </span> 
          </span>
          <button :class=styles.close @click='replyTo = null'><span>x</span></button>
        </div>
        <div v-if='messages && (currentMessage.files.length)' :class='styles.details'> 
          <span :class=styles.info v-if='currentMessage.files.length > 0'>
            File:
            <span :class='styles.message'>
              {{ currentMessage.files.map(file => file.name).join(', ')}}
            </span>
          </span>
          <button :class=styles.close @click='currentMessage.files = []'><span>x</span></button>
        </div>
      </div>
    </div>
  </div>
</template>