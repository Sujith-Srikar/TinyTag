import { createTRPCRouter } from "../init";

import { getRouter } from "./get";
import { postRouter } from './post'

export const appRouter = createTRPCRouter({
    get: getRouter,
    post: postRouter
});

export type AppRouter = typeof appRouter;