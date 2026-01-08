import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
    searchStocks,
    getStockAnalysisBySymbol,
    getStockSnapshotsForUser
} from "@/server/features/stocks";

export const searchStocksFn = createServerFn({ method: "POST" })
    .inputValidator(z.object({
        query: z.string().min(1)
    }))
    .handler(async ({ data }) => {
        const { query } = data;
        return await searchStocks(query);
    });

export const getStockAnalysisFn = createServerFn({ method: "GET" })
    .inputValidator(z.object({
        symbol: z.string().min(1)
    }))
    .handler(async ({ data }) => {
        const { symbol } = data;
        return await getStockAnalysisBySymbol(symbol);
    });

export const getStockSnapshotsFn = createServerFn({ method: "GET" })
    .inputValidator(z.object({
        symbol: z.string().min(1),
        userId: z.string().min(1)
    }))
    .handler(async ({ data }) => {
        const { symbol, userId } = data;
        return await getStockSnapshotsForUser(symbol, userId);
    });
