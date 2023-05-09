import { socket } from "@/services/socketio.service";
import type { ApiChat, ApiMessage, ClientMessage, Notification, PostChat, PostMessage, User } from "@/shared/types";
import { sortChats } from "./helpers";


export function onNewMessage(chatId: string, onMessage: (data: ApiMessage, chatId?: string) => void) {
  socket.on("message", (data: { chatId: string, message: ApiMessage}) => {
    console.log("Message received", data);
    if (data.chatId === chatId) return onMessage(data.message);
    if (chatId ==='all') return onMessage(data.message, data.chatId);
  });
}

export function emitGetChats(onResponse: (data: ApiChat[]) => void) {
  socket.emit("getAllChats", (data: ApiChat[]) => {
    console.warn("Chats: ", data);
    const sortedChats = sortChats(data);
    onResponse(sortedChats);
    return data;
  });
}

export function emitGetChatsByName(name: string, onResponse: (data: ApiChat[]) => void) {
  socket.emit("findChatsByName", name, (data: ApiChat[]) => {
    console.warn("Found Chats: ", data);
    onResponse(data);
    return data;
  });
}

export function emitGetUsersByName(name: string, onResponse: (data: User[]) => void) {
  socket.emit("findUsersByName", name, (data: User[]) => {
    console.warn("Found Chats: ", data);
    onResponse(data);
    return data;
  });
}

export function emitGetUnreadMessages(onResponse?: (data: Notification[]) => void) {
  socket.emit("getUnreadMessages", (data: Notification[]) => {
    console.warn("Unread messages: ", data);
    if (onResponse) onResponse(data);
    return data;
  });
}

export function emitCreateChat(chat: PostChat) {
  socket.emit("createChat", chat, (data: ApiChat) => {
    console.warn("Chat created: ", data);
    return data;
  });
}

export function emitCreateMessage(message: ClientMessage, chatId: string, onResponse?: (data: ApiMessage) => void) {
  const msg: PostMessage = {
    text: message.text,
    attachments: message.attachments,
    replyToMessageId: message.replyTo?.id,
    senderId: message.sender.id,
    chatId: chatId
  }
  socket.emit("createMessage", msg, (data: ApiMessage) => {
    console.warn("Message created: ", data);
    if (onResponse) onResponse(data);
    return data;
  });
}

export function emitGetMessages(chatId: string, onResponse?: (data: ApiMessage[]) => void) {
  socket.emit("getMessages", chatId, (data: ApiMessage[]) => {
    console.warn("Messages: ", data);
    if (onResponse) onResponse(data);
    return data;
  });
}


