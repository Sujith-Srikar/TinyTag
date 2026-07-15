"use client";

import { Field, FieldLabel, FieldError, Input, InfoTooltip } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";
import styles from "../LinkBuilder.module.scss";

export const DestinationSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<LinkBuilderFields>();

  return (
    <>
      <Field>
        <div className={styles.labelWithTooltip}>
          <FieldLabel htmlFor="destinationUrl">Destination URL</FieldLabel>
          <InfoTooltip content="The URL your users will get redirected to when they visit your short link." />
        </div>
        <Input
          id="destinationUrl"
          type="url"
          placeholder="https://example.com/your/long/url"
          {...register("destinationUrl")}
        />
        <FieldError errors={[errors.destinationUrl]} />
      </Field>
    </>
  );
};
