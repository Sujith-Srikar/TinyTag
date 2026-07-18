"use client";

import {
  Field,
  FieldLabel,
  FieldError,
  Textarea,
  InfoTooltip,
} from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";
import styles from "../LinkBuilder.module.scss";

export const CommentSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<LinkBuilderFields>();

  return (
    <div>
      <Field>
        <div className={styles.labelWithTooltip}>
          <FieldLabel htmlFor="comment">Comments</FieldLabel>
          <InfoTooltip content="Use comments to add context to your short links – for you and your team" />
        </div>
        <Textarea
          id="comment"
          placeholder="Add comments"
          rows={3}
          {...register("comments")}
        />
        <FieldError errors={[errors.comments]} />
      </Field>
    </div>
  );
};
