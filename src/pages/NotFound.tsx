import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    )
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card-strong rounded-3xl p-10 max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6"
        >
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </motion.div>

        {/* Error Code */}
        <h1 className="text-6xl font-extrabold tracking-tight mb-2">
          404
        </h1>

        {/* Message */}
        <p className="text-lg font-medium mb-2">
          Page Not Found
        </p>

        <p className="text-muted-foreground mb-8">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        {/* Action */}
        <Button
          onClick={() => navigate('/')}
          className="btn-apple-primary gap-2 rounded-2xl px-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Path info (optional, dev-friendly) */}
        <div className="mt-6 text-xs text-muted-foreground font-mono">
          {location.pathname}
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
