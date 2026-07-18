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
  PasswordSection,
  PasswordModal,
  ExpiryModal,
} from "./sections";
import styles from "./LinkBuilder.module.scss";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { logger } from "@repo/shared";
import { Link, Shield, CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { useSlugGenerator } from "@/hooks/useSlugGenerator";
import { useFormContext } from "react-hook-form";

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
  const [showExpiryModal, setShowExpiryModal] = useState(false);

  const createLink = useMutation(
    trpc.post.shortenUrl.mutationOptions({
      onSuccess: (data) => {
        console.log("Slug Created Successfully:", data);
        toast.success("Link created successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.get.getMyUrls.queryKey(),
        });
      },
      onError: (err) => {
        console.log("SLug creation error:", err);
        toast.error("Failed to create link");
      },
    }),
  );

  const editSlug = useMutation(
    trpc.post.editLongUrl.mutationOptions({
      onSuccess: (data) => {
        console.log("Slug Ediited Successfully:", data);
        toast.success("Link updated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.get.getMyUrls.queryKey(),
        });
      },
      onError: (err) => {
        console.log("Slug not Edited error:", err);
        toast.error("Failed to update link");
      },
    }),
  );

  useEffect(() => {
    if (!selectedLink) return;

    reset({
      destinationUrl: selectedLink.destinationUrl ?? "",
      slug: selectedLink.slug ?? "",
      comments: selectedLink.comments ?? "",
      expiresAt: selectedLink.expiresAt ?? "",
      password: selectedLink.password ?? "",
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
          domain: editObj.domain ?? null,
          tags: editObj.tags ?? null,
          comments: editObj.comments ?? null,
          expiresAt: editObj.expiresAt ?? null,
          password: editObj.password ?? null,
        });
      } else {
        createLink.mutate({
          destinationUrl: data.destinationUrl,
          slug: data.slug,
          domain: data.domain ?? null,
          tags: data.tags ?? null,
          comments: data.comments ?? null,
          expiresAt: data.expiresAt ?? null,
          password: data.password ?? null,
        });
      }
      closeModal();
    } catch (error) {
      logger.error("Error while creating Slug:", error);
    }
  };

  return (
    <Dialog
      open={modal === 'create' || modal === 'edit'}
      onOpenChange={(open) => { if (!open) closeModal(); }}
    >
      <DialogContent size="xl">
        <FormProvider {...methods}>
          <form className={styles.builder} onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader
              title={selectedLink? "Edit Link" : "New link"}
              description={`${selectedLink ? "Edit" : "Create"} a polished short link`}
              onClose={closeModal}
              icon={<Link />}
            />

            <DialogBody className={styles.body}>
              <div className={styles.leftColumn}>
                  <DestinationSection />

                  <ShortLinkSection />

                  {/* <ExpirySection />

                  <PasswordSection /> */}

                  <CommentSection />

                  {/* <FeatureButtons
                    onPasswordClick={() => setShowPasswordModal(true)}
                    onExpiryClick={() => setShowExpiryModal(true)}
                  /> */}
              </div>

              <aside className={styles.rightColumn}>
                <QrCodeSection />
              </aside>
            </DialogBody>

            <DialogFooter>
              <Button variant="ghost" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedLink ? "Edit Link" : "Create link"}
              </Button>
            </DialogFooter>

            {showPasswordModal && (
              <PasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
            {showExpiryModal && (
              <ExpiryModal onClose={() => setShowExpiryModal(false)} />
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

function FeatureButtons({
  onPasswordClick,
  onExpiryClick,
}: {
  onPasswordClick: () => void;
  onExpiryClick: () => void;
}) {
  const { watch } = useFormContext<LinkBuilderFields>();
  const password = watch("password");
  const expiresAt = watch("expiresAt");
  const hasPassword = !!password;
  const hasExpiry = !!expiresAt;

  return (
    <div className={styles.featureButtons}>
      <button
        type="button"
        className={[styles.featureBtn, hasPassword ? styles.featureBtnActive : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={onPasswordClick}
      >
        <Shield size={14} />
        <span>{hasPassword ? "Password set" : "Add password"}</span>
        {hasPassword && <span className={styles.featureDot} />}
      </button>

      <button
        type="button"
        className={[styles.featureBtn, hasExpiry ? styles.featureBtnActive : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={onExpiryClick}
      >
        <CalendarClock size={14} />
        <span>{hasExpiry ? "Expiry set" : "Add expiry"}</span>
        {hasExpiry && <span className={styles.featureDot} />}
      </button>
    </div>
  );
}
