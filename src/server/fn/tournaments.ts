import { createServerFn } from "@tanstack/react-start";
import { getTournaments } from "../features/tournaments.server";

export const getTournamentsFn = createServerFn({ method: 'GET' }).handler(async () => {
  return getTournaments();
});
