// authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  newUser: null,
  setNewUser: (user) => set({ newUser: user }),
  parttimer_consent: null,
  setParttimer_consent: (consent) => set({ parttimer_consent: consent }),
  loading: false, 
  setLoading: (isLoading) => set({ loading: isLoading }), 
  myWorkData: null,
  setMyWorkData: (work) => set({myWorkData: work}),
  teamDetails: null,
  setTeamDetails: (team) => set({teamDetails: team})
}));

export default useAuthStore;
