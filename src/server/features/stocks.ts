import { db } from "@/db/index";
import { stock, stockAnalysis } from "@/db/schema";
import { eq, ilike, desc, and } from "drizzle-orm";

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

export async function searchStocks(query: string) {
    const dbResults = await db.select()
        .from(stock)
        .where(
            ilike(stock.symbol, `%${query}%`)
        )
        .limit(5);

    return dbResults.map(s => ({
        symbol: s.symbol,
        name: s.name,
    }));
}

export async function getStockAnalysisBySymbol(symbol: string) {
    const globalStock = await db.query.stock.findFirst({
        where: eq(stock.symbol, symbol.toUpperCase())
    });

    if (!globalStock) {
        return null;
    }

    // In real impl, use globalStock.ragAnalysisId to fetch
    return MOCK_DATA[symbol.toUpperCase()] || null;
}

export async function getStockSnapshotsForUser(symbol: string, userId: string) {
    return await db.query.stockAnalysis.findMany({
        where: and(
            eq(stockAnalysis.symbol, symbol.toUpperCase()),
            eq(stockAnalysis.userId, userId)
        ),
        orderBy: [desc(stockAnalysis.createdAt)]
    });
}
