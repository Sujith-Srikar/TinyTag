"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Drawer } from "vaul";
import {
    useEffect,
    useState,
  type ComponentProps,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import styles from "./Modal.module.scss";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 640px)");
}

export interface ModalProps {
  children: ReactNode;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
  className?: string;
  drawerRootProps?: ComponentProps<typeof Drawer.Root>;
}

export function Modal({
  children,
  showModal,
  setShowModal,
  onClose,
  desktopOnly = false,
  preventDefaultClose = false,
  className = "",
  drawerRootProps,
}: ModalProps) {

  const router = useRouter();
  const isMobile = useIsMobile();

  const closeModal = ({ dragged = false }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) return;
    onClose?.();
    if (setShowModal) {
      setShowModal(false);
    } else {
      router.back();
    }
  };

  if (isMobile && !desktopOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) closeModal({ dragged: true });
        }}
        {...drawerRootProps}
      >
        <Drawer.Portal>
          <Drawer.Overlay className={styles.drawerOverlay} />
          <Drawer.Content
            className={[styles.drawerContent, className]
              .filter(Boolean)
              .join(" ")}
            onPointerDownOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.closest("[data-sonner-toast]")
              ) {
                e.preventDefault();
              }
            }}
          >
            <VisuallyHidden.Root>
              <Drawer.Title>Modal</Drawer.Title>
              <Drawer.Description>This is a modal</Drawer.Description>
            </VisuallyHidden.Root>

            <DrawerHandle />

            <div className={styles.drawerBody}>{children}</div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Root
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay id="modal-backdrop" className={styles.dialogOverlay} />
        <Dialog.Content
          className={[styles.dialogContent, className]
            .filter(Boolean)
            .join(" ")}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            if (preventDefaultClose) {
              e.preventDefault();
              return;
            }
            if (
              e.target instanceof Element &&
              e.target.closest("[data-sonner-toast]")
            ) {
              e.preventDefault();
            }
          }}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Modal</Dialog.Title>
            <Dialog.Description>This is a modal</Dialog.Description>
          </VisuallyHidden.Root>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DrawerHandle() {
  return (
    <div className={styles.drawerHandleWrap} aria-hidden="true">
      <div className={styles.drawerHandle} />
    </div>
  );
}
