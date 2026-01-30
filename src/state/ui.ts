import { create } from 'zustand';

type View = 'landing' | 'owner' | 'clinic';
type OwnerTab = 'home' | 'protocol' | 'ai' | 'learn';

interface UIState {
  view: View;
  ownerTab: OwnerTab;
  uploadProgress: number | null;
  setView: (v: View) => void;
  setOwnerTab: (t: OwnerTab) => void;
  setUploadProgress: (p: number | null) => void;
}

export const useUI = create<UIState>((set) => ({
  view: 'landing',
  ownerTab: 'home',
  uploadProgress: null,
  setView: (view) => set({ view }),
  setOwnerTab: (ownerTab) => set({ ownerTab }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
}));
