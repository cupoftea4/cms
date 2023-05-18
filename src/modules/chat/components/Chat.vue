<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs, VueElement, watchEffect } from 'vue';
import { classes } from '@/styles/utils';
import type { ApiAttachment, ApiChat, ApiMessage, ClientMessage } from '@/shared/types';

import { 
  emitCreateMessage, 
  emitGetMessages, 
  emitGetUnreadMessages, 
  emitReadChat, 
  subscribeToNewMessage, 
  subscribeToChatRead, 
  unsubscribeFromChatRead, 
  unsubscribeFromNewMessage, 
  subscribeToUpdatedMessage,
  subscribeToDeletedMessage,
  unsubscribeFromUpdatedMessage,
  unsubscribeFromDeletedMessage,
  emitDeleteMessage,
  emitUpdateMessage
} from '../gateway';

import useOnClickOutside from '@/composables/useOnClickOutside';
import { createMessage, isMyMessage, showAvatar, showName, sortMessagesByDate } from '../helpers';

import Avatar from '@/modules/chat/ui/Avatar.vue';
import SendIcon from '@/assets/SendIcon.vue';
import LoadingMessages from '../ui/LoadingMessages.vue';
import AttachmentButton from '../ui/AttachmentButton.vue';
import Message from './Message.vue';

import styles from './Chat.module.scss';
import { useUserStore } from '@/stores/user';
import { useMessagesStore } from '@/stores/messages';
import MessageContextMenu from '../ui/MessageContextMenu.vue';

const props = defineProps<{
  chat: ApiChat | undefined; 
  onMessage: (message: ApiMessage) => void;
}>();

const { chat } = toRefs(props);
const { onMessage } = props;

const messages = ref<ClientMessage[] | null>(null);
const currentMessage = ref<{text: string, files: File[]}>({text: '', files: []});
const replyTo = ref<ApiMessage | null>(null);
const editing = ref<ApiMessage | null>(null);
const messagesByDate = computed(() => sortMessagesByDate(messages.value));
const messagesElement = ref<HTMLElement | null>(null);
const showDragOver = ref(false);
const contextMenuMessageId = ref<string | null>(null);
const contextMenuPosition = ref<{x: number, y: number} | null>(null);
const userStore = useUserStore();
const messagesStore = useMessagesStore();

const menuRef = useOnClickOutside(() => console.log("click outside"));

onMounted(() => {
  if (!chat.value) return;
  subscribeToNewMessage('new', (message, chatId) => {
    if (chatId !== chat.value?.id) return;
    console.log('new message', message, chatId);
    emitReadChat(chat.value!.id);
    messages.value!.unshift({...message, state: message.isRead ? 'read' : 'sent'});
    messagesElement.value?.scrollTo(0, 0);
  });
  subscribeToChatRead('chat', (chatId) => {
    if (chatId !== chat.value?.id) return;
    messages.value?.forEach(m => m.state = 'read');
  });
  subscribeToUpdatedMessage('updated', (message: ApiMessage, chatId: string) => {
    if (chatId !== chat.value?.id) return;
    editMessage(message);
  })
  subscribeToDeletedMessage('deleted', (message: ApiMessage, chatId: string) => {
    if (chatId !== chat.value?.id) return;
    deleteMessage(message.id);
  })
});

onUnmounted(() => {
  unsubscribeFromNewMessage('new');
  unsubscribeFromUpdatedMessage('updated');
  unsubscribeFromDeletedMessage('deleted');
  unsubscribeFromChatRead('chat');
});

function deleteMessage(messageId: string) {
  messages.value = messages.value!.filter(m => m.id !== messageId);
}

function editMessage(message: ApiMessage) {
  const messageIndex = messages.value!.findIndex(m => m.id === message.id);
  messages.value![messageIndex] = message;
}

watchEffect(() => {
  if (!chat.value) return;
  messages.value = null;
  emitReadChat(chat.value.id, 
    (isRead) => isRead && emitGetUnreadMessages(data => messagesStore.unreadMessages = data)
  );
  emitGetMessages(chat.value.id, data => {
      messages.value = data.map((message) => ({...message, state: message.isRead ? 'read' : 'sent'}));
    }); 
});

