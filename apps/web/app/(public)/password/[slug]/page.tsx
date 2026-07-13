"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldLabel, FieldError, Input, Button } from "@repo/ui";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const PasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type PasswordValues = z.infer<typeof PasswordSchema>;

export default function PasswordPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const trpc = useTRPC();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(PasswordSchema),
  });

  const verifyPassword = useMutation(
    trpc.post.verifyPassword.mutationOptions({
      onSuccess: (data) => {
        router.push(data.redirectUrl);
      },
      onError: (err) => {
        setServerError(err.message || "Invalid password. Please try again.");
      },
    }),
  );

  const onSubmit = (data: PasswordValues) => {
    setServerError(null);
    verifyPassword.mutate({ slug, password: data.password });
  };

  return (
    <main className="fixed inset-0 bg-background z-[9999] flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-surface border border-border rounded-lg p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className="text-4xl">&#128274;</div>
            <h1 className="text-heading-md font-semibold text-foreground">
              Password Required
            </h1>
            <p className="text-sm text-muted-foreground">
              This link is password protected. Enter the password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <p className="text-sm text-destructive text-center">{serverError}</p>
            )}

            <Field>
              <FieldLabel htmlFor="password" className="sr-only">
                Password
              </FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                autoComplete="current-password"
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
