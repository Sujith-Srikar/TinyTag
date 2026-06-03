"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Modal } from "@/components/UI";
import { Badge, Button } from "@repo/ui";
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/UI/Modal/ModalParts";
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
} from "./sections";
import styles from "./LinkBuilder.module.scss";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { logger } from "@repo/shared";
import { Link } from "lucide-react";
import { useEffect } from "react";

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
  const { isOpen, closeBuilder, selectedLink } = useLinkBuilderStore();
  const trpc = useTRPC();
  const createSlug = useMutation(
    trpc.post.shortenUrl.mutationOptions({
      onSuccess: (data) => {
        console.log("Slug Created Successfully:", data);
        toast.success("Slug Created Successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.get.getAllUrls.queryKey(),
        });
      },
      onError: (err) => {
        console.log("SLug creation error:", err);
        toast.error("Slug not Created");
      },
    }),
  );

  const editSlug = useMutation(
    trpc.post.editLongUrl.mutationOptions({
      onSuccess: (data) => {
        console.log("Slug Ediited Successfully:", data);
        toast.success("Slug Ediited Successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.get.getAllUrls.queryKey(),
        });
      },
      onError: (err) => {
        console.log("Slug not Edited error:", err);
        toast.error("Slug not Edited");
      },
    }),
  );

  useEffect(() => {
    if (!selectedLink) {
      reset({
        destinationUrl: "",
        slug: "",
        comments: "",
      });
      return;
    }

    reset({
      destinationUrl: selectedLink.destinationUrl ?? "",
      slug: selectedLink.slug ?? "",
      comments: selectedLink.comments ?? "",
    });
  }, [selectedLink, reset]);

  const onSubmit: SubmitHandler<LinkBuilderFields> = (data) => {
    try {
      if (selectedLink) {
        let editObj: LinkBuilderFields = {
          slug: data.slug,
          destinationUrl: data.destinationUrl,
          ...(dirtyFields.comments && { comments: data.comments }),
          ...(dirtyFields.expiresAt && { expiresAt: data.expiresAt }),
          ...(dirtyFields.password && { password: data.password }),
          ...(dirtyFields.tags && { tags: data.tags }),
        };
        editSlug.mutate(editObj);
      } else {
        createSlug.mutate({
          destinationUrl: data.destinationUrl,
          slug: data.slug,
          comments: data.comments,
          expiresAt: data.expiresAt,
        });
      }
      closeBuilder();
    } catch (error) {
      logger.error("Error while creating Slug:", error);
    }
  };

  return (
    <Modal
      showModal={isOpen}
      setShowModal={closeBuilder}
      className={styles.modal}
    >
      <FormProvider {...methods}>
        <form className={styles.builder} onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title="New link"
            description="Create a polished short link with a Dub-style workflow."
            onClose={closeBuilder}
            icon={<Link />}
          />

          <ModalBody className={styles.body}>
            <div className={styles.mainColumn}>
              <section className={styles.sectionCard}>
                <DestinationSection />
              </section>

              <section className={styles.sectionCard}>
                <ShortLinkSection />
              </section>

              <section className={styles.sectionCard}>
                <CommentSection />
              </section>
            </div>

            <aside className={styles.sideRail}>
              <div className={styles.previewCard}>
                <div className={styles.previewTopRow}>
                  <Badge variant="default">Draft saved</Badge>
                  <Badge variant="outline">Links</Badge>
                </div>

                <div className={styles.previewStack}>
                  <div>
                    <p className={styles.previewLabel}>Destination</p>
                    <p className={styles.previewValue}>
                      {"https://example.com/your/destination"}
                    </p>
                  </div>

                  <div>
                    <p className={styles.previewLabel}>Short link</p>
                    <div className={styles.previewLinkRow}>
                      <p className={styles.previewLink}>
                        tt.vercel.app/
                        <strong>{"auto-generated"}</strong>
                      </p>
                      {true && (
                        <Button
                          value={`tt.vercel.app/`}
                          variant='link'
                          size="sm"
                        />
                      )}
                    </div>
                  </div>

                  <div className={styles.previewHintBox}>
                    <p className={styles.previewHintTitle}>What happens next</p>
                    <p className={styles.previewHintText}>
                      Keep the destination focused, generate a short slug when
                      needed, and add internal comments for later reference.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" type="button" onClick={closeBuilder}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedLink ? "Edit Link" : "Create link"}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  );
};
