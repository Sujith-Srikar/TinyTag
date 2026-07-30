"use client";

import { Field, FieldLabel, FieldError, Input, InfoTooltip } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields, TITLE_MAX_LENGTH } from "@repo/shared";
import styles from "../LinkBuilder.module.scss";

export const TitleSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<LinkBuilderFields>();

  const value = watch("title") ?? "";

  return (
    <div>
      <Field>
        <div className={styles.labelWithTooltip}>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <InfoTooltip content="A short, display-friendly name for your link – shown in place of the full URL on your dashboard" />
        </div>
        <div className={styles.inputWrap}>
          <Input
            id="title"
            maxLength={TITLE_MAX_LENGTH}
            placeholder="e.g. Product Launch"
            {...register("title")}
          />
          <span className={styles.charCount}>
            {value.length}/{TITLE_MAX_LENGTH}
          </span>
        </div>
        <FieldError errors={[errors.title]} />
      </Field>
    </div>
  );
};
