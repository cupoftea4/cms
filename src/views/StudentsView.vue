<script lang="ts" setup>

import { onMounted, ref, onErrorCaptured} from 'vue';
import { getStudents, createStudent } from '@/modules/students/api';
import type { Student, FormStudent, StudentModalMode } from '@/shared/types';
import StudentsTable from '@/modules/students/StudentsTable.vue';
import StudentModal from '@/modules/students/StudentModal.vue';
import styles from './Students.module.scss';
import { toast } from 'vue3-toastify';

type LoadingStatus = 'loading' | 'success' | 'error';

const students = ref<Student[]>([]);

const showModal = ref(false);
const modalMode = ref<StudentModalMode>('create');
const studentToEdit = ref<Student | null>(null);
const status = ref<LoadingStatus>('loading'); 

onMounted(setStudents);

function handleStudentError(error?: any) {
  if (typeof error === 'string') {
    toast.error(error ?? 'Something went wrong');
  }
  status.value = 'error';
  console.log("ERROR caught: ", error);
}

function setStudents() {
  getStudents()
    .then(res => students.value = res)
    .then(() => status.value = 'success')
    .catch(handleStudentError);
}

const openModal = (mode: StudentModalMode) => {
  if (mode === 'create') studentToEdit.value = null;
  modalMode.value = mode;
  showModal.value = true;
}
const closeModal = () => {
  status.value = 'success';
  showModal.value = false;
}

const onEditStudent = (id: string) => {
  studentToEdit.value = students.value.find(s => s.id === id) ?? null;
  openModal('edit');
}

const editStudent = (student: FormStudent, id: string) => {
  students.value = students.value.map(s => s.id === id ? {...s, ...student} : s);
  closeModal();
}

const addStudent = async (student: FormStudent) => {
  try {
    await createStudent(student);
    students.value.push({...student, id: Math.random().toString(36).slice(2), status: 'inactive'});
    closeModal();
    status.value = 'success';
  } catch (error) {
    handleStudentError(error);
  }
}

const removeStudent = (id: string) => {
  students.value = students.value.filter(student => student.id !== id);
}

</script>

<template>
  <section :class=styles.students>
    <div :class=styles.top>
      <h2>Students</h2> 
      <button @click='openModal("create")' :class='styles["add-student__button"]'>+</button>
    </div>
    <div v-if='status === "loading"' >Loading...</div>
    <StudentsTable v-else :onEdit=onEditStudent :onDelete=removeStudent :students=students />
  </section>
  <StudentModal 
    v-if=showModal
    :studentToEdit=studentToEdit  
    :close=closeModal 
    :onAdd=addStudent 
    :onEdit=editStudent
    :mode=modalMode 
  />
  <div v-if='status === "error"' :class=styles.error>Server error ocurred</div>
</template>