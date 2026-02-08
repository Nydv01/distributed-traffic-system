import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal,
  ChevronDown,
  ChevronUp,
  Circle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Radio,
  Pause,
  Play,
  Trash2,
  Search,
} from 'lucide-react'
import { LogEntry } from '@/types/traffic'
import { formatTimestamp, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LogPanelProps {
  logs: LogEntry[]
  maxHeight?: string
}

const LOG_TYPES: LogEntry['type'][] = [
  'info',
  'rpc',
  'success',
  'warning',
  'error',
  'sync',
]

/* ---------------- ICONS & COLORS ---------------- */

const logIcon = (type: LogEntry['type']) => {
  switch (type) {
    case 'info':
      return <Circle className="w-3 h-3 text-primary" />
    case 'rpc':
      return <Radio className="w-3 h-3 text-purple-400" />
    case 'success':
      return <CheckCircle className="w-3 h-3 text-success" />
    case 'error':
      return <XCircle className="w-3 h-3 text-destructive" />
    case 'warning':
      return <AlertCircle className="w-3 h-3 text-warning" />
    case 'sync':
      return <Zap className="w-3 h-3 text-primary" />
  }
}

const logColor = (type: LogEntry['type']) => {
  switch (type) {
    case 'rpc':
      return 'text-purple-400'
    case 'success':
      return 'text-success'
    case 'error':
      return 'text-destructive'
    case 'warning':
      return 'text-warning'
    case 'sync':
      return 'text-primary'
    default:
      return 'text-foreground'
  }
}

/* ---------------- COMPONENT ---------------- */

export function LogPanel({
  logs,
  maxHeight = '280px',
}: LogPanelProps) {
  const [expanded, setExpanded] = useState(true)
  const [paused, setPaused] = useState(false)
  const [filter, setFilter] =
    useState<LogEntry['type'] | 'all'>('all')
  const [query, setQuery] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)

  /* Auto scroll unless paused */
  useEffect(() => {
    if (!paused && scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight
    }
  }, [logs, paused])

  /* Filtered logs */
  const visibleLogs = useMemo(() => {
    return logs.filter(log => {
      if (filter !== 'all' && log.type !== filter)
        return false
      if (
        query &&
        !(
          log.message
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          log.source
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      )
        return false
      return true
    })
  }, [logs, filter, query])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* ================= HEADER ================= */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border/50 hover:bg-muted/30 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">
            Execution Timeline
          </span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {logs.length} events
          </span>
        </div>

        <ChevronToggle open={expanded} />
      </div>

      {/* ================= BODY ================= */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Controls */}
            <div className="flex flex-wrap gap-2 p-3 border-b border-border/40">
              {/* Filters */}
              <div className="flex gap-1">
                <FilterButton
                  active={filter === 'all'}
                  onClick={() => setFilter('all')}
                >
                  All
                </FilterButton>
                {LOG_TYPES.map(t => (
                  <FilterButton
                    key={t}
                    active={filter === t}
                    onClick={() => setFilter(t)}
                  >
                    {t}
                  </FilterButton>
                ))}
              </div>

              <div className="flex-1" />

              {/* Search */}
              <div className="relative w-44">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={e =>
                    setQuery(e.target.value)
                  }
                  placeholder="Search logs..."
                  className="pl-8 h-9"
                />
              </div>

              {/* Pause */}
              <Button
                size="sm"
                variant="ghost"
                onClick={e => {
                  e.stopPropagation()
                  setPaused(p => !p)
                }}
              >
                {paused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Logs */}
            <div
              ref={scrollRef}
              style={{ maxHeight }}
              className="overflow-y-auto px-3 py-2 log-terminal overscroll-contain"
              onWheel={(e) => e.stopPropagation()}
            >
              {visibleLogs.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  No matching log entries
                </div>
              ) : (
                <div className="space-y-1">
                  <AnimatePresence>
                    {visibleLogs.map((log, i) => (
                      <motion.div
                        key={log.id}
                        initial={{
                          opacity: 0,
                          x: -8,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: Math.min(i * 0.01, 0.2),
                        }}
                        className={cn(
                          'flex gap-2 px-2 py-1 rounded-md hover:bg-muted/50',
                          logColor(log.type),
                        )}
                      >
                        {/* Timeline dot */}
                        <div className="pt-1">
                          {logIcon(log.type)}
                        </div>

                        {/* Time */}
                        <span className="text-xs font-mono text-muted-foreground w-[78px]">
                          {formatTimestamp(
                            log.timestamp,
                          )}
                        </span>

                        {/* Source */}
                        <span className="text-xs font-semibold text-primary">
                          {log.source}
                        </span>

                        {/* Message */}
                        <span className="text-xs flex-1">
                          {log.message}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ---------------- SMALL COMPONENTS ---------------- */

function ChevronToggle({ open }: { open: boolean }) {
  return open ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  )
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Button
      size="sm"
      variant={active ? 'default' : 'ghost'}
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className="capitalize"
    >
      {children}
    </Button>
  )
}
