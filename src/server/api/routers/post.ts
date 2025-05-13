import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    // TODO: Properly type ctx.db.query if possible
    const dbQuery = ctx.db.query;
    function hasPosts(obj: unknown): obj is { posts: unknown } {
      return typeof obj === "object" && obj !== null && "posts" in obj;
    }
    function hasFindFirst(
      obj: unknown,
    ): obj is { findFirst: (...args: unknown[]) => Promise<unknown> } {
      return (
        typeof obj === "object" &&
        obj !== null &&
        "findFirst" in obj &&
        typeof (obj as { findFirst?: unknown }).findFirst === "function"
      );
    }
    if (hasPosts(dbQuery)) {
      const postsQuery = dbQuery.posts;
      if (hasFindFirst(postsQuery)) {
        return postsQuery.findFirst({
          orderBy: (
            posts: unknown,
            { desc }: { desc: (field: unknown) => unknown },
          ) => [
            desc(
              typeof posts === "object" &&
                posts !== null &&
                "createdAt" in posts
                ? (posts as { createdAt: unknown }).createdAt
                : undefined,
            ),
          ],
        });
      }
    }
    return null;
  }),
});
