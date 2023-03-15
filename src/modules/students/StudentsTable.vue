<script setup lang="ts">

import styles from "./StudentsTable.module.scss";
import { classes } from "@/styles/utils";
import type { Student } from "@/shared/types";

const { students, onEdit, onDelete } = defineProps<{
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  students: Student[];
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
            <td>{{ student.birthDate }}</td>
            <td><div :class='classes(styles.status, student.status === "active" && styles.active)'></div></td>
            <td>
              <button @click=onEdit(student.id) :class='styles["edit-student__button"]'>Edit</button>
              <button @click=onDelete(student.id) :class='styles["delete-student__button"]'>Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>