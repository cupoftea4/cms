export type Student = {
  id: number;
  group: string;
  name: string;
  surname: string;
  gender: 'M' | 'F' | 'B';
  birthday: string;
  status: 'active' | 'inactive';
};

export type FormStudent = Omit<Student, "id" | "status" | "group"> & {"groupId": number};

export type StudentModalMode = 'create' | 'edit';

export type Group = {
  id: number;
  name: string;
};
