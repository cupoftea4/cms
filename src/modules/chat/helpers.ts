import type { ApiAttachment, ApiMessage, ClientMessage, PostMessage } from "@/shared/types";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

export function isMyMessage(message: ApiMessage) {
  return message.author.id === userStore.user?.id;
}

export function showAvatar(messages: ApiMessage[], index: number, isChatPrivate: boolean) {
  const currentMessage = messages[index];
  return !(isChatPrivate || 
          isMyMessage(currentMessage) || 
          currentMessage?.author.id === messages[index + 1]?.author.id);
}

export function showName(currentMessage: ApiMessage, isChatPrivate: boolean) {
  return !(isChatPrivate || isMyMessage(currentMessage));
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

export function formatMessageTime(timestamp: number) {
  const dateTime = new Date(timestamp);
  return dateTime.getHours().toString().padStart(2, "0") + ":" +
    dateTime.getMinutes().toString().padStart(2, "0");
}

export function formatDate(timestamp: number) {
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


export function createMessage(message: {text: string, files: File[]}, replyTo: ApiMessage | null, renderFile: (file: ApiAttachment, id: number) => void) {
  const msg: ClientMessage = {
    id: Date.now(),
    text: message.text,
    timestamp: Date.now(),
    author: userStore.user!,
    replyTo: replyTo ?? undefined,
    files: [],
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