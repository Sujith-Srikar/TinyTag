import {create} from 'zustand';
import { LinkBuilderFields } from '@/types/linkBuilder';

type LinkBuilderStore = {
    isOpen: boolean;
    selectedLink: LinkBuilderFields | null;

    openBuilder: (link?: LinkBuilderFields) => void;
    closeBuilder: () => void;
}

export const useLinkBuilderStore = create<LinkBuilderStore>((set) => ({
    isOpen: false,
    selectedLink: null,

    openBuilder: (link) => set({isOpen: true, selectedLink: link ?? null}),
    closeBuilder: () => set({isOpen: false, selectedLink: null})
}))