function sendMessage() {
  if (!messages.value || (!currentMessage.value.text.trim() && !currentMessage.value.files.length)) {
    return;
  }

  if (editing.value) {
    const newMessage = {...editing.value, text: currentMessage.value.text}; 
    emitUpdateMessage(newMessage, chat.value!.id, (isUpdated: boolean) => isUpdated && editMessage(newMessage));
    editing.value = null;
    currentMessage.value.text = '';
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

  const msg: ApiMessage = createMessage(
    currentMessage.value, 
    replyTo.value, 
    userStore.user, 
    renderFile,
    (msg: ApiMessage) => emitCreateMessage(msg, chat.value!.id, updateMessage)
  );
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

function jumpToMessage(id: string) {
  const messageElement = messagesElement.value?.querySelector(`[data-id="${id}"]`);
  if (!messageElement) return;
  messageElement.classList.add(styles.highlight);
  setTimeout(() => messageElement.classList.remove(styles.highlight), 2000);
  messageElement.scrollIntoView({behavior: 'smooth', block: 'center'});
}

function jumpToDate(date: string) {
  const message = messagesByDate.value[date]?.[0];
  if (!message) return;
  jumpToMessage(message.id);
}

function dragOver() {
  showDragOver.value = true;
}

function showContextMenu(event: MouseEvent, messageId: string) {
  const messageElement = messagesElement.value?.querySelector(`[data-id="${messageId}"]`);
  if (!messageElement) return;
  const messageRect = messageElement.getBoundingClientRect();
  const message = messages.value?.find(m => m.id === messageId);
  if (!message) return;
  const messagesRect = messagesElement.value!.getBoundingClientRect();
  const bottomPosition = messagesRect.top + messagesRect.height;
  const rightPosition = messagesRect.left + messagesRect.width;
  let yModifier = 0, xModifier = 0;
  if (bottomPosition - event.clientY < 100) yModifier = 100;
  if (rightPosition - event.clientX < 100) xModifier = 90; 
  contextMenuPosition.value = {x: event.clientX - messageRect.left - xModifier, y: event.clientY - messageRect.top - yModifier};
  contextMenuMessageId.value = messageId;
}
</script>

<template>
  <div v-if=chat :class=styles.chat>
    <div :class=styles.cheddar>
      <Avatar :avatar='chat.avatar ?? null' :size=50 />
      <div>
        <h2 :class=styles.name>{{ chat.name }}</h2>
        <span :class=styles.sub>{{ chat.isPrivate ? "private" : "public" }}</span>
      </div>
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
            <span @click=jumpToDate(date)>
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
            :data-id=message.id
            @dblclick="replyTo = message"
            @contextmenu.prevent.stop='e => showContextMenu(e, message.id)'
          > 
            <Message :key='message.id + message.text'
              :message=message 
              :state='message.state ?? "sent"'
              :isChatPrivate=chat.isPrivate
              :showAvatar='showAvatar(Object.values(messagesByDate).flat(1), index, chat.isPrivate, userStore.user)' 
              :showName='showName(Object.values(messagesByDate).flat(1), index, chat.isPrivate, userStore.user)' 
              :jumpToMessage=jumpToMessage
            >  
            </Message>
            <MessageContextMenu 
              v-if='contextMenuMessageId === message.id' 
              :menuRef="menuRef"
              :position='contextMenuPosition'
              :isOwn='isMyMessage(message, userStore.user)'
              :onReply="() => {replyTo = message; contextMenuMessageId = null;}"
              :onEdit="() => {editing = message; currentMessage.text = message.text ?? ''; contextMenuMessageId = null;}"
              :onDelete='() => {emitDeleteMessage(message, chat!.id, (isDeleted: boolean) => isDeleted && deleteMessage(message.id)); contextMenuMessageId = null;}'
            />
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
        <div v-if='messages && editing' :class='styles.details'> 
          <span :class=styles.info v-if=editing>
            Editing:
            <span :class='styles.message'>
              <p>{{ editing.text }}</p>            
            </span> 
          </span>
          <button :class=styles.close @click='editing = null'><span>x</span></button>
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