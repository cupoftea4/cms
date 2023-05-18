<script setup lang="ts">
import useOnClickOutside from '@/composables/useOnClickOutside';
import { onMounted, ref } from 'vue';
import { emitCreateChat, emitGetChatsByName, emitGetUsersByName, emitJoinChat } from '../gateway';

import Avatar from '@/modules/chat/ui/Avatar.vue';

import styles from './NewChat.module.scss';
import { useUserStore } from '@/stores/user';
import { classes } from '@/styles/utils';

const { close, updateChats } = defineProps<{
  close: () => void;
  updateChats: () => void;
}>();

type FoundItem = {
  id: string | number;
  name: string;
  avatar?: string | null;
};

const dialogRef = useOnClickOutside(() => {(dialogRef.value as any)?.close();});
const createChat = ref(false);
const chatName = ref('');
const isPrivate = ref(false);
const foundItems = ref<FoundItem[]>([]);
const selectedItem = ref<FoundItem | null>(null);
const userStore = useUserStore();
  
let debounceTimer: number | null = null;


onMounted(() => {
  openDialog();
  emitGetChatsByName(null, setFoundItems);
})

const openDialog = () => {
  (dialogRef.value as any)?.showModal();
};

const debounceFunction = (callback: Function, time: number, ...args: any[]) => {
  clearTimeout(debounceTimer ?? undefined);
  debounceTimer = setTimeout(() => {
    console.log("Debounced", args);
    callback(...args);
  }, time);
};

function setFoundItems(data: FoundItem[]) {
  foundItems.value = data;
}

function getChatsByName() {
  let callback: Function | null = null;
  if (createChat.value) {
    if (isPrivate.value) {
      callback = emitGetUsersByName;
    } else {
      // find users to add to chat (for later)
    }
  } else if (!isPrivate.value) {
    callback = emitGetChatsByName;
  } 
  if (!callback) return;
  debounceFunction(callback, 500, chatName.value, setFoundItems);
}

function toggleCreateChat() {
  createChat.value = !createChat.value;
  foundItems.value = [];
  selectedItem.value = null;
  chatName.value = '';
  if (createChat.value) {
    isPrivate.value = true;
    emitGetUsersByName(null, setFoundItems);
  } else {
    isPrivate.value = false;
    emitGetChatsByName(null, setFoundItems);
  }
}

function onSubmitClick() {
  if (createChat.value) {
    if (!userStore.user) throw new Error('Create chat: Invalid authorized user.');
    if (isPrivate.value) {
      if (typeof selectedItem.value?.id !== 'number') 
        throw new Error('Create private chat: Expected number as id for user.');
      emitCreateChat({ 
        name: selectedItem.value.name, 
        isPrivate: true, 
        userIds: [userStore.user.id, selectedItem.value.id]
      }, updateChats);
    } else {
      if (chatName.value.length < 3) throw new Error('Create public chat: Chat name must be at least 3 characters.');
      emitCreateChat({ 
        name: chatName.value, 
        isPrivate: false, 
        userIds: [userStore.user.id]
      }, updateChats);
    }
  } else {
    if (typeof selectedItem.value?.id !== 'string') throw new Error('Join chat: Expected string as id for chat.');
    emitJoinChat(selectedItem.value.id, updateChats);
  }
  close();
}

function selectFoundItem(item: FoundItem) {
  if (selectedItem.value?.id === item.id) {
    selectedItem.value = null;
    return;
  }
  if (isPrivate.value && createChat.value) {
    chatName.value = item.name;
  }
  selectedItem.value = item;
}

</script>

<template>
  <dialog ref="dialogRef" :class=styles.root>
    <div :class=styles.modal>
      <h2>{{ createChat ? "Create new chat" : "Join group"}}</h2>
      <div v-if="createChat" :class=styles.toggle @click="isPrivate = !isPrivate; chatName = ''; foundItems = []">
        <button :class='isPrivate && styles.selected'>Private</button>
        <button :class='!isPrivate && styles.selected'>Public</button>
      </div>
      <div>
        <label for="chat-name">{{ !createChat ? "Find chat: " : isPrivate ? "Find user: " : "Chat name: "}}</label>
        <input type="text" 
          @input="getChatsByName" v-model="chatName" 
          :placeholder='isPrivate ? "e.g. John Doe" : "e.g. Some Group"'
        />
      </div>
      <ul :class="styles.found" v-if=foundItems.length>
        <li v-for="item in foundItems" :key="item.id" 
          :class="selectedItem?.id === item.id ? styles.selected : ''" 
          @click="selectFoundItem(item)" 
        >
          <Avatar :avatar='item.avatar ?? null' :size=50 />
          <div >
            {{ item.name }}
          </div>
        </li>
      </ul>
      <div :class="styles.found" v-else-if='createChat && !isPrivate'> Other users can join your chat later </div>
      <div :class="styles.found" v-else>Nothing found</div>
      <button :class='classes(styles.create, (selectedItem || (!isPrivate && createChat && chatName.length > 3)) && styles.active)' @click=onSubmitClick> {{ createChat ? "Create" : "Join" }} </button>
      <button :class=styles.cancel @click=close >Cancel</button><br/>
      <button @click="toggleCreateChat" :class=styles.mode> 
        {{ createChat ? "Find existing instead?" : "Create new instead?"}}
      </button>
    </div>
  </dialog>
</template>

<style scoped>

dialog {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: none;
  border-radius: .625rem;
}

</style>