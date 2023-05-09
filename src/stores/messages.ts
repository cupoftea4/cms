import type { Notification } from '@/shared/types';
import { defineStore } from 'pinia';

export const useMessagesStore = defineStore('messages', {
  state: () : { unreadMessages: Notification[] } => ({ unreadMessages: [] }),

  getters: {},
  actions: {}
});