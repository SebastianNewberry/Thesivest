import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { searchStocksFn } from "@/server/fn/stocks";
import { useNavigate } from "@tanstack/react-router";

interface Stock {
    symbol: string;
    name: string;
}

export function StockSearch() {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<Stock[] | null>(null);
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError("");

        // Use View Transition API if available
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate({ to: "/analysis/$symbol", params: { symbol: query } });
            });
        } else {
            navigate({ to: "/analysis/$symbol", params: { symbol: query } });
        }
    };

    return (
        <section className="py-12 container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-5xl font-heading text-foreground">
                        Institutional-Grade Stock Analysis
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Deep dive into any company. Our AI analyzes business quality, moats, and valuation in seconds.
                    </p>
                </div>

                {/* Search Bar */}
                <Card className="p-2 flex flex-row items-center gap-2 border-primary/20 bg-background/50 backdrop-blur-sm shadow-xl max-w-2xl mx-auto group">
                    <Search className="w-5 h-5 text-muted-foreground ml-3 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search ticker e.g. 'AAPL', 'MSFT', 'NVDA'..."
                        className="border-none shadow-none focus-visible:ring-0 text-lg py-6 bg-transparent flex-1 view-transition-name-[search-box]"
                        style={{ viewTransitionName: "search-box" } as any}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button
                        size="lg"
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="rounded-lg px-8 font-semibold"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
                    </Button>
                </Card>

                {/* Error State */}
                {error && (
                    <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
