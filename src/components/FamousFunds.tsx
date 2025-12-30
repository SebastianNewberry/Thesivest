import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, PieChart, TrendingUp, Building2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

const FUNDS = [
    {
        id: "berkshire",
        name: "Berkshire Hathaway",
        manager: "Warren Buffett",
        strategy: "Long-Term Value",
        holdings: ["AAPL", "BAC", "AXP", "KO", "CVX"],
        color: "from-blue-900 to-slate-900",
        icon: Building2,
        return: "+15.8% YTD"
    },
    {
        id: "bridgewater",
        name: "Bridgewater Assoc.",
        manager: "Ray Dalio (Founder)",
        strategy: "Global Macro",
        holdings: ["IVV", "IEMG", "GOOGL", "META", "PEP"],
        color: "from-amber-900 to-stone-900",
        icon: PieChart,
        return: "+8.2% YTD"
    },
    {
        id: "renaissance",
        name: "Renaissance Tech",
        manager: "Peter Brown",
        strategy: "Quant / HFT",
        holdings: ["NVO", "META", "PLTR", "VRTX", "GILD"],
        color: "from-emerald-900 to-teal-900",
        icon: TrendingUp,
        return: "+22.4% YTD"
    },
    {
        id: "ark",
        name: "ARK Invest",
        manager: "Cathie Wood",
        strategy: "Disruptive Innovation",
        holdings: ["TSLA", "COIN", "ROKU", "U", "ZM"],
        color: "from-purple-900 to-indigo-900",
        icon: TrendingUp,
        return: "+45.1% YTD"
    }
];

export function FamousFunds() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Institutional Intelligence</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-foreground leading-tight">
                            Track the Giants.
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Don't just guess. See what the world's most successful funds are buying and selling based on public 13F filings.
                        </p>
                    </div>
                    <Link to="/funds" className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                        View All Funds
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FUNDS.map((fund) => (
                        <Card key={fund.id} className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className={`h-2 w-full bg-gradient-to-r ${fund.color}`} />
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground/80">
                                        <fund.icon className="w-5 h-5" />
                                    </div>
                                    <Badge variant="outline" className="font-mono text-xs bg-background/50">
                                        {fund.return}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-serif">{fund.name}</CardTitle>
                                <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                                    {fund.manager}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <div className="text-xs text-muted-foreground mb-1">Strategy</div>
                                    <div className="font-medium text-sm">{fund.strategy}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-muted-foreground mb-2 flex justify-between items-center">
                                        <span>Top Holdings</span>
                                        <span className="text-[10px] opacity-70">13F Q3 '24</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {fund.holdings.map(ticker => (
                                            <Badge key={ticker} variant="secondary" className="text-[10px] font-mono hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                                                {ticker}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
