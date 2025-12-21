import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, ReferenceArea } from 'recharts'
import { Card } from './ui/card'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion, AnimatePresence } from 'motion/react'
import { Check, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const getAxisTicks = (min: number, max: number) => {
    const ticks: number[] = []
    const start = new Date(min)
    const diff = max - min
    const ONE_DAY = 24 * 60 * 60 * 1000

    // Safety check
    if (diff <= 0) return [min]

    if (diff > ONE_DAY * 365 * 5) {
        // > 5 Years: Show Years (Jan 1)
        let d = new Date(start.getFullYear(), 0, 1)
        if (d.getTime() < min) d.setFullYear(d.getFullYear() + 1)
        while (d.getTime() <= max) {
            ticks.push(d.getTime())
            d.setFullYear(d.getFullYear() + 1)
        }
    } else if (diff > ONE_DAY * 180) {
        // > 6 Months: Show Quarters (Jan, Apr, Jul, Oct)
        let y = start.getFullYear()
        // 0->0, 1->0, 2->0 (Q1); 3->3 (Q2)...
        let m = Math.floor(start.getMonth() / 3) * 3
        let d = new Date(y, m, 1)
        // If before min, move to next quarter
        if (d.getTime() < min) d.setMonth(d.getMonth() + 3)
        while (d.getTime() <= max) {
            ticks.push(d.getTime())
            d.setMonth(d.getMonth() + 3)
        }
    } else if (diff > ONE_DAY * 60) {
        // > 2 Months: Show Months
        let d = new Date(start.getFullYear(), start.getMonth(), 1)
        if (d.getTime() < min) d.setMonth(d.getMonth() + 1)
        while (d.getTime() <= max) {
            ticks.push(d.getTime())
            d.setMonth(d.getMonth() + 1)
        }
    } else {
        // Days
        // If range is large (e.g. 60 days), 60 ticks is okay for 1800px width.
        let d = new Date(start.getFullYear(), start.getMonth(), start.getDate())
        if (d.getTime() < min) d.setDate(d.getDate() + 1)
        while (d.getTime() <= max) {
            ticks.push(d.getTime())
            d.setDate(d.getDate() + 1)
        }
    }

    // If no semantic ticks found (e.g. range smaller than a day?), just showing start/end
    if (ticks.length === 0) return [min, max]

    return ticks
}


// --- Data Generation & Config ---

const TIME_RANGES = ['1M', '3M', '6M', 'YTD', '1Y', '3Y'] as const
type TimeRange = typeof TIME_RANGES[number]

type SeriesConfig = {
    id: string
    label: string
    color: string
    type: 'area' | 'line' | 'dashed'
    isBenchmark?: boolean
}

const SERIES: SeriesConfig[] = [
    { id: 'portfolio', label: 'Thesivest', color: 'var(--color-primary)', type: 'area' },
    { id: 'sp500', label: 'S&P 500', color: 'var(--color-foreground)', type: 'line', isBenchmark: true },
    { id: 'nasdaq', label: 'NASDAQ', color: '#a855f7', type: 'dashed', isBenchmark: true }, // Purple-500
    { id: 'russell', label: 'Russell 2000', color: '#eab308', type: 'dashed', isBenchmark: true }, // Yellow-500
    { id: 'nvda', label: 'NVDA', color: '#22c55e', type: 'line' }, // Green-500
    { id: 'tsla', label: 'TSLA', color: '#ef4444', type: 'line' }, // Red-500
    { id: 'pltr', label: 'PLTR', color: '#3b82f6', type: 'line' }, // Blue-500
]

const GENERATE_OHLC = (points: number, _daysBack: number, intervalMinutes: number = 1440) => {
    let portfolio = 100
    // Benchmarks (Simple line data for now)
    let sp500 = 100
    let nasdaq = 100
    let russell = 100
    let nvda = 100
    let tsla = 100
    let pltr = 100

    // Create data points ending today
    const now = new Date()
    const result = []

    // Volatility Scaling
    // Daily (1440m) = Base Vol (~1-2%)
    // Hourly (60m) = Vol / sqrt(24)
    const volScale = Math.sqrt(intervalMinutes / 1440)

    for (let i = 0; i < points; i++) {
        // OHLC for Portfolio
        const open = portfolio
        // Random walk
        const drift = 0.0005 * volScale // Slight upward drift
        const shock = (Math.random() - 0.5) * 0.04 * volScale
        const close = open * (1 + drift + shock)

        const high = Math.max(open, close) * (1 + Math.random() * 0.01 * volScale)
        const low = Math.min(open, close) * (1 - Math.random() * 0.01 * volScale)

        portfolio = close

        // Others (drift only)
        sp500 *= 1 + (Math.random() * 0.02 - 0.008) * volScale
        nasdaq *= 1 + (Math.random() * 0.025 - 0.01) * volScale
        russell *= 1 + (Math.random() * 0.03 - 0.014) * volScale
        nvda *= 1 + (Math.random() * 0.05 - 0.02) * volScale
        tsla *= 1 + (Math.random() * 0.06 - 0.03) * volScale
        pltr *= 1 + (Math.random() * 0.04 - 0.018) * volScale

        // Calculate date
        const date = new Date(now)
        // Adjust time based on interval
        const minutesOffset = (i - points) * intervalMinutes
        date.setMinutes(date.getMinutes() + minutesOffset)

        result.push({
            date: date.getTime(),
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2)),
            portfolio: Math.round(close), // Legacy field for Area Chart
            sp500: Math.round(sp500),
            nasdaq: Math.round(nasdaq),
            russell: Math.round(russell),
            nvda: Math.round(nvda),
            tsla: Math.round(tsla),
            pltr: Math.round(pltr),
        })
    }
    return result
}

