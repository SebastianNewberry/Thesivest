import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getUnderRadarTheses } from '../server/features/theses'
import { useLoaderData } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Button } from '../components/ui/button'
import { TrendingUp, ShieldCheck, Zap } from 'lucide-react'
import { HeroChart } from '../components/HeroChart'

// Server Function calling Shared Logic
const getThesesFn = createServerFn({ method: "GET" }).handler(async () => {
  return getUnderRadarTheses()
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getThesesFn(),
})

function Home() {
  const theses = useLoaderData({ from: '/' })

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-12">

        {/* Hero Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center min-h-[60vh] w-full">
          {/* Left Column: Text & Animation */}
          <div className="flex flex-col items-center justify-center w-full">
            {/* Logo Animation */}
            <div className="relative h-24 md:h-40 text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter flex items-center justify-center overflow-hidden w-full m-auto">
              <motion.div
                className="flex items-center"
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
              >
                <span className="text-foreground">Thesi</span>
                <motion.span
                  className="text-foreground"
                  initial={{ opacity: 1, width: "auto" }}
                  animate={{ opacity: 0, width: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  style={{ display: 'inline-block', overflow: 'hidden' }}
                >
                  s
                </motion.span>
              </motion.div>

              <motion.span
                className="text-muted-foreground mx-4"
                initial={{ opacity: 1, width: "auto", scale: 1, marginLeft: "1rem", marginRight: "1rem" }}
                animate={{ opacity: 0, width: 0, scale: 0, marginLeft: 0, marginRight: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }} // Disappear quickly as they collide
                style={{ display: 'inline-block', overflow: 'hidden' }}
              >
                +
              </motion.span>

              <motion.div
                className="flex items-center"
                initial={{ x: 250 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
              >
                <motion.span
                  className="text-primary"
                  initial={{ opacity: 1, width: "auto" }}
                  animate={{ opacity: 0, width: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  style={{ display: 'inline-block', overflow: 'hidden' }}
                >
                  In
                </motion.span>
                <span className="text-primary">vest</span>
              </motion.div>
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
              className="space-y-6 text-center text-center mt-4"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Thesis + Invest. <br />
                <span className="text-muted-foreground">The symmetry involved in high conviction plays.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Join the community of deep-value hunters finding the asymmetry the market is missing.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.5, duration: 0.8 }}
            className="flex items-center justify-center w-full relative z-20"
          >
            <HeroChart />
          </motion.div>
        </div>

        {/* Theses Grid (Below Fold) */}
        <div className="mt-24 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Recent Findings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {theses.map((thesis) => (
              <div
                key={thesis.id}
                className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {thesis.symbol}
                    </h3>
                    <p className="text-muted-foreground text-sm">{thesis.title}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${thesis.conviction === 'High'
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : thesis.conviction === 'Medium'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      : 'bg-muted border-border text-muted-foreground'
                    }`}>
                    {thesis.conviction} Conviction
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</span>
                    <div className="text-lg font-mono">${thesis.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Catalyst</span>
                    <div className="text-sm text-foreground/80 leading-snug">
                      {thesis.catalyst}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                  {thesis.description}
                </p>

                <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified • {thesis.postedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
