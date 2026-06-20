"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Modal } from "@/components/UI";
import { Button } from "@repo/ui";
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
  QrCodeSection
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

  const {
    handleSubmit,
    formState: { dirtyFields },
    reset
  } = methods;
  const { modal, closeModal, selectedLink } = useLinkBuilderStore();
  const { generateRandomSlug } = useSlugGenerator();
  const trpc = useTRPC();

  const createLink = useMutation(
    trpc.post.shortenUrl.mutationOptions({
      onSuccess: (data) => {
        console.log("Slug Created Successfully:", data);
        toast.success("Slug Created Successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.get.getMyUrls.queryKey(),
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
          queryKey: trpc.get.getMyUrls.queryKey(),
        });
      },
      onError: (err) => {
        console.log("Slug not Edited error:", err);
        toast.error("Slug not Edited");
      },
    }),
  );

  useEffect(() => {
    if (!selectedLink) return;

    reset({
      destinationUrl: selectedLink.destinationUrl ?? "",
      slug: selectedLink.slug ?? "",
      comments: selectedLink.comments ?? "",
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
        createLink.mutate({
          destinationUrl: data.destinationUrl,
          slug: data.slug,
          comments: data.comments,
          expiresAt: data.expiresAt,
        });
      }
      closeModal();
    } catch (error) {
      logger.error("Error while creating Slug:", error);
    }
  };

  return (
    <Modal
      showModal={modal === 'create' || modal === 'edit'}
      setShowModal={closeModal}
      className={styles.modal}
    >
      <FormProvider {...methods}>
        <form className={styles.builder} onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title={selectedLink? "Edit Link" : "New link"}
            description={`${selectedLink ? "Edit" : "Create"} a polished short link`}
            onClose={closeModal}
            icon={<Link />}
          />

          <ModalBody className={styles.body}>
            <div className={styles.leftColumn}>
                <DestinationSection />

                <ShortLinkSection />

                <CommentSection />
            </div>

            <aside className={styles.rightColumn}>
              <QrCodeSection />
            </aside>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" type="button" onClick={closeModal}>
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
