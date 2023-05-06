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

export type User = {
  id: number
  name: string
  email: string
  avatar?: string
};


export type ApiChat = {
  id: number;
  name: string;
  avatar: string;
  isPrivate: boolean;
  lastMessage: {
    id: number;
    text: string;
    timestamp: number;
  };
}

export type ApiMessage = {
  id: number;
  text?: string;
  files?: ApiAttachment[];
  timestamp: number;
  replyTo?: ApiMessage;
  isRead?: boolean;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export type PostMessage = Pick<ApiMessage, "text" | "files"> 
  & { replyToId?: number, authorId: number };

export type ClientMessage = ApiMessage & { state?: 'pending' | 'sent' | 'failed' | 'read' };

export type ApiAttachment = {
  id: number;
  url?: string;
  data?: any;
  type: string;
  name: string;
}