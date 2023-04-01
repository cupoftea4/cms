import { fetchJson } from "@/shared/api";
import type { FormStudent, Group, Student } from "@/shared/types";

type StudentsResponse = {
  data: Student[];
  meta: {
    current_page: number;
    last_page: number;
  }
};

export function getStudents(page: number = 1) {
  return fetchJson<StudentsResponse>("/students?page=" + page);
}

export function createStudent(student: FormStudent) {
  return fetchJson<{data: Student}>("/students", "POST", student).then(res => res.data);
}

export function deleteStudent(id: number) {
  return fetchJson(`/students/${id}`, "DELETE");
}

export function updateStudent(id: number, student: FormStudent) {
  return fetchJson<Student>(`/students/${id}`, "PUT", student);
}

export function getGroups() {
  return fetchJson<Group[]>("/groups");
}