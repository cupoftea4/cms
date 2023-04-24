import { fetchAuth } from "@/shared/api";
import type { User } from "@/shared/types";

type AuthResponse = {
  status: string;
  data: {
    token: string;
    user: User;
  };
};

export function getUser() {
  return fetchAuth<User>('/user', true);
}

export function registerUser(name: string, email: string, password: string) {
  return fetchAuth<AuthResponse>('/register', false, { name, email, password })
}

export function loginUser(email: string, password: string) {
  return fetchAuth<AuthResponse>('/login', false, { email, password });
}

export function oauth(provider: string) {
  return fetchAuth<{ url: string }>(`/${provider}`, false);
}

export function logoutUser() {
  return fetchAuth('/logout', true);
}

