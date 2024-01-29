// authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  newUser: null,
  setNewUser: (user) => set({ newUser: user }),
  parttimer_consent: null,
  setParttimer_consent: (consent) => set({ parttimer_consent: consent }),
}));

export default useAuthStore;
