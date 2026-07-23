"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, Button } from "@repo/ui";
import { useLinkBuilderStore } from "@/hooks/useLinkBuilder";
import {
  LINK_BUILDER_DEFAULTS,
  LinkBuilderFields,
  LinkBuilderFormSchema,
} from "@/types/linkBuilder";
import {
  DestinationSection,
  ShortLinkSection,
  CommentSection,
  QrCodeSection,
  ExpirySection,
  PasswordModal,
} from "./sections";
import styles from "./LinkBuilder.module.scss";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { logger } from "@repo/shared";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import { useSlugGenerator } from "@/hooks/useSlugGenerator";

export const LinkBuilder = () => {
  const methods = useForm<LinkBuilderFields>({
    resolver: zodResolver(LinkBuilderFormSchema),
    defaultValues: LINK_BUILDER_DEFAULTS,
    mode: "onTouched",
  });

  const queryClient = useQueryClient();

  const {
    handleSubmit,
    formState: { dirtyFields },
    reset
  } = methods;
  const { modal, closeModal, selectedLink } = useLinkBuilderStore();
  const { generateRandomSlug } = useSlugGenerator();
  const trpc = useTRPC();

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const createLink = useMutation(
    trpc.post.shortenUrl.mutationOptions({
      onSuccess: () => {
        toast.success("Link created successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.get.getMyUrls.queryKey(),
        });
      },
      onError: (err) => {
        logger.error("SLug creation error:", err);
        toast.error("Failed to create link");
      },
    }),
  );

  const editSlug = useMutation(
    trpc.post.editLongUrl.mutationOptions({
      onSuccess: () => {
        toast.success("Link updated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.get.getMyUrls.queryKey(),
        });
      },
      onError: (err) => {
        logger.error("Slug not Edited error:", err);
        toast.error("Failed to update link");
      },
    }),
  );

  useEffect(() => {
    if (!selectedLink) return;

    reset({
      destinationUrl: selectedLink.destinationUrl ?? "",
      slug: selectedLink.slug ?? "",
      comments: selectedLink.comments ?? undefined,
      expiresAt: selectedLink.expiresAt ?? undefined,
      password: selectedLink.password ?? undefined,
    });
  }, [selectedLink]);

  useEffect(() => {
    if (modal !== "create") return;

    const initialize = async () => {
      const slug = await generateRandomSlug();

      reset({
        destinationUrl: "",
        slug,
        comments: "",
      });
    };

    initialize();
  }, [modal]);

  const onSubmit: SubmitHandler<LinkBuilderFields> = (data) => {
    try {
      if (selectedLink) {
        const editObj: LinkBuilderFields = {
          slug: data.slug,
          destinationUrl: data.destinationUrl,
          ...(dirtyFields.comments && { comments: data.comments }),
          ...(dirtyFields.expiresAt && { expiresAt: data.expiresAt }),
          ...(dirtyFields.password && { password: data.password }),
          ...(dirtyFields.tags && { tags: data.tags }),
        };
        editSlug.mutate({
          ...editObj,
          domain: editObj.domain ?? undefined,
          tags: editObj.tags ?? undefined,
          comments: editObj.comments ?? undefined,
          expiresAt: editObj.expiresAt ?? undefined,
          password: editObj.password ?? undefined,
        });
      } else {
        createLink.mutate({
          destinationUrl: data.destinationUrl,
          slug: data.slug,
          domain: data.domain ?? undefined,
          tags: data.tags ?? undefined,
          comments: data.comments ?? undefined,
          expiresAt: data.expiresAt ?? undefined,
          password: data.password ?? undefined,
        });
      }
      closeModal();
    } catch (error) {
      logger.error("Error while creating Slug:", error);
    }
  };

  return (
    <Dialog
      open={modal === "create" || modal === "edit"}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent size="xl">
        <FormProvider {...methods}>
          <form className={styles.builder} onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader
              title={selectedLink ? "Edit Link" : "New link"}
              description={`${selectedLink ? "Edit" : "Create"} a polished short link`}
              onClose={closeModal}
              icon={<Link />}
            />

            <DialogBody className={styles.body}>
              <div className={styles.leftColumn}>
                <DestinationSection />

                <ShortLinkSection />

                <CommentSection />
              </div>

              <aside className={styles.rightColumn}>
                <QrCodeSection />
              </aside>
            </DialogBody>

            <DialogFooter className="justify-between">
              <ExpirySection />
              <div className="flex items-center gap-2">
                <Button variant="ghost" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedLink ? "Edit Link" : "Create link"}
                </Button>
              </div>
            </DialogFooter>

            {showPasswordModal && (
              <PasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};