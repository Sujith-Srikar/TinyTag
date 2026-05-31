"use client";

import { Field, FieldDescription, FieldLabel, FieldError } from "@repo/ui";
import { Input } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";

export const DestinationSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<LinkBuilderFields>();

  return (
    <>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="destinationUrl">Destination URL</FieldLabel>
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
