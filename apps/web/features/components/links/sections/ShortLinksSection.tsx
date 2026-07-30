"use client";

import { Field, FieldLabel, FieldError } from "@repo/ui";
import { Button, Input } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@repo/shared";
import { Shuffle, Sparkles } from "lucide-react";
import { useEffect } from "react";
import styles from "../LinkBuilder.module.scss";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { useLinkBuilderStore } from "@/hooks/useLinkBuilder";
import { useSlugGenerator } from "@/hooks/useSlugGenerator";
import { TRPCError } from "@trpc/server";

export const ShortLinkSection = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
  } = useFormContext<LinkBuilderFields>();

  const { selectedLink } = useLinkBuilderStore();
  const { generateRandomSlug, generateSmartSlug } = useSlugGenerator();

  const destinationUrl = watch("destinationUrl");
  const slug = watch("slug");

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!slug) return;

    if (selectedLink && selectedLink.slug === slug) return;

    const timer = setTimeout(async () => {
      const isValid = await trigger("slug");
      if (!isValid) return;

      try {
        await queryClient.fetchQuery(
          trpc.get.validateSlugAvailability.queryOptions({ slug }),
        );
        clearErrors("slug");
      } catch (err) {
        const message = err instanceof TRPCError ? err.message : "Slug is not available";
        setError("slug", { type: "manual", message });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug, selectedLink, trigger, queryClient, trpc, clearErrors, setError]);

  const handleShuffle = async () => {
    const slug = await generateRandomSlug();
    clearErrors("slug");
    setValue("slug", slug, {shouldDirty: true});
  };

  const handleSmartShuffle = async () => {
    if (!destinationUrl) return;

    const slug = await generateSmartSlug(destinationUrl);
    clearErrors("slug");
    setValue("slug", slug, {shouldDirty: true});
  };

  return (
    <>
      <Field>
        <div className={styles.shortLinkHeaderRow}>
          <FieldLabel htmlFor="slug">Short link</FieldLabel>

          <div className={styles.shortLinkActions}>
            <Button
              variant="ghost"
              size="xs"
              onClick={handleShuffle}
              aria-label="Generate random slug"
              title="Generate random slug"
              type="button"
            >
              <Shuffle size={12} />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={handleSmartShuffle}
              aria-label="Generate slug from destination"
              title="Generate slug from destination"
              type="button"
              disabled={!destinationUrl}
            >
              <Sparkles size={12} />
            </Button>
          </div>
        </div>
        <Input
          id="slug"
          type="text"
          placeholder="Your Slug"
          {...register("slug")}
        />
        <FieldError errors={[errors.slug]} />
      </Field>
    </>
  );
};
