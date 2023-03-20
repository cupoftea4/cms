<script lang="ts" setup>

import { ref } from 'vue';
import StudentsTable from '@/modules/students/StudentsTable.vue';
import StudentModal from '@/modules/students/StudentModal.vue';
import styles from './Students.module.scss';
import type { Student, FormStudent, StudentModalMode } from '@/shared/types';

const students = ref<Student[]>([
  {
    id: "1",
    group: "PZ-22",
    name: "John",
    surname: "Doe",
    gender: "M",
    birthDate: "1999-03-01",
    status: "active"
  },
  {
    id: "2",
    group: "PZ-21",
    name: "Jane",
    surname: "Doe",
    gender: "F",
    birthDate: "1999-03-01",
    status: "inactive"
  }
]);

const showModal = ref(false);
const modalMode = ref<StudentModalMode>("create");
const studentToEdit = ref<Student | null>(null);

const openModal = (mode: StudentModalMode) => {
  if (mode === "create") studentToEdit.value = null;
  modalMode.value = mode;
  showModal.value = true;
}
const closeModal = () => showModal.value = false;

const onEditStudent = (id: string) => {
  studentToEdit.value = students.value.find(s => s.id === id) ?? null;
  openModal("edit");
}

const editStudent = (student: FormStudent, id: string) => {
  students.value = students.value.map(s => s.id === id ? {...s, ...student} : s);
}

const addStudent = (student: FormStudent) => {
  students.value.push({...student, id: Math.random().toString(36), status: "inactive"});
}

const deleteStudent = (id: string) => {
  students.value = students.value.filter(student => student.id !== id);
}

</script>

<template>
  <section :class=styles.students>
    <div :class=styles.top>
      <h2>Students</h2> 
      <button @click='openModal("create")' :class='styles["add-student__button"]'>+</button>
    </div>
    <StudentsTable :onEdit=onEditStudent :onDelete=deleteStudent :students=students />
  </section>
  <StudentModal 
    v-if=showModal
    :studentToEdit=studentToEdit  
    :close=closeModal 
    :onAdd=addStudent 
    :onEdit=editStudent
    :mode=modalMode 
  />
</template>