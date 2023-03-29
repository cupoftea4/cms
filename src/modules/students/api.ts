import { fetchJson } from "@/shared/api";
import type { FormStudent, Student } from "@/shared/types";

export function getStudents() {
  return fetchJson<Student[]>("/students");
}

export function createStudent(student: FormStudent) {
  
  return fetchJson<Student[]>("/students", "POST", student);
}

export function deleteStudent(id: number): Promise<void> {
  return fetchJson<void>(`/students/${id}`, "DELETE");
}

export function updateStudent(student: Student): Promise<Student> {
  return fetchJson<Student>(`/students/${student.id}`, "PUT", student);
}