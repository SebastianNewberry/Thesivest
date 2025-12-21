/**
 * Shared Logic for Thesivest (Under the Radar Stacks)
 * This lives on the server and is called by both the Public API and the App Loader.
 */

export interface Thesis {
    id: string;
    title: string;
    symbol: string;
    price: number;
    marketCap: string;
    catalyst: string;
    conviction: "High" | "Medium" | "Low";
    description: string;
    postedAt: string;
}

// Mock data for now - in a real app this would query the DB
const MOCK_THESES: Thesis[] = [
    {
        id: "1",
        title: "Next-Gen Bio-Plastics",
        symbol: "PLST",
        price: 12.45,
        marketCap: "150M",
        catalyst: "EU Regulation 2025 banning single-use",
        conviction: "High",
        description: "Small cap chemical firm with patented biodegradable polymer receiving major OEM interest.",
        postedAt: "2h ago",
    },
    {
        id: "2",
        title: "AI Infrastructure Power",
        symbol: "GRID",
        price: 45.20,
        marketCap: "800M",
        catalyst: "Data center expansion in Nordic region",
        conviction: "Medium",
        description: "Utility provider with exclusive renewable contracts for new hyperscale data centers.",
        postedAt: "5h ago",
    },
    {
        id: "3",
        title: "Cobalt-Free Batteries",
        symbol: "IONZ",
        price: 8.90,
        marketCap: "95M",
        catalyst: "Breakthrough lab results published",
        conviction: "High",
        description: "Deep-tech startup identifying new cathode material that eliminates cobalt dependency.",
        postedAt: "1d ago",
    },
    {
        id: "4",
        title: "Space Debris Removal",
        symbol: "CLNR",
        price: 15.60,
        marketCap: "220M",
        catalyst: "NASA Contract Award",
        conviction: "Low",
        description: "Early stage aerospace play securing first gov contracts for LEO cleanup.",
        postedAt: "2d ago",
    },
];

export async function getUnderRadarTheses(): Promise<Thesis[]> {
    // Simulate DB Delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return MOCK_THESES;
}
