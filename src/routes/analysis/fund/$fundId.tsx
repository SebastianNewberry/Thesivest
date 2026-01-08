import { createFileRoute, useLoaderData, defer, Await } from '@tanstack/react-router'
import { getFundAnalysisFn } from '@/server/fn/funds'
import { useState, Suspense, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/analysis/fund/$fundId')({
    loader: async ({ params }) => {
        // Defer the slow analysis generation to allow immediate navigation/transition
        const analysisPromise = getFundAnalysisFn({ data: { fundId: params.fundId } });
        return {
            fundId: params.fundId,
            analysisPromise: defer(analysisPromise)
        };
    },
    component: RouteComponent,
})

// Icons
const BrainCircuit = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 3 2.5 2.5 0 0 0 .5 2.97 2.5 2.5 0 0 0-.5 2.97 2.5 2.5 0 0 0 1.32 3 2.5 2.5 0 0 0 1.98 3 2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 4.96.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-3 2.5 2.5 0 0 0-.5-2.97 2.5 2.5 0 0 0 .5-2.97 2.5 2.5 0 0 0-1.32-3 2.5 2.5 0 0 0-1.98-3 2.5 2.5 0 0 0-4.96.46Z" /><path d="M2 16h.01" /><path d="M22 16h.01" /><path d="M5 11h.01" /><path d="M19 11h.01" /></svg>
)
const Send = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
)
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
)

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse rounded-md bg-muted/20 ${className}`} />
)

function BentoGrid({ analysis }: { analysis: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 fade-in animate-in duration-500">
            {/* Strategy Card */}
            <Card className="md:col-span-1 lg:col-span-1 bg-primary/5 border-primary/20 shadow-none py-8">
                <CardHeader className="px-8 pb-4">
                    <CardTitle className="text-lg font-medium text-foreground/80">Investment Strategy</CardTitle>
                </CardHeader>
                <CardContent className="px-8">
                    <p className="text-2xl font-medium text-primary leading-tight">
                        {analysis.strategy}
                    </p>
                </CardContent>
            </Card>

            {/* Conviction Thesis - Large Card */}
            <Card className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-background to-accent/5 shadow-none py-8">
                <CardHeader className="px-8 pb-4">
                    <CardTitle className="text-lg font-medium text-foreground/80">Core Thesis</CardTitle>
                </CardHeader>
                <CardContent className="px-8">
                    <p className="text-lg leading-relaxed text-foreground/90">
                        {analysis.convictionThesis}
                    </p>
                </CardContent>
            </Card>

            {/* Performance Outlook */}
            <Card className="md:col-span-1 lg:col-span-2 bg-card shadow-sm py-8">
                <CardHeader className="px-8 pb-4">
                    <CardTitle className="text-lg font-medium text-foreground/80">Performance Outlook</CardTitle>
                </CardHeader>
                <CardContent className="px-8">
                    <p className="text-muted-foreground leading-relaxed">
                        {analysis.performanceOutlook}
                    </p>
                </CardContent>
            </Card>

            {/* Top Holdings */}
            <Card className="md:col-span-1 lg:row-span-2 h-fit shadow-sm py-8">
                <CardHeader className="px-8 pb-4">
                    <CardTitle className="text-lg font-medium text-foreground/80">Top Holdings</CardTitle>
                </CardHeader>
                <CardContent className="px-8">
                    <div className="space-y-4">
                        {analysis.holdings.map((holding: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span className="font-semibold group-hover:text-primary transition-colors truncate text-base">{holding.symbol}</span>
                                    <span className="text-sm text-muted-foreground truncate">{holding.name}</span>
                                </div>
                                <div className="text-right whitespace-nowrap">
                                    <span className="font-mono font-bold text-primary text-lg">{holding.percent}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="md:col-span-2 lg:col-span-3 shadow-none bg-accent/5 border-none py-8">
                <CardHeader className="px-8 pb-4">
                    <CardTitle className="text-lg font-medium text-foreground/80">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="px-8">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {analysis.recentActivity}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            <div className="md:col-span-1 lg:col-span-1 h-48 rounded-xl bg-muted/20 animate-pulse border border-border/50" />
            <div className="md:col-span-1 lg:col-span-2 h-48 rounded-xl bg-muted/20 animate-pulse border border-border/50" />
            <div className="md:col-span-1 lg:col-span-2 h-64 rounded-xl bg-muted/20 animate-pulse border border-border/50" />
            <div className="md:col-span-1 lg:row-span-2 h-96 rounded-xl bg-muted/20 animate-pulse border border-border/50" />
            <div className="md:col-span-2 lg:col-span-3 h-48 rounded-xl bg-muted/20 animate-pulse border border-border/50" />
        </div>
    )
}

function ChatInterface({ fundId, analysisPromise }: { fundId: string, analysisPromise: Promise<any> }) {
    const [messages, setMessages] = useState<any[]>([
        { role: 'user', content: `Analyze ${fundId}` }
    ]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(true);

    // Initial AI Response Handler
    useEffect(() => {
        // Reset state when fundId changes (new navigation)
        setMessages([{ role: 'user', content: `Analyze ${fundId}` }]);
        setIsThinking(true);

        // Wait for analysis to resolve then add the assistant message
        analysisPromise.then((analysis) => {
            setMessages(prev => {
                // Prevent duplicate initialization if strict mode double-invokes
                if (prev.length > 1) return prev;
                return [
                    ...prev,
                    { role: 'assistant', content: `I've analyzed ${analysis.fundName}. Based on their latest 13F filings, I've extracted their top holdings, recent buying activity, and core investment thesis. What specific details would you like to dig into?` }
                ]
            });
            setIsThinking(false);
        }).catch(() => {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `I encountered an issue analyzing ${fundId}. Please try again.` }
            ]);
            setIsThinking(false);
        });
    }, [fundId, analysisPromise]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setInput("");
    };

    return (
        <div
            className="w-[450px] flex flex-col border-l border-border bg-muted/10 shadow-xl view-transition-name-[fund-search-container] z-10"
            style={{ viewTransitionName: "fund-search-container" } as any}
        >
            {/* Chat Header */}
            <div className="p-4 border-b bg-background/50 backdrop-blur flex items-center gap-2 text-primary font-medium shadow-sm">
                <BrainCircuit className="w-5 h-5" />
                <span>AI Analyst</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border shadow-sm rounded-tl-sm'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex gap-3 flex-row">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground animate-pulse">
                            <BrainCircuit className="w-5 h-5" />
                        </div>
                        <div className="p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] bg-card border shadow-sm rounded-tl-sm italic text-muted-foreground animate-pulse">
                            Analyzing relevant documents...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t">
                <div className="relative flex items-center bg-muted/50 rounded-xl border border-input focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all">
                    <input
                        className="flex-1 bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground outline-none min-w-0"
                        placeholder="Ask follow-up questions..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button
                        onClick={handleSend}
                        variant={"outline"}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <div className="text-[10px] text-center text-muted-foreground mt-2">
                    AI can make mistakes. Verify important info.
                </div>
            </div>
        </div>
    )
}

function RouteComponent() {
    const { fundId, analysisPromise } = useLoaderData({ from: '/analysis/fund/$fundId' })

    return (
        <div className="h-[calc(100vh-90px)] w-full flex bg-background text-foreground font-sans overflow-hidden">
            {/* Left Panel: Analysis Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto min-w-0">
                <div className="p-4 w-full space-y-6">
                    {/* Header Section */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <h1
                                className="text-4xl lg:text-6xl font-bold font-heading tracking-tight text-primary view-transition-name-[fund-search-box]"
                                style={{ viewTransitionName: "fund-search-box" } as any}
                            >
                                {fundId}
                            </h1>
                        </div>
                        <Suspense fallback={<div className="h-6 w-64 bg-muted/20 animate-pulse rounded" />}>
                            <Await promise={analysisPromise}>
                                {(analysis) => (
                                    <p className="text-xl text-muted-foreground font-light max-w-3xl fade-in animate-in">
                                        {analysis.fundName}
                                    </p>
                                )}
                            </Await>
                        </Suspense>
                    </div>

                    {/* Main Content Grid */}
                    <Suspense fallback={<LoadingSkeleton />}>
                        <Await promise={analysisPromise}>
                            {(analysis) => <BentoGrid analysis={analysis} />}
                        </Await>
                    </Suspense>
                </div>
            </div>

            {/* Right Panel: AI Chat (Fixed) */}
            <ChatInterface fundId={fundId} analysisPromise={analysisPromise} />
        </div>
    )
}
