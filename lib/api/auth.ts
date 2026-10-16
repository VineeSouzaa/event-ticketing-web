import type { components } from './schema';
import { api } from './client';

export type User = components['schemas']['UserResponseDto'];

export const signIn = (body: components['schemas']['SignInDto']) =>
  api.POST('/auth/sign-in', { body });

export const signUp = (body: components['schemas']['SignUpDto']) =>
  api.POST('/auth/sign-up', { body });

export const signOut = () => api.POST('/auth/sign-out');
