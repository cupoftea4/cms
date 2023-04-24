<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import { getStudents, createStudent, updateStudent, deleteStudent } from '@/modules/students/api';
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
const page = ref(1);
const pagesCount = ref(1);

onMounted(setStudents);

function handleStudentError(error?: any) {
  if (typeof error.message === 'string') {
    toast.error(error.message ?? 'Something went wrong');
  }
  status.value = 'error';
  console.log("ERROR caught: ", error);
}

function setStudents() {
  getStudents()
    .then(res => {
      students.value = res.data;
      page.value = res.meta.current_page;
      pagesCount.value = res.meta.last_page;
      status.value = 'success';
    })
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

const onEditStudent = (id: number) => {
  studentToEdit.value = students.value.find(s => s.id === id) ?? null;
  openModal('edit');
}

const editStudent = async (student: FormStudent, id: number) => {
  try {
    await updateStudent(id, student);
    students.value = students.value.map(s => s.id === id ? {...s, ...student} : s);
    closeModal();
    status.value = 'success';
  } catch (error) {
    handleStudentError(error);
  }
}

const addStudent = async (student: FormStudent) => {
  try {
    const createdStudent = await createStudent(student);
    console.log("createdStudent: ", createdStudent);
    
    students.value.push(createdStudent);
    closeModal();
    status.value = 'success';
    goToPage(pagesCount.value);
  } catch (error) {
    handleStudentError(error);
  }
}

const removeStudent = async (id: number) => {
  try {
    await deleteStudent(id);
    students.value = students.value.filter(student => student.id !== id);
    status.value = 'success';
  } catch (error) {
    handleStudentError(error);
  }
}

const goToPage = (pageNumber: number) => {
  status.value = 'loading';
  getStudents(pageNumber)
    .then(res => {
      students.value = res.data;
      page.value = res.meta.current_page;
      pagesCount.value = res.meta.last_page;
      status.value = 'success';
    })
  .catch(handleStudentError);
}

</script>

<template>
  <section :class=styles.students>
    <div :class=styles.top>
      <h2>Students</h2> 
      <button @click='openModal("create")' :class='styles["add-student__button"]'>+</button>
    </div>
    <div v-if='status === "loading"' >Loading...</div>
    <StudentsTable v-else 
      :onEdit=onEditStudent 
      :onDelete=removeStudent 
      :students=students
      :pagesCount=pagesCount
      :page=page
      :onPageChange=goToPage
    />
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