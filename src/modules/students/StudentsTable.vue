<script setup lang="ts">

import styles from "./StudentsTable.module.scss";
import { classes } from "@/styles/utils";
import type { Student } from "@/shared/types";
import EditIcon from "@/assets/EditIcon.vue";
import RemoveIcon from "@/assets/RemoveIcon.vue"; 

const { students, onEdit, onDelete, pagesCount, page, onPageChange } = defineProps<{
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  students: Student[];
  pagesCount: number;
  page: number;
}>();

</script>

<template>    
    <div :class='styles["table-wrapper"]'>
      <table :class=styles.table>
        <thead>
          <tr>
            <th></th>
            <th>Group</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Birthday</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='student in students' :key=student.id>
            <td><input type="checkbox"></td>
            <td>{{ student.group }}</td>
            <td>{{ student.name }} {{ student.surname }}</td>
            <td>{{ student.gender }}</td>
            <td>{{ student.birthday }}</td>
            <td><div :class='classes(styles.status, student.status === "active" && styles.active)'></div></td>
            <td>
              <button @click=onEdit(student.id) :class='styles["edit-student__button"]'><EditIcon /></button>
              <button @click=onDelete(student.id) :class='styles["delete-student__button"]'><RemoveIcon/></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button 
          v-for='i in Array.from({length: pagesCount}, (_, i) => i + 1)'
          :key=i :class='classes(styles.page, i === page && styles.active)'
          @click=onPageChange(i)
        >{{ i }}</button>
      </div>
    </div>
</template>