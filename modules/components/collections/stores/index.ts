import { create } from 'zustand';

type CollectionsPaginationStore = {
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
  setPageCount: (pageCount: number) => void;
};

export const useCollectionsPaginationStore = create<CollectionsPaginationStore>()(
  (set) => ({
    page: 1,
    pageCount: 10,
    setPage: (page) => set({ page }),
    setPageCount: (pageCount) => set({ pageCount }),
  })
);
