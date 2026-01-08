import { createFileRoute } from "@tanstack/react-router";
import { FundResearch } from "@/components/FundResearch";

export const Route = createFileRoute("/funds")({
    component: FundResearch,
});
