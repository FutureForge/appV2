import { create } from "zustand";

interface FilterStore {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedFilter: "Not Listed",
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
}));
