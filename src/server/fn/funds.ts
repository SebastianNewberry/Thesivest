import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getFundAnalysis } from "@/server/features/funds.server";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

export const getFundAnalysisFn = createServerFn({ method: "POST" })
    .inputValidator(z.object({
        fundId: z.string().min(1)
    }))
    .handler(async ({ data }) => {
        const request = getRequest();
        const session = await auth.api.getSession({
            headers: request.headers
        });

        // Pass userId if available, otherwise undefined.
        // The feature function handles logic for saving/not saving based on auth status.
        return await getFundAnalysis(data.fundId, session?.user?.id);
    });
