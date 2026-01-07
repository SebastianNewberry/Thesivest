import { db } from "@/db/index";
import { stock, stockAnalysis } from "@/db/schema";
import { eq, ilike, desc, and } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";

export interface StockData {
    symbol: string;
    companyName: string;
    businessSummary: string;
    moatAnalysis: string;
    growthCatalysts: string;
    keyRisks: string;
    financialHealth: string;
    valuationCommentary: string;
}

// Temporary mock data generator until RAG is connected
const MOCK_DATA: Record<string, StockData> = {
    AAPL: {
        symbol: "AAPL",
        companyName: "Apple Inc.",
        businessSummary: "Premium consumer electronics and services ecosystem.",
        moatAnalysis: "Wide Moat: High switching costs, brand power.",
        growthCatalysts: "Services revenue, Wearables, potential AI integration.",
        keyRisks: "Regulatory risks, China exposure, slow iPhone growth.",
        financialHealth: "Fortress balance sheet, massive cash pile.",
        valuationCommentary: "Trading at premium multiple, justified by quality."
    }
};

export const searchStock = createServerFn({ method: "POST" })
    .validator((data: string) => data)
    .handler(async ({ data: query }) => {
        // 1. Fuzzy search in DB
        const dbResults = await db.select()
            .from(stock)
            .where(
                ilike(stock.symbol, `%${query}%`)
                // OR ilike(stock.name, `%${query}%`) // If name column exists and populated
            )
            .limit(5);

        // Map to simpler structure
        return dbResults.map(s => ({
            symbol: s.symbol,
            name: s.name,
        }));
    });


export const getStockAnalysis = createServerFn({ method: "GET" })
    .validator((symbol: string) => symbol)
    .handler(async ({ data: symbol }) => {
        // 1. Check if we have a global analysis in 'stock' table
        const globalStock = await db.query.stock.findFirst({
            where: eq(stock.symbol, symbol.toUpperCase())
        });

        if (!globalStock) {
            return null;
        }

        // 2. Fetch the actual content from RAG DB (Mocked for now)
        // In real impl, we'd use globalStock.ragAnalysisId to fetch from Vector/RAG DB

        // Return mock data for now or empty structure
        return MOCK_DATA[symbol.toUpperCase()] || null;
    });

export const getUserStockSnapshots = createServerFn({ method: "GET" })
    .validator((data: { symbol: string, userId: string }) => data)
    .handler(async ({ data }) => {
        const snapshots = await db.query.stockAnalysis.findMany({
            where: and(
                eq(stockAnalysis.symbol, data.symbol.toUpperCase()),
                eq(stockAnalysis.userId, data.userId)
            ),
            orderBy: [desc(stockAnalysis.createdAt)]
        });
        return snapshots;
    });
