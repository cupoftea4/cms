import type { ApiAttachment, ApiChat, ApiMessage, ClientMessage, ReplyMessage, User } from "@/shared/types";

export function isMyMessage(message: ApiMessage, user: User | null) {
  return message.sender.id === user?.id;
}

export function showAvatar(messages: ApiMessage[], index: number, isChatPrivate: boolean, user: User | null) {
  const currentMessage = messages[index];
  return !(isChatPrivate || 
          isMyMessage(currentMessage, user) || 
          currentMessage?.sender.id === messages[index + 1]?.sender.id);
}

export function showName(currentMessage: ApiMessage, isChatPrivate: boolean, user: User | null) {
  return !(isChatPrivate || isMyMessage(currentMessage, user));
}

export function isFileAnImage(file: File | ApiAttachment) {
  return file.type.startsWith('image');
}

export async function getBlobUrlFromFIle(file: ApiAttachment) {
  if (!file?.data) return;
  const res: Response = await fetch(file.data);
  const blob: Blob = await res.blob();
  return URL.createObjectURL(blob);
}

export function formatMessageTime(timestamp: string) {
  const dateTime = new Date(timestamp);
  return dateTime.getHours().toString().padStart(2, "0") + ":" +
    dateTime.getMinutes().toString().padStart(2, "0");
}

export function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return formatMessageTime(timestamp);
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString();
}

export function showDate(messages: ApiMessage[], index: number) {
  const currentMessage = messages[index];
  const previousMessage = messages[index + 1];

  if (!previousMessage) return true;

  const currentDate = new Date(currentMessage.timestamp);
  const previousDate = new Date(previousMessage.timestamp);

  return currentDate.getDate() !== previousDate.getDate();
}

export function getMessageDate(message: ApiMessage) {
  const today = new Date();
  if (new Date(message.timestamp).toDateString() === today.toDateString()) return 'Today';
  return formatDate(message.timestamp);
}

export function sortMessagesByDate(messages: ClientMessage[] | null) {
  if (!messages) return {};
  const messagesByDate: Record<string, ClientMessage[]> = {};
  messages.forEach((message) => {
    const dateKey = getMessageDate(message);
    if (!messagesByDate[dateKey]) {
      messagesByDate[dateKey] = [];
    }
    messagesByDate[dateKey].unshift(message);
  }); 
  return messagesByDate;
}


export function createMessage(
  message: {text: string, files: File[]}, 
  replyTo: ApiMessage | null, 
  user: User | null,
  renderFile: (file: ApiAttachment, id: string) => void
) {
  const replyToMessage: ReplyMessage = replyTo 
    ? { id: replyTo.id, preview: replyTo.text ?? replyTo.attachments![0].name } 
    : null;

  const msg: ClientMessage = {
    id: Date.now().toLocaleString(),
    text: message.text,
    timestamp: (new Date).toISOString(),
    sender: user!,
    replyTo: replyToMessage,
    attachments: [],
    state: 'pending'
  }

  message.files.forEach((file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      const attachment: ApiAttachment = {
        id: Date.now(),
        data,
        type: file.type,
        name: file.name,
      }
      renderFile(attachment, msg.id);
    }
  });


  return msg;
}

export function sortChats(chats: ApiChat[]) {
  return chats.sort((a, b) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.timestamp).valueOf() - new Date(a.lastMessage.timestamp).valueOf();
  });
}

export function sortMessages<T extends { timestamp: string }>(messages: T[], order: 'asc' | 'desc' = 'desc') {
  return messages.sort((a, b) => {
    return order === 'asc'
      ? new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf()
      : new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf();
  });
}