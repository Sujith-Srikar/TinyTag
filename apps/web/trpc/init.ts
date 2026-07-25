import { initTRPC, TRPCError } from "@trpc/server";
import { ContextType } from "./context";
import superjson from "superjson";

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

const t = initTRPC.meta<RouteMeta>().context<ContextType>().create({
  transformer: superjson
});

const isAuthenticated = t.middleware(({ctx, next}) => {
  if(!ctx.user) throw new TRPCError({code: 'UNAUTHORIZED', message: 'Your unauthorized to perform this operation'});
  return next({ctx: {user: ctx.user}});
})

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);