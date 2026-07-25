import { create } from "zustand";
import { LinkBuilderFields } from "@repo/shared";

type LinkBuilderStore = {
  modal: "create" | "edit" | "delete" | null;
  selectedLink: LinkBuilderFields | null;

  openCreate: () => void;
  openEdit: (link: LinkBuilderFields) => void;
  openDelete: (link: LinkBuilderFields) => void;
  closeModal: () => void;
};

export const useLinkBuilderStore = create<LinkBuilderStore>((set) => ({
  modal: null,
  selectedLink: null,

  openCreate: () => {set({ modal: "create", selectedLink: null })},
  openEdit: (link) => set({ modal: "edit", selectedLink: link }),
  openDelete: (link) => set({ modal: "delete", selectedLink: link }),
  closeModal: () => set({ modal: null, selectedLink: null }),
}));
