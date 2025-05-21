// authStore.js
import { create } from 'zustand';

const useAuthStore = create(set => ({
  newUser: null,
  setNewUser: user => set({ newUser: user }),
  parttimer_consent: null,
  setParttimer_consent: consent => set({ parttimer_consent: consent }),
  loading: false,
  setLoading: isLoading => set({ loading: isLoading }),
  myWorkData: null,
  setMyWorkData: work => set({ myWorkData: work }),
  teamDetails: null,
  setTeamDetails: team => set({ teamDetails: team }),
  selectedAcsStatusDate: null,
  setSelectedAcsStatusDate: date => set({ selectedAcsStatusDate: date }),
  selectedUpdateStatusDate: null,
  setSelectedUpdateStatusDate: date => set({ selectedUpdateStatusDate: date }),
  collegesList: [],
  setcollegesList: colleges => set({ collegesList: colleges }),
  teamAllDetails: null,
  setTeamAllDetails: team => set({ teamAllDetails: team }),
}));

export default useAuthStore;
