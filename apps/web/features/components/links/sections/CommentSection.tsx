"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
  Textarea,
  InfoTooltip,
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
        <div className="labelWithTooltip">
          <FieldLabel htmlFor="comment">Comments</FieldLabel>
          <InfoTooltip content="Use comments to add context to your short links – for you and your team" />
        </div>
        <Textarea
          id="comment"
          placeholder="Add comments"
          rows={4}
          {...register("comments")}
        />
        <FieldError errors={[errors.comments]} />
      </Field>
    </>
  );
};
