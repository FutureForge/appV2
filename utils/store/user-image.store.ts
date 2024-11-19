import { StateCreator, create } from "zustand";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { linearGenerate } from "@/modules/app";

type UserImage = {
  backgroundImage: string;
  setBackgroundImage: (backgroundImage: string) => void;
};

const createState: StateCreator<UserImage> = (set) => ({
  backgroundImage: "",
  setBackgroundImage: (backgroundImage: string) =>
    set({ backgroundImage: backgroundImage || linearGenerate() }),
});

export const useUserImageStore = create<UserImage>()(
  persist(createState, {
    name: "userImage",
  })
);
