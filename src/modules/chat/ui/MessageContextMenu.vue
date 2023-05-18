<script setup lang="ts">


const { position, isOwn, onReply, menuRef, onDelete, onEdit } = defineProps<{
  position: { x: number; y: number } | null;
  isOwn: boolean;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  menuRef?: any
}>();


const reply = () => {
  console.log('Reply');
  onReply();
  // Reply logic here
};

const edit = () => {
  console.log('Edit');
  onEdit();
  // Edit logic here
};

const remove = () => {
  console.log('Remove');
  onDelete();
  // Remove logic here
};
</script>

<template>
  <div v-if="position" ref="menuRef" class="context-menu" :style="{ left: position.x + 'px', top: position.y + 'px' }">
    <div  class="menu">
      <button @click="reply">Reply</button>
      <button v-if=isOwn @click="edit">Edit</button>
      <button v-if=isOwn @click="remove">Remove</button>
    </div>
  </div>
</template>

<style>
.context-menu {
  position: absolute;
  z-index: 999;
}

.menu {
  top: 100%;
  left: 0;
  background-color: #1d1c1c;
  border: 1px solid #ccc;
  border-radius: .325rem;
  z-index: 999;
}

.menu button {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;
  border: none;
  background-color: transparent;
  color: #fff;
  text-align: left;
}

.menu button:last-child {
  border-radius: 0 0 .325rem .325rem;
}

.menu button:first-child {
  border-radius: .325rem .325rem 0 0;
}

.menu button:hover {
  display: block;
  background-color: #3e3d3d;
}
</style>