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
} from "@repo/shared";
import {
  DestinationSection,
  ShortLinkSection,
  CommentSection,
  QrCodeSection,
  ExpirySection,
  PasswordSection
} from "./sections";
import styles from "./LinkBuilder.module.scss";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { logger } from "@repo/shared";
import { Link } from "lucide-react";
import { useEffect } from "react";
import { useSlugGenerator } from "@/hooks/useSlugGenerator";

export const LinkBuilder = () => {
  const methods = useForm<LinkBuilderFields>({
    resolver: zodResolver(LinkBuilderFormSchema),
    defaultValues: LINK_BUILDER_DEFAULTS,
    mode: "onTouched",
  });

  const queryClient = useQueryClient();

  const { handleSubmit, formState: { dirtyFields },reset } = methods;
  const { modal, closeModal, selectedLink } = useLinkBuilderStore();
  const { generateRandomSlug } = useSlugGenerator();
  const trpc = useTRPC();

  const createLink = useMutation(
    trpc.post.shortenUrl.mutationOptions({
      onSuccess: () => {
        toast.success("Link created successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.get.getMyUrls.queryKey(),
        });
        closeModal();
      },
      onError: (err) => {
        logger.error("Slug creation error:", err);
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
        closeModal();
      },
      onError: (err) => {
        logger.error("Slug edit error:", err);
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
  }, [selectedLink, reset]);

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
  }, [modal, reset, generateRandomSlug]);

  const handleClose = () =>  {
    reset(LINK_BUILDER_DEFAULTS);
    closeModal();
  }

  const onSubmit: SubmitHandler<LinkBuilderFields> = (data) => {
    if (selectedLink) {
      editSlug.mutate({
        slug: data.slug,
        destinationUrl: data.destinationUrl,
        domain: data.domain ?? undefined,
        ...(dirtyFields.comments && { comments: data.comments ?? undefined }),
        ...(dirtyFields.expiresAt && { expiresAt: data.expiresAt ?? undefined }),
        ...(dirtyFields.password && { password: data.password }),
        ...(dirtyFields.tags && { tags: data.tags ?? undefined }),
      });
    } else {
      createLink.mutate({
        destinationUrl: data.destinationUrl,
        slug: data.slug,
        domain: data.domain ?? undefined,
        tags: data.tags ?? undefined,
        comments: data.comments ?? undefined,
        expiresAt: data.expiresAt ?? undefined,
        password: data.password,
      });
    }
  };

  return (
    <Dialog
      open={modal === "create" || modal === "edit"}
      onOpenChange={(open) => {
        if (!open) handleClose();
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
              <div className="flex items-center gap-2">
                <ExpirySection />
                <PasswordSection />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedLink ? "Edit Link" : "Create link"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};