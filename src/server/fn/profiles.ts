import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { followUser, unfollowUser } from "../data-access/users.server";

// Follow function
export const followFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      followerId: z.string().cuid("Invalid follower ID"),
      followingId: z.string().cuid("Invalid following ID"),
    })
  )
  .handler(async ({ data: { followerId, followingId } }) => {
    await followUser(followerId, followingId);
    return { success: true };
  });

// Unfollow function
export const unfollowFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      followerId: z.string().cuid("Invalid follower ID"),
      followingId: z.string().cuid("Invalid following ID"),
    })
  )
  .handler(async ({ data: { followerId, followingId } }) => {
    await unfollowUser(followerId, followingId);
    return { success: true };
  });
