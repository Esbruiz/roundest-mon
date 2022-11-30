import { router } from "../trpc";
import { roundestRouter } from "./roundest";

export const appRouter = router({
  roundest: roundestRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
