<script setup lang="ts">
import AttachmentIcon from '@/assets/AttachmentIcon.vue';
import { ref } from 'vue';
const emit = defineEmits<{
  (e: 'fileUpload', file: File): void
}>()

const fileNames = ref<string[]>([])
let files: FileList | null = null;

const onFileChange = (event: Event) => {
  files = event.target ? (event.target as HTMLInputElement).files : null;
  fileNames.value = files ? [...files].map(file => file.name) : []
  console.log(files)
  emit('fileUpload', files![0]);
}
</script>

<template>
  <div class="file-upload">
    <label class="file-input-label">
      <input type="file" @change="onFileChange" />
      <AttachmentIcon />
    </label>
  </div>
</template>



<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: .25rem;
  cursor: pointer;
}

svg {
  cursor: pointer;
}

.file-input-label {
  display: flex;
  align-items: center;
}

.file-input-label input {
  display: none;
  cursor: pointer;
}

/* .file-input-label span {
  margin-left: 8px;
  font-size: 14px;
} */
</style>