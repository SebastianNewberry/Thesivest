import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getCommunityPosts,
  getContributors,
  getContributorAnalyses,
  searchCommunityPosts,
} from "../features/contributors.server";

export const getContributorsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return getContributors();
  }
);

export const getContributorAnalysesFn = createServerFn({
  method: "GET",
}).handler(async () => {
  return getContributorAnalyses(6);
});

// Server Function - Fetch Posts + Users (for author info)
export const getCommunityDataFn = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      data: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const limit = 20;
    const postsPromise = data?.data
      ? searchCommunityPosts(data.data, limit)
      : getCommunityPosts(limit);

    const [posts, users] = await Promise.all([postsPromise, getContributors()]);
    return { posts, users };
  });
