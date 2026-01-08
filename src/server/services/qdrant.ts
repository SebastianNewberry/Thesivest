import { QdrantClient } from "@qdrant/js-client-rest";
import { Resource } from "sst";

// Initialize Qdrant Client
// Using Resource from SST or fallback to process.env if needed (though Resource is preferred in this stack)
const qdrantUrl = Resource.QDRANT_API_URL.value;
const qdrantKey = Resource.QDRANT_API_KEY.value;

if (!qdrantUrl) {
    console.warn("QDRANT_API_URL is not set. Vector search features will be disabled.");
}

export const qdrant = new QdrantClient({
    url: qdrantUrl,
    apiKey: qdrantKey,
});

export const COLLECTIONS = {
    STOCKS: "stocks",
    FUNDS: "funds",
} as const;

export async function ensureCollections() {
    try {
        const collections = await qdrant.getCollections();
        const names = collections.collections.map((c) => c.name);

        if (!names.includes(COLLECTIONS.STOCKS)) {
            await qdrant.createCollection(COLLECTIONS.STOCKS, {
                vectors: {
                    size: 768, // Gemini Embedding Dimension
                    distance: "Cosine",
                },
            });
            console.log(`Created collection: ${COLLECTIONS.STOCKS}`);
        }

        if (!names.includes(COLLECTIONS.FUNDS)) {
            await qdrant.createCollection(COLLECTIONS.FUNDS, {
                vectors: {
                    size: 768, // Gemini Embedding Dimension
                    distance: "Cosine",
                },
            });
            console.log(`Created collection: ${COLLECTIONS.FUNDS}`);
        }
    } catch (error) {
        console.error("Error ensuring Qdrant collections:", error);
    }
}
