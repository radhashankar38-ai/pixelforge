export type AppState = 'splash' | 'onboarding' | 'auth' | 'home' | 'editor' | 'export' | 'profile' | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isPro?: boolean;
}

export interface EditSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  highlights: number;
  shadows: number;
  sharpness: number;
  warmth: number;
  tint: number;
  filter: string;
  vignette: number;
  blur: number;
}

export interface CustomPreset {
  id: string;
  name: string;
  settings: EditSettings;
}

export interface Project {
  id: string;
  name: string;
  originalImage: string;
  editedImage?: string;
  settings: EditSettings;
  createdAt: number;
  updatedAt: number;
}

export const defaultEditSettings: EditSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 100,
  highlights: 100,
  shadows: 100,
  sharpness: 0,
  warmth: 0,
  tint: 0,
  vignette: 0,
  blur: 0,
  filter: 'none',
};
