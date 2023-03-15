export type Student = {
  id: string;
  group: string;
  name: string;
  surname: string;
  gender: 'M' | 'F';
  birthDate: string;
  status: 'active' | 'inactive';
};

export type FormStudent = Omit<Student, "id" | "status">;

export type StudentModalMode = 'create' | 'edit';
