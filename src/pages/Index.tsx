import { memo } from 'react'
import { motion } from 'framer-motion'
import { HomeScreen } from '@/screens/HomeScreen'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const Index = () => {
  return (
    <motion.main
      key="home"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-screen w-full"
    >
      <HomeScreen />
    </motion.main>
  )
}

export default memo(Index)
