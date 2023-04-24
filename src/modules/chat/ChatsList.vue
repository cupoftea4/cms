<script setup lang="ts">


const chats = [
  {
    id: 1,
    name: 'Nick Dunn',
  },
  {
    id: 2,
    name: 'Katie Smith',
  },
  {
    id: 3,
    name: 'Bestie',
  },
];


</script>

<template>
  <div>
    <ol>
      <li v-for="chat in chats" :key="chat.id" class="chat-li">
        <router-link :to="{ name: 'chat', params: { id: chat.id } }">
          {{ chat.name }}
        </router-link>
      </li>
    </ol>
  </div>
</template>

<style scoped>

.chat-li {
  list-style: none;
  padding: .75rem 1rem;
  background-color: hsla(0, 0%, 50%, 0.5);
  display: block;
  border-radius: .625rem;
}

.chat-li:hover {
  background-color: hsla(0, 0%, 50%, 0.7);
  cursor: pointer;
}

</style>