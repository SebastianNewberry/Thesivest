import { createServerFn } from "@tanstack/react-start";
import { getContributors, getContributorAnalyses } from "../features/contributors.server";

export const getContributorsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return getContributors();
  }
);

export const getContributorAnalysesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return getContributorAnalyses(6);
  }
);
