import { getUser, loginUser, logoutUser, oauth, registerUser } from '@/modules/auth/api';
import type { User } from '@/shared/types';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () : { user: User | null } => ({ user: null }),

  getters: {
    token() {
      return localStorage.getItem('token');
    }
  },
  actions: {
    updateProfile(user: User, token?: string) {
      if (token) localStorage.setItem('token', token);
      this.user = user;
    },

    async updateProfileIfExists() {
      if (!localStorage.getItem('token')) return;
      const response = await getUser();
      this.updateProfile(response);
    },
      
    async register(name: string, email: string, password: string) {
      const res = await registerUser(name, email, password);
      this.updateProfile(res.data.user, res.data.token);
    },

    async loginWithProvider(provider: string) {
      const newWindow = openWindow('', 'message');
      const data = await oauth(provider);
      if (!newWindow) return;
      newWindow.location.href = data.url;
    },

    async login(email: string, password: string) {
      const res = await loginUser(email, password);
      this.updateProfile(res.data.user, res.data.token);
    },

    async logout() {
      await logoutUser();
      localStorage.removeItem('token');
      this.user = null;
    }
  }
});


function openWindow (url: string, title: string, options: any = {}) {
  options = { url, title, width: 500, height: 650, left: 100, top: 100, ...options };

  const optionsStr = Object.keys(options).reduce((acc, key) => {
    acc.push(`${key as string}=${options[key]}`)
    return acc
  }, [] as string[]).join(',');

  const newWindow = window.open(url, title, optionsStr);

  if (newWindow?.focus) {
    newWindow.focus();
  }

  return newWindow;
}