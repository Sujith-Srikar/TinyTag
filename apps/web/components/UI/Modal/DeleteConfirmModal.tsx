"use client";

import { Button } from "@repo/ui";
import { AlertTriangle } from "lucide-react";

import { Modal } from "@/components/UI";
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/UI/Modal/ModalParts";

import { useLinkBuilderStore } from "@/hooks/useLinkBuilder";

import styles from "./DeleteConfirmModal.module.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { logger } from "@repo/shared";
import { useEffect } from "react";

export function DeleteConfirmModal() {
  const { modal, selectedLink, closeModal } = useLinkBuilderStore();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteLink = useMutation(trpc.post.deleteUrl.mutationOptions({

    onSuccess: () => {
      toast.success('Slug Deleted Successfully');
      queryClient.invalidateQueries({queryKey: trpc.get.getMyUrls.queryKey()});
    },

    onError: () => {
      toast.error('Slug Deletion Unsuccessful')
    }
  }))

  const handleDelete = () => {
    try {
      if(!selectedLink) return;
      deleteLink.mutate({slug: selectedLink.slug});
      closeModal();
    } catch (error) {
      logger.error('Error while Deleting Slug:', error)
    }
  }

  return (
    <Modal
      showModal={modal === "delete"}
      setShowModal={closeModal}
      className={styles.modal}
    >
      <ModalHeader
        title="Delete link?"
        description="This action cannot be undone."
        onClose={closeModal}
        icon={<AlertTriangle />}
        iconVariant="danger"
      />

      <ModalBody>
        <div className={styles.content}>
          <p className={styles.body}>
            <span className={styles.slug}>/{selectedLink?.slug}</span> will be
            permanently deleted.
          </p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" type="button" onClick={closeModal}>
          Cancel
        </Button>

        <Button variant="destructive" type="button" onClick={handleDelete}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}
