import { db } from "@/db/index";
import { fund, fundAnalysis } from "@/db/schema";
import { eq, desc, and, ilike, or } from "drizzle-orm";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Resource } from "sst";
import { qdrant, COLLECTIONS, ensureCollections } from "../services/qdrant";


export type FundData = {
    fundName: string;
    strategy: string;
    recentActivity: string;
    performanceOutlook: string;
    convictionThesis: string;
    holdings: {
        symbol: string;
        name: string;
        percent: number;
    }[];
};

async function generateFundAnalysis(query: string): Promise<FundData> {
    const geminiKey = Resource.GEMINI_API_KEY.value;
    if (!geminiKey) throw new Error("Missing GEMINI_API_KEY");

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        tools: [{ googleSearch: {} } as any],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    fundName: { type: SchemaType.STRING },
                    strategy: { type: SchemaType.STRING },
                    recentActivity: { type: SchemaType.STRING },
                    performanceOutlook: { type: SchemaType.STRING },
                    convictionThesis: { type: SchemaType.STRING },
                    holdings: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                symbol: { type: SchemaType.STRING },
                                name: { type: SchemaType.STRING },
                                percent: { type: SchemaType.NUMBER },
                            },
                        },
                    },
                },
                required: ["fundName", "strategy", "holdings", "recentActivity", "performanceOutlook", "convictionThesis"],
            },
        },
    });

    const prompt = `Search for the latest available 13F portfolio holdings, shareholder letters, and news for "${query}". 
    1. Find the top 5-10 largest holdings by percentage.
    2. Analyze recent 13F changes to identify buying/selling activity.
    3. Look for reasons explaining recent outperformance or underperformance.
    4. Identify the core thesis.
    Return JSON.`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text()) as FundData;
}

export async function getFundAnalysis(fundIdOrName: string, userId?: string) {
    await ensureCollections();

    // 1. Check DB for existing fresh analysis for this user (optional: or global)
    // For now, let's fetch the latest analysis for this fund globally or per user? 
    // The user said "save the fund analysis for that stock or fund", implying persistence.
    // Let's try to find if we have it in Postgres first.

    // Check if fund exists
    let existingFund = await db.query.fund.findFirst({
        where: or(
            ilike(fund.id, `%${fundIdOrName}%`),
            ilike(fund.name, `%${fundIdOrName}%`)
        )
    });

    if (existingFund) {
        // Find latest analysis
        const lastAnalysis = await db.query.fundAnalysis.findFirst({
            where: eq(fundAnalysis.fundId, existingFund.id),
            orderBy: [desc(fundAnalysis.createdAt)]
        });

        if (lastAnalysis) {
            // Fetch payload from Qdrant
            try {
                const points = await qdrant.retrieve(COLLECTIONS.FUNDS, {
                    ids: [lastAnalysis.ragAnalysisId]
                });

                if (points.length > 0) {
                    return points[0].payload as unknown as FundData;
                }
            } catch (e) {
                console.error("Failed to retrieve from Qdrant", e);
            }
        }
    }

    // 2. Generate New Analysis
    const data = await generateFundAnalysis(fundIdOrName);

    // 3. Save to Qdrant
    const pointId = crypto.randomUUID();
    await qdrant.upsert(COLLECTIONS.FUNDS, {
        points: [{
            id: pointId,
            vector: new Array(768).fill(0), // Placeholder vector until we do embeddings suitable for search
            payload: data as any
        }]
    });

    // 4. Save to Postgres
    // Determine the ID to usage. If we matched an existing fund, usage that ID.
    // Otherwise, create a new ID from the search term.
    const targetFundId = existingFund ? existingFund.id : fundIdOrName.toLowerCase();

    // Ensure fund exists
    if (!existingFund) {
        await db.insert(fund).values({
            id: targetFundId, // simple slug
            name: data.fundName
        }).onConflictDoNothing();
    }

    // Only save user-specific analysis snapshot if user is logged in
    await db.insert(fundAnalysis).values({
        userId: userId || null,
        fundId: targetFundId,
        ragAnalysisId: pointId,
        title: `Analysis of ${data.fundName}`
    });

    return data;
}
