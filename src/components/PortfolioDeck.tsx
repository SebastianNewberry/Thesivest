import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { X } from "lucide-react";
import { HeroChart } from "./HeroChart";
import { PORTFOLIOS, ALL_DATA_SETS } from "../lib/chartData";
import { MiniChart } from "./MiniChart";
import { cn } from "../lib/utils";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface PortfolioDeckProps {
  isFanned?: boolean;
}

export function PortfolioDeck({ isFanned = false }: PortfolioDeckProps) {
  // Default to null so it stays fanned until a chart is selected
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // If the logo is hovered (isFanned=true), we reset to the "Menu" state (activeId=null).
  // This allows the fan to persist even after the user stops hovering the logo.
  useEffect(() => {
    if (isFanned) {
      setActiveId(null);
    }
  }, [isFanned]);

  // Logic: Fan out if explicitly triggered (logo hover) OR if no chart is selected yet.
  const showFan = isFanned || activeId === null;

  // Animation variants for hero chart - different timings for entry vs exit
  const heroChartVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  const heroLoadingVariants: Variants = {
    initial: { opacity: 1 },
    animate: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center perspective-1000">
      <AnimatePresence>
        {PORTFOLIOS.map((portfolio, index) => {
          const isActive = portfolio.id === activeId;

          // --- Geometry Config ---
          const totalItems = PORTFOLIOS.length;

          // Fan Geometry: Full 360 Circle (desktop) / Reduced for mobile
          const spreadAngle = 2 * Math.PI;
          const startAngle = -Math.PI / 2; // Start at top
          const step = spreadAngle / totalItems;

          const angle = startAngle + index * step;
          // Responsive radius: larger for more spread out fan
          const radius = isMobile ? 120 : 180;
          const fannedX = Math.cos(angle) * radius;
          const fannedY = Math.sin(angle) * radius * 0.85; // Compress Y to bring portfolios closer vertically

          // Stack Geometry (Peeking Cards)
          const stackX = (index + 1) * 10;
          const stackY = (index + 1) * 5;
          const stackRotate = (index + 1) * 5;

          // Hero Logic
          const isHero = isActive && !showFan;

          // Animation Stagger
          // If returning to stack (showFan false), delay 0.
          // If fanning out (showFan true), stagger.
          // If active, it moves immediately (0). Others stagger.
          const delay = showFan ? (isActive ? 0 : 0.05 + index * 0.03) : 0;

          // Faster exit when closing hero chart
          const isExitingHero = !showFan && !isActive && activeId === null;

          // Z-Index config
          // Hero always on top (100).
          // Fanned: 40-50 range?
          // Stacked: 10-index.
          // When fanned, we want them to layer nicely.
          // But if no activeId, they are all equal? No, index z-ordering is fine for fan overlap.

          return (
            <motion.div
              key={portfolio.id}
              layoutId={portfolio.id}
              className={cn(
                "absolute bg-card font-sans overflow-hidden shadow-2xl border",
                isHero
                  ? "rounded-xl bg-background/50 backdrop-blur border-border"
                  : cn(
                      "rounded-xl cursor-pointer hover:ring-2 hover:ring-primary z-50 transition-shadow",
                      portfolio.id === "thesivest"
                        ? "border-secondary ring-1 ring-secondary shadow-secondary/20"
                        : "border-border"
                    )
              )}
              style={{
                zIndex: isHero ? 100 : showFan ? 50 - index : 10 - index,
                transformOrigin: "center center",
              }}
              initial={false}
              animate={{
                // Position
                x: isHero ? 0 : showFan ? fannedX : stackX,
                y: isHero ? 0 : showFan ? fannedY : stackY,
                // Dimension - smaller on mobile, compact mini charts
                width: isHero ? "calc(100% - 32px)" : isMobile ? 220 : 240,
                height: isHero ? "calc(100% - 32px)" : isMobile ? 140 : 160,
                // Scale & Rotate
                scale: 1,
                rotate: isHero ? 0 : showFan ? 0 : stackRotate,
                // Opacity
                opacity: 1,
              }}
              transition={{
                duration: isExitingHero ? 0.35 : 0.25,
                ease: [0.25, 0.1, 0.25, 1],
                delay: isExitingHero
                  ? 0
                  : isMobile
                  ? Math.min(delay as number, 0.05)
                  : delay,
              }}
              onClick={(e) => {
                if (isHero) return;
                e.stopPropagation();
                setActiveId(portfolio.id);
              }}
              whileHover={!isHero ? { scale: 1.05, zIndex: 60 } : {}}
            >
              {/* Inner Content */}
              <div className="w-full h-full relative flex flex-col">
                {!isHero && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-3 py-2 border-b border-border/50 flex justify-between items-center bg-muted/20 shrink-0"
                  >
                    <span
                      className={cn(
                        "font-bold text-sm truncate",
                        portfolio.id === "thesivest"
                          ? "text-secondary"
                          : "text-foreground"
                      )}
                    >
                      {portfolio.name}
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 whitespace-nowrap">
                      vs S&P 500
                    </span>
                  </motion.div>
                )}

                <div className="flex-1 w-full relative min-h-0">
                  <AnimatePresence mode="popLayout">
                    {isHero ? (
                      <>
                        <motion.div
                          key="hero-chart"
                          variants={heroChartVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="absolute inset-0 w-full h-full z-10"
                        >
                          <HeroChart
                            portfolioId={portfolio.id}
                            data={ALL_DATA_SETS[portfolio.id]["3Y"]}
                            className="rounded-none border-0 shadow-none h-full"
                          />

                          {/* Close Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveId(null);
                            }}
                            className="absolute top-2 right-2 z-50 p-1 rounded-md bg-background/50 backdrop-blur hover:bg-muted/80 transition-colors border border-border/50 text-foreground cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                        <motion.div
                          key="hero-loading"
                          variants={heroLoadingVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="absolute inset-0 w-full h-full bg-background z-20 pointer-events-none"
                        />
                      </>
                    ) : (
                      <div className="absolute inset-0 w-full h-full z-10">
                        <MiniChart portfolioId={portfolio.id} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {!isHero && (
                  <div className="absolute inset-0 hover:bg-primary/5 transition-colors pointer-events-none" />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
