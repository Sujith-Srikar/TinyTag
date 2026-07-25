"use client";

import { Field, FieldLabel, FieldError } from "@repo/ui";
import { Button, Input } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@repo/shared";
import { Shuffle, Sparkles } from "lucide-react";
import { useEffect } from "react";
import styles from "../LinkBuilder.module.scss";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useLinkBuilderStore } from "@/hooks/useLinkBuilder";
import { useSlugGenerator } from "@/hooks/useSlugGenerator";

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
  const checkUniqueSlug = useQuery(
    trpc.get.validateSlugAvailability.queryOptions(
      { slug },
      { enabled: false, retry: false },
    ),
  );

  useEffect(() => {
    if (!slug) return;

    if (selectedLink && selectedLink.slug === slug) {
      clearErrors("slug");
      return;
    }

    const timer = setTimeout(async () => {
      const isValid = await trigger("slug");
      if (!isValid) return;
      const result = await checkUniqueSlug.refetch();
      if (result.error) {
        setError("slug", {
          type: "manual",
          message: result.error.message,
        });
      } else {
        clearErrors("slug");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  const handleShuffle = async () => {
    const slug = await generateRandomSlug();

    clearErrors("slug");

    setValue("slug", slug, {
      shouldDirty: true,
    });
  };

  const handleSmartShuffle = async () => {
    if (!destinationUrl) return;

    const slug = await generateSmartSlug(destinationUrl);

    clearErrors("slug");

    setValue("slug", slug, {
      shouldDirty: true,
    });
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
