import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function FundSearch() {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);

        // Use View Transition API
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate({ to: "/analysis/fund/$fundId", params: { fundId: query } });
            });
        } else {
            navigate({ to: "/analysis/fund/$fundId", params: { fundId: query } });
        }
    };

    return (
        <section className="py-20 container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">

                    <h2 className="text-3xl md:text-5xl font-heading text-foreground">
                        Decode Any Fund Strategy
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Search for a fund or manager. Our AI analyzes their latest holdings to reverse-engineer their investment thesis.
                    </p>
                </div>

                {/* Search Bar */}
                <Card
                    className="p-2 flex flex-row items-center gap-2 border-primary/20 bg-background/50 backdrop-blur-sm shadow-xl max-w-2xl mx-auto group view-transition-name-[fund-search-container]"
                    style={{ viewTransitionName: "fund-search-container" } as any}
                >
                    <Search className="w-5 h-5 text-muted-foreground ml-3 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search e.g. 'Ark Innovation', 'Berkshire', 'Bridgewater'..."
                        className="border-none shadow-none focus-visible:ring-0 text-lg py-6 bg-transparent view-transition-name-[fund-search-box]"
                        style={{ viewTransitionName: "fund-search-box" } as any}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
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
            </div>
        </section>
    );
}

