import { socket } from "@/services/socketio.service";
import type { ApiChat, ApiMessage, ClientMessage, Notification, PostChat, PostMessage, User } from "@/shared/types";
import { sortChats } from "./helpers";

const messageCallbacks: Record<string, (data: { chatId: string, message: ApiMessage}) => void> = {};
const readCallbacks: Record<string, (chatId: string) => void> = {};

export function subscribeToNewMessage(callbackId: string, onMessage: (data: ApiMessage, chatId?: string) => void) {
  messageCallbacks[callbackId] = (data: { chatId: string, message: ApiMessage}) => {
    console.log("Message received", data, callbackId);
    onMessage(data.message, data.chatId);
  };
  socket.on("message", messageCallbacks[callbackId]);
}

export function subscribeToUpdatedMessage(callbackId: string, onMessage: (data: ApiMessage, chatId: string) => void) {
  messageCallbacks[callbackId] = (data: { chatId: string, message: ApiMessage}) => {
    console.log("Message updated", data, callbackId);
    onMessage(data.message, data.chatId);
  };
  socket.on("updatedMessage", messageCallbacks[callbackId]);
}

export function subscribeToDeletedMessage(callbackId: string, onMessage: (data: ApiMessage, chatId: string) => void) {
  messageCallbacks[callbackId] = (data: { chatId: string, message: ApiMessage}) => {
    console.log("Message deleted", data, callbackId);
    onMessage(data.message, data.chatId);
  };
  socket.on("deletedMessage", messageCallbacks[callbackId]);
}

export function unsubscribeFromNewMessage(callbackId: string) {
  socket.off("message", messageCallbacks[callbackId]);
}

export function unsubscribeFromUpdatedMessage(callbackId: string) {
  socket.off("updatedMessage", messageCallbacks[callbackId]);
}

export function unsubscribeFromDeletedMessage(callbackId: string) {
  socket.off("deletedMessage", messageCallbacks[callbackId]);
}

export function subscribeToChatRead(callbackId: string, onRead: (chatId: string) => void) {
  readCallbacks[callbackId] = onRead;
  socket.on("read", readCallbacks[callbackId]);
}

export function unsubscribeFromChatRead(callbackId: string) {
  socket.off("read", readCallbacks[callbackId]);
}

export function emitGetChats(onResponse: (data: ApiChat[]) => void) {
  console.log("Emitting get chats");
  socket.emit("getAllChats", (data: ApiChat[]) => {
    console.warn("Chats: ", data);
    const sortedChats = sortChats(data);
    onResponse(sortedChats);
    return data;
  });
}

export function emitGetChatsByName(name: string | null, onResponse: (data: ApiChat[]) => void) {
  socket.emit("findChatsByName", name, (data: ApiChat[]) => {
    console.warn("Found Chats: ", data);
    onResponse(data);
    return data;
  });
}

export function emitGetUsersByName(name: string | null, onResponse: (data: User[]) => void) {
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

export function emitCreateChat(chat: PostChat, onResponse?: (data: ApiChat) => void) {
  socket.emit("createChat", chat, (data: ApiChat) => {
    console.warn("Chat created: ", data);
    onResponse && onResponse(data);
    return data;
  });
}

export function emitJoinChat(chatId: string, onResponse?: (data: ApiChat) => void) {
  socket.emit("joinChat", chatId, (data: ApiChat) => {
    console.warn("Chat joined: ", data);
    onResponse && onResponse(data);
    return data;
  });
}

export function emitReadChat(chatId: string, onResponse?: (data: boolean) => void) {
  socket.emit("readChat", chatId, (data: boolean) => {
    console.warn("Chat read: ", data);
    onResponse && onResponse(data);
    return data;
  });
}

export function emitCreateMessage(message: ClientMessage, chatId: string, onResponse?: (data: ApiMessage) => void) {
  console.log("Emitting create message", message);
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

export function emitUpdateMessage(message: ApiMessage, chatId: string, onResponse?: (data: boolean) => void) {
  const msg = {
    id: message.id,
    text: message.text,
    chatId: chatId
  }
  socket.emit("updateMessage", msg, (data: boolean) => {
    console.warn("Message updated: ", data);
    if (onResponse) onResponse(data);
    return data;
  });
}

export function emitDeleteMessage(message: ApiMessage, chatId: string, onResponse?: (data: boolean) => void) {
  const msg = {
    id: message.id,
    chatId: chatId
  }
  socket.emit("removeMessage", msg, (data: boolean) => {
    console.warn("Message deleted: ", data);
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