// Prefetch/Generate data for ranges
// Prefetch/Generate data for ranges
const DATA_SETS: Record<TimeRange, any[]> = {
    '1M': GENERATE_OHLC(180, 30, 240), // 4h candles -> 30 days
    '3M': GENERATE_OHLC(90, 90, 1440), // Daily -> 90 days
    '6M': GENERATE_OHLC(180, 180, 1440),
    'YTD': GENERATE_OHLC(250, 200, 1440),
    '1Y': GENERATE_OHLC(365, 365, 1440),
    '3Y': GENERATE_OHLC(550, 365 * 3, 1440 * 2), // 2-Day candles -> ~3 Years
}

export function HeroChart() {
    const [timeRange, setTimeRange] = useState<TimeRange | null>('1Y')
    const [activeSeries, setActiveSeries] = useState<Set<string>>(new Set(['portfolio', 'sp500']))

    // Master Data Source (Max history available) used for all views
    const currentData = DATA_SETS['3Y']

    // Helper to calculate start date for ranges
    const getStartDateForRange = (range: TimeRange, endDate: number) => {
        const end = new Date(endDate)
        const start = new Date(endDate)
        switch (range) {
            case '1M': start.setMonth(end.getMonth() - 1); break;
            case '3M': start.setMonth(end.getMonth() - 3); break;
            case '6M': start.setMonth(end.getMonth() - 6); break;
            case 'YTD': start.setMonth(0, 1); break; // Jan 1 of current year
            case '1Y': start.setFullYear(end.getFullYear() - 1); break;
            case '3Y': start.setFullYear(end.getFullYear() - 3); break;
        }
        return start.getTime()
    }

    // Zoom State - Initialize to 1Y view
    const [left, setLeft] = useState<string | number>(() => {
        const lastDate = currentData[currentData.length - 1].date
        return getStartDateForRange('1Y', lastDate)
    })
    const [right, setRight] = useState<string | number>('dataMax') // Always pin to right initially

    // ... refs ...
    const [refAreaLeft, setRefAreaLeft] = useState<string | number | null>(null)
    const [refAreaRight, setRefAreaRight] = useState<string | number | null>(null)
    const [preZoomState, setPreZoomState] = useState<{ left: string | number, right: string | number, timeRange: TimeRange | null } | null>(null)

    // Calculate current return for the main portfolio
    // If zoomed, use data from the visible range
    const percentageReturn = useMemo(() => {
        if (!currentData.length) return 0

        let startVal = currentData[0].portfolio
        let endVal = currentData[currentData.length - 1].portfolio

        const minTime = left === 'dataMin' ? currentData[0].date : (left as number)
        const maxTime = right === 'dataMax' ? currentData[currentData.length - 1].date : (right as number)

        // Find data points closest to the visible window
        const startItem = currentData.find(d => d.date >= minTime)

        let endItem = currentData[currentData.length - 1]
        if (right !== 'dataMax') {
            for (let i = currentData.length - 1; i >= 0; i--) {
                if (currentData[i].date <= maxTime) {
                    endItem = currentData[i]
                    break
                }
            }
        }

        if (startItem) startVal = startItem.portfolio
        if (endItem) endVal = endItem.portfolio

        if (startVal === 0) return 0

        return ((endVal - startVal) / startVal) * 100
    }, [currentData, left, right])

    // Dynamic Y-Axis Scale
    const yDomain = useMemo(() => {
        let visibleData = currentData
        if (left !== 'dataMin' && right !== 'dataMax') {
            visibleData = currentData.filter(d => d.date >= (left as number) && d.date <= (right as number))
        }

        if (visibleData.length === 0) return ['auto', 'auto']

        let min = Infinity
        let max = -Infinity

        visibleData.forEach((d: any) => {
            activeSeries.forEach(seriesId => {
                const val = d[seriesId]
                if (typeof val === 'number') {
                    if (val < min) min = val
                    if (val > max) max = val
                }
            })
        })

        if (min === Infinity || max === -Infinity) return ['auto', 'auto']

        const padding = (max - min) * 0.05
        return [Math.round(min - padding), Math.round(max + padding)]
    }, [currentData, left, right, activeSeries])

    const customTicks = useMemo(() => {
        const min = left === 'dataMin' ? (currentData[0]?.date ?? 0) : left as number
        const max = right === 'dataMax' ? (currentData[currentData.length - 1]?.date ?? 0) : right as number
        if (!min || !max) return []
        return getAxisTicks(min, max)
    }, [left, right, currentData])

    // Navigation logic
    const moveTimePeriod = (direction: 'back' | 'forward') => {
        const currentRight = right === 'dataMax' ? currentData[currentData.length - 1].date : right as number
        const currentLeft = left === 'dataMin' ? currentData[0].date : left as number
        const duration = currentRight - currentLeft

        const shift = direction === 'back' ? -duration : duration
        let newLeft = currentLeft + shift
        let newRight = currentRight + shift

        // Constraint check
        const minDate = currentData[0].date
        const maxDate = currentData[currentData.length - 1].date

        if (newRight > maxDate) {
            const diff = newRight - maxDate
            newRight = maxDate
            newLeft -= diff // Keep duration consistent? Or just clamp?
            // Actually if we hit right edge, just go to max
            newLeft = maxDate - duration
        }
        if (newLeft < minDate) {
            newLeft = minDate
            newRight = minDate + duration
        }

        setLeft(newLeft)
        setRight(newRight)
    }

    const toggleSeries = (id: string) => {
        const newSet = new Set(activeSeries)
        if (newSet.has(id)) {
            // Don't allow turning off the last series
            if (newSet.size > 1) newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setActiveSeries(newSet)
    }

    const zoom = () => {
        if (refAreaLeft === refAreaRight || refAreaRight === null) {
            setRefAreaLeft(null)
            setRefAreaRight(null)
            return
        }

        // Ensure left is smaller than right
        let start = refAreaLeft
        let end = refAreaRight

        if (typeof start === 'number' && typeof end === 'number') {
            if (start > end) [start, end] = [end, start]

            setRefAreaLeft(null)
            setRefAreaRight(null)

            // Save state before zooming if we aren't already in deep zoom
            if (timeRange !== null) {
                setPreZoomState({ left, right, timeRange })
            }

            setLeft(start)
            setRight(end)
            setTimeRange(null)
        }
    }

    const zoomOut = () => {
        setRefAreaLeft(null)
        setRefAreaRight(null)

        if (preZoomState) {
            setLeft(preZoomState.left)
            setRight(preZoomState.right)
            setTimeRange(preZoomState.timeRange)
            setPreZoomState(null)
        } else {
            setLeft('dataMin')
            setRight('dataMax')
            setTimeRange('3Y')
        }
    }

    return (
        <Card className="w-full h-[600px] bg-card/50 backdrop-blur-sm border-primary/20 p-0 flex flex-col relative overflow-hidden group transition-colors select-none [&_.recharts-wrapper]:!outline-none shadow-2xl shadow-primary/5">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-border/50 bg-card/30 z-20 gap-4">
                <div>
                    <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Portfolio Performance</div>
                    <div className="flex items-baseline gap-3">
                        <span className={cn("text-4xl font-extrabold tracking-tight", percentageReturn >= 0 ? "text-primary" : "text-destructive")}>
                            {percentageReturn >= 0 ? '+' : ''}{percentageReturn.toFixed(1)}%
                        </span>
                        <span className="text-sm text-foreground/60 font-medium">
                            {timeRange === null ? 'Zoomed View' : `Past ${timeRange === '3Y' ? '3 Years' : timeRange}`}
                        </span>
                        {timeRange === null && (
                            <button onClick={zoomOut} className="ml-2 flex items-center gap-1 text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded shadow-sm hover:bg-secondary/80 transition-colors">
                                <ZoomOut className="w-3 h-3" />
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Time Range Tabs */}
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
                    {TIME_RANGES.map(range => (
                        <button
                            key={range}
                            onClick={() => {
                                setTimeRange(range);
                                setRefAreaLeft(null);
                                setRefAreaRight(null);
                                // Set window
                                const lastDate = currentData[currentData.length - 1].date;
                                setRight('dataMax'); // Pin to live
                                setLeft(getStartDateForRange(range, lastDate));
                            }}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200",
                                timeRange === range
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="flex-1 w-full relative z-10 min-h-0 pb-4 flex items-center gap-2">

                {/* Left Navigation Button */}
                {timeRange !== '3Y' && left !== 'dataMin' && (typeof left !== 'number' || left > currentData[0].date) && (
                    <button
                        onClick={() => moveTimePeriod('back')}
                        className="p-2 rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors shrink-0 z-20 focus:outline-none focus:ring-1 focus:ring-ring opacity-50 hover:opacity-100"
                        aria-label="Previous Period"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                )}

                <div className="flex-1 h-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={currentData}
                            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                            onMouseDown={(e) => {
                                if (e && e.activeLabel) setRefAreaLeft(e.activeLabel)
                            }}
                            onMouseMove={(e) => {
                                if (refAreaLeft && e && e.activeLabel) setRefAreaRight(e.activeLabel)
                            }}
                            onMouseUp={zoom}
                        >
                            <defs>
                                <linearGradient id="colorThesivestPrimary" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="var(--color-border)" strokeOpacity={0.1} />
                            <XAxis
                                dataKey="date"
                                type="number"
                                domain={[left, right]}
                                padding={{ left: 0, right: 0 }}
                                allowDataOverflow
                                ticks={customTicks}
                                tickFormatter={(unixTime) => {
                                    // Determine the duration of the visible range
                                    let rangeStart = left === 'dataMin' ? currentData[0]?.date : left as number
                                    let rangeEnd = right === 'dataMax' ? currentData[currentData.length - 1]?.date : right as number

                                    // Fallback if data isn't ready
                                    if (!rangeStart || !rangeEnd) return ''

                                    const durationMs = rangeEnd - rangeStart
                                    const date = new Date(unixTime)

                                    // Dynamic formatting based on zoom level
                                    if (durationMs < 24 * 60 * 60 * 1000 * 5) { // < 5 days
                                        // Show time if highly zoomed, but data is currently daily-ish. 
                                        // Showing Day + Month is safest. 
                                        return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })
                                    } else if (durationMs < 24 * 60 * 60 * 1000 * 90) { // < 3 months
                                        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                    } else {
                                        return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
                                    }
                                }}
                                minTickGap={40}
                                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={yDomain}
                                padding={{ top: 20, bottom: 20 }}
                                allowDataOverflow
                                type="number"
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload || !payload.length) return null
                                    const sortedPayload = [...payload].sort((a: any, b: any) => (b.value as number) - (a.value as number))
                                    return (
                                        <div className="bg-popover/95 backdrop-blur border border-border rounded-xl shadow-xl p-3 min-w-[180px]">
                                            <div className="text-xs text-muted-foreground mb-2 font-medium">
                                                {label ? new Date(label).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : ''}
                                            </div>
                                            {sortedPayload.map((entry: any) => {
                                                const val = (entry.value as number) - 100
                                                return (
                                                    <div key={entry.name} className="flex items-center justify-between gap-4 text-sm mb-1">
                                                        <span className="flex items-center gap-2 text-foreground/80">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                            {entry.name}
                                                        </span>
                                                        <span className="font-mono font-bold" style={{ color: entry.color }}>
                                                            {val > 0 ? '+' : ''}{val.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                }}
                            />

                            {/* Render Lines Based on Active Series */}
                            {SERIES.map(s => {
                                const isActive = activeSeries.has(s.id)
                                const isThesivest = s.id === 'portfolio'

                                // Opacity Logic
                                let opacity = 0
                                if (isActive) {
                                    opacity = isThesivest ? 1 : (s.isBenchmark ? 0.7 : 0.8)
                                }

                                if (!isActive) return null

                                // Determine Component Type
                                if (s.type === 'area') {
                                    return (
                                        <Area
                                            key={s.id}
                                            type="monotone"
                                            dataKey={s.id}
                                            stroke={s.color}
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorThesivestPrimary)"
                                            name={s.label}
                                            strokeOpacity={opacity}
                                            style={{ opacity }}
                                            animationDuration={1000}
                                        />
                                    )
                                }

                                return (
                                    <Line
                                        key={s.id}
                                        type="monotone"
                                        dataKey={s.id}
                                        stroke={s.color}
                                        strokeWidth={s.isBenchmark ? 2 : 2}
                                        strokeDasharray={s.type === 'dashed' ? '5 5' : ''}
                                        dot={false}
                                        name={s.label}
                                        strokeOpacity={opacity}
                                        style={{ transition: 'opacity 0.3s' }}
                                        animationDuration={1000}
                                    />
                                )
                            })}

                            {/* Selection Box for Zooming using explicit primary color with opacity */}
                            {refAreaLeft && refAreaRight ? (
                                <ReferenceArea
                                    x1={refAreaLeft}
                                    x2={refAreaRight}
                                    strokeOpacity={0.3}
                                    fill="var(--color-primary)"
                                    fillOpacity={0.1}
                                />
                            ) : null}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Right Navigation Button */}
                {timeRange !== '3Y' && (right !== 'dataMax' && (typeof right !== 'number' || right < currentData[currentData.length - 1].date)) && (
                    <button
                        onClick={() => moveTimePeriod('forward')}
                        className="p-2 rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors shrink-0 z-20 focus:outline-none focus:ring-1 focus:ring-ring opacity-50 hover:opacity-100"
                        aria-label="Next Period"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                )}
            </div>

            {/* Legend / Toggles */}
            <div className="p-4 bg-card/30 border-t border-border/50 z-20 overflow-x-auto">
                <div className="flex items-center gap-3">
                    {SERIES.map(s => {
                        const isActive = activeSeries.has(s.id)
                        return (
                            <button
                                key={s.id}
                                onClick={() => toggleSeries(s.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap",
                                    isActive
                                        ? "bg-background shadow-sm border-border text-foreground"
                                        : "bg-muted/50 border-transparent text-muted-foreground opacity-60 hover:opacity-100"
                                )}
                            >
                                <div
                                    className={cn("w-2 h-2 rounded-full transition-transform duration-200", isActive ? "scale-100" : "scale-75")}
                                    style={{ backgroundColor: isActive ? s.color : 'var(--color-muted-foreground)' }}
                                />
                                {s.label}
                                {isActive && <Check className="w-3 h-3 text-muted-foreground ml-1" />}
                            </button>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}
