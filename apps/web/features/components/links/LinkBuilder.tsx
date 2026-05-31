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

export const LinkBuilder = () => {
  const methods = useForm<LinkBuilderFields>({
    resolver: zodResolver(LinkBuilderFormSchema),
    defaultValues: LINK_BUILDER_DEFAULTS,
    mode: "onTouched",
  });

  const queryClient = useQueryClient();

  const { handleSubmit } = methods;
  const { isOpen, closeBuilder } = useLinkBuilderStore();
  const linkBuilderStore = useLinkBuilderStore();
  const trpc = useTRPC();
  const createSlug = useMutation(
    trpc.post.shortenUrl.mutationOptions({
      onSuccess: (data) => {
        console.log("Data Sucess Creatte Slug:", data);
        toast.success("Slug Created Successfully");
        queryClient.invalidateQueries({queryKey: trpc.get.getAllUrls.queryKey()})
      },
      onError: (err) => {
        console.log("SLug creation error:", err);
        toast.error("Slug not Created");
      },
    }),
  );

  const onSubmit: SubmitHandler<LinkBuilderFields> = (data) => {
    try {
      createSlug.mutate({
        destinationUrl: data.destinationUrl,
        slug: data.slug,
        comments: data.comments,
        expiresAt: data.expiresAt
      });
      linkBuilderStore.closeBuilder();
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
            icon={<HeaderIcon />}
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
              Create link
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  );
};

function HeaderIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8.5 10.5a4 4 0 0 0 5.657 0l1.414-1.414a4 4 0 0 0-5.657-5.657l-.707.707"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.5 7.5a4 4 0 0 0-5.657 0L2.43 8.914a4 4 0 0 0 5.657 5.657l.707-.707"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
