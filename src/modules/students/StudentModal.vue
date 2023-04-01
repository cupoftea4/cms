<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import styles from './StudentModal.module.scss';
import type { Student, FormStudent, StudentModalMode, Group } from '@/shared/types';
import { getGroups } from './api';


const { onAdd, onEdit, close, studentToEdit, mode} = defineProps<{
  onEdit: (student: FormStudent, id: number) => void;
  onAdd: (student: FormStudent) => void;
  close: () => void;
  studentToEdit: Student | null;
  mode: StudentModalMode;
}>();
   
const groups = ref<Group[]>([]);
const student = ref<FormStudent>({ 
    groupId: 1, 
    name: studentToEdit?.name ?? "", 
    surname: studentToEdit?.surname ?? "",
    gender: studentToEdit?.gender ?? "M", 
    birthday: studentToEdit?.birthday ?? ""
});

onMounted(async () => {
  groups.value = await getGroups();
});

watch(groups, () => {
  student.value.groupId = (studentToEdit && groups.value.find((group) => group.name === studentToEdit.group)?.id) ?? 1;
});

const submit = () => {
  if (mode === "create") onAdd(student.value);
  else onEdit(student.value, studentToEdit!.id);
};

const checkInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.validity.valid) {    
    input.classList.remove(styles.invalid);
  } else input.classList.add(styles.invalid);
};

</script>

<template>
  <div :class='styles["modal-wrapper"]'>
    <div :class=styles.modal>
      <h2>
        {{ mode === "edit" ? "Edit" : "Create" }} student
      </h2>
      <form @submit.stop.prevent=submit>
        <input type='hidden' :value='studentToEdit?.id ?? ""'>
        <div :class=styles.line>
          <label for="group">Group</label>
          <select @blur=checkInput name="group" v-model=student.groupId required>
            <option value="" disabled hidden selected>- Select group -</option>
            <option v-for='group in groups' :key=group.id :value=group.id>{{ group.name }}</option>
          </select>
        </div>
        <div :class=styles.line >
          <label for="name" >First Name</label>
          <input @blur=checkInput v-model=student.name 
            type="text" name="name" 
            minlength="3" maxlength="16" pattern="[^0-9]*" required >
        </div>
        <div :class=styles.line>
          <label for="surname">Last Name</label>
          <input @blur=checkInput v-model=student.surname 
            type="text" name="surname" 
            minlength="3" maxlength="16" pattern="[^0-9]*" required>
        </div>
        <div :class=styles.line>
          <label for="gender">Gender</label>
          <select name="gender" v-model=student.gender>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="B">Bender</option>
          </select>
        </div>
        <div :class=styles.line>
          <label for="birthday">Birthday</label>
          <input @blur=checkInput type="date" name="birthday" v-model=student.birthday required>
        </div>
        <input type="submit" value="OK"/>
        <button class="btn-close" @click=close>Close</button>
      </form>
    </div>
  </div>
</template>
