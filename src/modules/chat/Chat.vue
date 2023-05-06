<script setup lang="ts">
import type { ApiAttachment, ApiChat, ApiMessage, ClientMessage } from '@/shared/types';
import { classes } from '@/styles/utils';
import { computed, onMounted, ref, toRefs } from 'vue';
import { getMessagesByChatId } from './api';
import { showAvatar, showName, isMyMessage, sortMessagesByDate, createMessage } from './helpers';
import styles from './Chat.module.scss'
import LoadingMessages from './LoadingMessages.vue';
import AttachmentButton from './AttachmentButton.vue';
import SendIcon from '@/assets/SendIcon.vue';
import Message from './Message.vue';

const props = defineProps<{
  chat: ApiChat | undefined; 
}>();

const { chat } = toRefs(props);

const messages = ref<ClientMessage[] | null>(null);
const currentMessage = ref<{text: string, files: File[]}>({text: '', files: []});
const replyTo = ref<ApiMessage | null>(null);
const messagesByDate = computed(() => sortMessagesByDate(messages.value));
const messagesElement = ref<HTMLElement | null>(null);
const showDragOver = ref(false);

onMounted(() => {
  if (!chat.value) return;
  getMessagesByChatId(chat.value.id).then(data => {
    console.log(data);
    messages.value = data.map((message) => ({...message, state: message.isRead ? 'read' : 'sent'}));
  });
});

function sendMessage() {
  if (!messages.value || (!currentMessage.value.text.trim() && !currentMessage.value.files.length)) return;  
  const renderFile = (file: ApiAttachment, id: number) => messages.value!.find((m) => m.id === id)!.files!.push(file);
  const msg = createMessage(currentMessage.value, replyTo.value, renderFile);
  messages.value.unshift(msg);
  setTimeout(() => {
      if (!messages.value) return;
      messages.value.find((m) => m.id === msg.id)!.state = 'sent';
    }, 2000);
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

function dragOver(event: DragEvent) {
  showDragOver.value = true;
}
</script>

<template>
  <div v-if=chat :class=styles.chat>
    <div :class=styles.cheddar>
      <img :src=chat.avatar alt="avatar" :class=styles.avatar>
      <h2 :class=styles.name>{{ chat.name }}</h2>
    </div>
    <div :class=styles.container>
      <div ref="messagesElement" :class=styles.messages @mouseout="showDragOver = false" v-if=messages @drop.prevent="addFile" @dragover.prevent="dragOver">
        <div v-if="showDragOver" :class=styles.dragover>
          <span>Drop file to send</span>
        </div>
        <div v-for="date in Object.keys(messagesByDate)" :key=date :class='styles["by-date"]'>
          <div style="position: sticky; " :class="styles.date" >
            <span>
              {{ date }} 
            </span>
          </div>
          <div  v-for='(message, index) in messagesByDate[date]' :key=message.id 
            :class='classes(styles.message, isMyMessage(message) && styles.sent, message.state === "failed" && styles.failed)' 
            @dblclick="replyTo = message"
          > 
            <Message 
              :message=message 
              :state='message.state ?? "sent"'
              :showAvatar='showAvatar(messages, index, chat.isPrivate)' 
              :showName='showName(message, chat.isPrivate)' 
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
              {{ replyTo.author.name }}
              <p>{{ replyTo.text ? replyTo.text : replyTo.files && replyTo.files[0].name }}</p>            
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
