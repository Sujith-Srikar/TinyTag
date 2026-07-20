"use client";

import { Button, Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter } from "@repo/ui";
import { AlertTriangle } from "lucide-react";

import { useLinkBuilderStore } from "@/hooks/useLinkBuilder";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { logger } from "@repo/shared";

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
    <Dialog
      open={modal === "delete"}
      onOpenChange={(open) => { if (!open) closeModal(); }}
    >
      <DialogContent size="sm">
        <DialogHeader
          title="Delete link?"
          description="This action cannot be undone."
          onClose={closeModal}
          icon={<AlertTriangle />}
          iconVariant="danger"
        />

        <DialogBody>
          <p className="text-[0.875rem] text-muted leading-relaxed">
            <span className="font-mono font-semibold text-foreground bg-elevated px-1.5 py-px rounded-[var(--radius-sm)]">
              /{selectedLink?.slug}
            </span>{" "}
            will be permanently deleted.
          </p>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" type="button" onClick={closeModal}>
            Cancel
          </Button>

          <Button variant="destructive" type="button" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
