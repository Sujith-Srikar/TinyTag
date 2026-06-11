"use client";

import { Field, FieldLabel, FieldError } from "@repo/ui";
import { Button, Input } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";
import { Shuffle, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { generateRandomSlug, generateSlugFromUrl } from "@/utils/generate-slug";
import styles from "../LinkBuilder.module.scss";

export const ShortLinkSection = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<LinkBuilderFields>();

  const destinationUrl = watch("destinationUrl");
  const slug = watch("slug");

  useEffect(() => {
    if (!destinationUrl || slug) return;

    const smartSlug = generateSlugFromUrl(destinationUrl);
    setValue("slug", smartSlug, { shouldDirty: false, shouldValidate: true });
  }, [destinationUrl, slug, setValue]);

  const handleShuffle = () => {
    const randomSlug = generateRandomSlug(4);
    setValue("slug", randomSlug);
  };

  const handleSmartShuffle = () => {
    const smartSlug = generateSlugFromUrl(destinationUrl);
    setValue("slug", smartSlug);
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
