import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export const { persistAtom } = recoilPersist();

export const collapseSidebarState = atom<boolean>({
  key: "collapseSidebarState",
  default: false,
  effects_UNSTABLE: [persistAtom]
})