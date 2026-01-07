import { createFileRoute } from "@tanstack/react-router";
import { getStockAnalysis, getUserStockSnapshots } from "@/server/features/stocks";
import { useLoaderData } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Scale, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/analysis/$symbol")({
    loader: async ({ params: { symbol } }) => {
        const analysis = await getStockAnalysis({ data: symbol });
        // TODO: In real app, get userId from context and fetch snapshots
        // const snapshots = await getUserStockSnapshots({ data: { symbol, userId: 'current-user' } });
        return { symbol, analysis };
    },
    component: AnalysisPage,
});

function AnalysisPage() {
    const { symbol, analysis } = useLoaderData({ from: "/analysis/$symbol" });

    if (!analysis) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Stock Not Found</h1>
                <p className="text-muted-foreground">We couldn't find an analysis for {symbol}.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                {/* Header with View Transition Name */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1
                                className="text-4xl lg:text-5xl font-bold font-heading view-transition-name-[search-box]"
                                style={{ viewTransitionName: "search-box" } as any}
                            >
                                {analysis.symbol}
                            </h1>
                            <Badge variant="outline" className="text-lg px-3 py-1">{analysis.companyName}</Badge>
                        </div>
                        <p className="text-muted-foreground mt-2 max-w-2xl">{analysis.businessSummary}</p>
                    </div>
                    <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                        <BrainCircuit className="w-4 h-4" />
                        AI Generated Analysis
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Moat Analysis */}
                    <Card className="p-6 bg-card border-border/60">
                        <div className="flex items-center gap-2 mb-4 text-blue-500">
                            <Scale className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-wider text-sm">Economic Moat</h4>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{analysis.moatAnalysis}</p>
                    </Card>

                    {/* Growth Catalysts */}
                    <Card className="p-6 bg-card border-border/60">
                        <div className="flex items-center gap-2 mb-4 text-green-500">
                            <TrendingUp className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-wider text-sm">Growth Catalysts</h4>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{analysis.growthCatalysts}</p>
                    </Card>

                    {/* Key Risks */}
                    <Card className="p-6 bg-card border-border/60">
                        <div className="flex items-center gap-2 mb-4 text-red-500">
                            <AlertTriangle className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-wider text-sm">Key Risks</h4>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{analysis.keyRisks}</p>
                    </Card>

                    {/* Financials & Valuation */}
                    <Card className="p-6 bg-card border-border/60">
                        <div className="flex items-center gap-2 mb-4 text-purple-500">
                            <Activity className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-wider text-sm">Financials & Valuation</h4>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs font-semibold text-foreground uppercase block mb-1">Health</span>
                                <p className="text-muted-foreground text-sm">{analysis.financialHealth}</p>
                            </div>
                            <div className="pt-4 border-t border-border/40">
                                <span className="text-xs font-semibold text-foreground uppercase block mb-1">Valuation Context</span>
                                <p className="text-muted-foreground text-sm">{analysis.valuationCommentary}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
