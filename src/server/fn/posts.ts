import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getPostById,
  getContributorById,
} from "../features/contributors.server";

// Server Function to get post details
export const getPostFn = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const post = await getPostById(data.id);

    if (!post) {
      return null;
    }

    const member = await getContributorById(post.userId);

    return { post, member };
  });
