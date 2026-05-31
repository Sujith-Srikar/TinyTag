"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
  Textarea,
} from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";

export const CommentSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<LinkBuilderFields>();

  return (
    <>
      <Field>
        <FieldLabel htmlFor="comment">Comments</FieldLabel>
        <Textarea
          id="comment"
          placeholder="Add internal notes or campaign context"
          rows={4}
          {...register("comments")}
        />
        <FieldError errors={[errors.comments]} />
      </Field>
    </>
  );
};
