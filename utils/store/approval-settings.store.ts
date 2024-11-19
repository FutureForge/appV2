import { StateCreator, create } from "zustand";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

type ApprovalSettingType = "unlimited" | "1/1";

export enum ApprovalSettingEnum {
  ONE_PER_ONE = "1/1",
  UNLIMITED = "unlimited",
}

type ApprovalSetting = {
  approvalSetting: ApprovalSettingType;
  setApprovalSetting: (approvalSetting: ApprovalSettingType) => void;
};

const createState: StateCreator<ApprovalSetting> = (set) => ({
  approvalSetting: "1/1",
  setApprovalSetting: (approvalSetting: ApprovalSettingType) =>
    set({ approvalSetting }),
});

export const useApprovalSettingStore = create<ApprovalSetting>()(
  persist(createState, {
    name: "approvalSettings",
  })
);
