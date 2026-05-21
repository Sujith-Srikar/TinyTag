import { initTRPC } from "@trpc/server";

type RouteMeta = {
  name?: string;

  docs?: {
    description?: string;
    tags?: string[];
    deprecated?: boolean;
    auth?: boolean;
    roles?: string[];
  };
};

const t = initTRPC.meta<RouteMeta>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;