import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTrafficStore } from '@/stores/trafficStore'

interface NavigationProps {
  className?: string
}

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/input', label: 'Route Input' },
  { path: '/nodes', label: 'Nodes' },
  { path: '/parallel', label: 'Parallel' },
  { path: '/output', label: 'Results' },
  { path: '/admin', label: 'Admin' },
]

// Magnetic hover effect hook
const useMagneticHover = () => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { springX, springY, handleMouseMove, handleMouseLeave }
}

export function Navigation({ className }: NavigationProps) {
  const { pathname } = useLocation()
  const { theme, setTheme } = useTrafficStore()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  // Scroll-aware background opacity
  const bgOpacity = useTransform(scrollY, [0, 100], [0.5, 0.95])
  const borderOpacity = useTransform(scrollY, [0, 100], [0.1, 0.3])

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setScrolled(latest > 50)
    })
    return () => unsubscribe()
  }, [scrollY])

  return (
    <motion.div
      className="flex items-center gap-3 w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm cursor-pointer group"
      >
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-black text-xs shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:shadow-primary/50 transition-all">
          DTS
        </div>
        <span className="hidden md:block text-sm font-black tracking-tighter uppercase whitespace-nowrap">
          SYSTEM <span className="text-primary italic">CORE</span>
        </span>
      </motion.div>

      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          backgroundColor: scrolled
            ? 'hsl(var(--card) / 0.9)'
            : 'hsl(var(--card) / 0.6)',
        }}
        className={cn(
          "relative flex-1 flex items-center gap-0.5 rounded-2xl",
          "backdrop-blur-xl border transition-all duration-500",
          scrolled
            ? "border-border shadow-lg shadow-black/5 dark:shadow-black/20"
            : "border-border/50",
          "px-1.5 py-1.5",
          className
        )}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path

          return (
            <NavItem
              key={item.path}
              path={item.path}
              label={item.label}
              isActive={isActive}
            />
          )
        })}
      </motion.nav>

      <motion.button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "relative p-2.5 rounded-2xl border transition-all duration-300",
          "backdrop-blur-xl shadow-lg overflow-hidden",
          scrolled
            ? "bg-card/90 border-border"
            : "bg-card/60 border-border/50",
          "text-muted-foreground hover:text-primary"
        )}
        aria-label="Toggle Theme"
      >
        <motion.div
          className="absolute inset-0 bg-primary/10 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 0 : 180 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative z-10"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.div>
      </motion.button>
    </motion.div>
  )
}

// Individual nav item with magnetic hover effect
function NavItem({ path, label, isActive }: { path: string; label: string; isActive: boolean }) {
  const { springX, springY, handleMouseMove, handleMouseLeave } = useMagneticHover()

  return (
    <NavLink
      to={path}
      className={cn(
        "relative z-10 px-3 py-2 text-[11px] font-bold rounded-xl",
        "transition-colors duration-200 uppercase tracking-wider",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive
          ? "text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Active pill with glow */}
      {isActive && (
        <motion.div
          layoutId="nav-active-pill"
          className="absolute inset-0 z-0 rounded-xl bg-primary"
          style={{
            boxShadow: '0 4px 20px hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.2)',
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}

      {/* Hover glow for inactive items */}
      {!isActive && (
        <motion.div
          className="absolute inset-0 z-0 rounded-xl bg-foreground/5 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <motion.span
        className="relative z-10 whitespace-nowrap"
        style={{ x: springX, y: springY }}
      >
        {label}
      </motion.span>
    </NavLink>
  )
}
