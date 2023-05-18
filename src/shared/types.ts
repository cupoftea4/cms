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
  avatar: string | null
};

export type ChatUser = Pick<User, "id" | "name" | "avatar">;


export type ApiChat = {
  id: string;
  name: string;
  avatar: string | null;
  isPrivate: boolean;
  users: ChatUser[];
  lastMessage: {
    id: string;
    text: string;
    timestamp: string;
  } | null;
} 

export type ApiMessage = {
  id: string;
  text?: string;
  attachments?: ApiAttachment[];
  timestamp: string;
  replyTo?: ReplyMessage;
  isRead?: boolean;
  sender: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

export type ReplyMessage = { id: string, preview: string } | null;
export type PostMessage = Pick<ApiMessage, "text" | "attachments"> 
  & { replyToMessageId?: string, senderId: number, chatId: string };

export type PostChat = Pick<ApiChat, "name" | "isPrivate"> & { userIds: number[], avatar?: File };

export type ClientMessage = ApiMessage & { state?: 'pending' | 'sent' | 'failed' | 'read' };

export type ApiAttachment = {
  id: number;
  path?: string;
  data?: any;
  fileType: string;
  name: string;
}

export type Notification = { id: string, chatId: string, preview: string, timestamp: string, chatName: string };