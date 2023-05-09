<script setup lang="ts">
import useOnClickOutside from '@/composables/useOnClickOutside';
import { onMounted, ref } from 'vue';
import { emitGetChatsByName, emitGetUsersByName } from '../gateway';

import styles from './NewChat.module.scss';

type FoundItem = {
  name: string;
  _id: string;
};

const dialogRef = useOnClickOutside(() => {(dialogRef.value as any)?.close();});
const createChat = ref(false);
const chatName = ref('');
const isPrivate = ref(false);
const foundItems = ref<FoundItem[]>([]);
const selectedItem = ref<FoundItem | null>(null);
  
let debounceTimer: number | null = null;


onMounted(() => {
  openDialog();
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
  debounceFunction(callback, 1000, chatName.value, (data: FoundItem[]) => {
    foundItems.value = data;
  });
}

</script>

<template>
  <dialog ref="dialogRef">
    <div class="modal">
      <h2>{{ createChat ? "Create new chat" : "Join group"}}</h2>
      <div v-if="createChat">
        <button @click="isPrivate = true; foundItems = []">Private</button>
        <button @click="isPrivate = false; foundItems = []">Public</button>
      </div>
      <div>
        <label for="chat-name">{{ createChat ? "Chat name: " : isPrivate ? "Find user: " : "Find chat: "}}</label>
        <input type="text" @input="getChatsByName" v-model="chatName"/>
      </div>
      <ul :class="styles.found">
        <li v-for="item in foundItems" >
          <div :class="selectedItem?._id === item._id ? styles.selected : ''" @click="selectedItem = item" :key="item._id">
            {{ item.name }}
          </div>
        </li>
      </ul>
      <button> {{ createChat ? "Create" : "Join" }} </button>
      <button @click="(dialogRef as any)?.close()">Cancel</button>
      <button @click="createChat = false; foundItems = []" v-if=createChat>Find existing instead?</button>
      <button @click="createChat = true; foundItems = []" v-else>Create new instead?</button>
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

.modal {
  padding: 1rem;
}

ul {
  margin: .5rem;
}



</style>