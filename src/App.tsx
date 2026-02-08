import { useEffect, useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { StepProgressBar } from "@/components/layouts/StepIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SplashScreen } from "@/components/SplashScreen";
import { PageTransition } from "@/components/PageTransition";
import { HomeScreen } from "@/screens/HomeScreen";
import { RouteInputScreen } from "@/screens/RouteInputScreen";
import { NodeVisualizationScreen } from "@/screens/NodeVisualizationScreen";
import { ParallelAnimationScreen } from "@/screens/ParallelAnimationScreen";
import { RouteOutputScreen } from "@/screens/RouteOutputScreen";
import { AdminScreen } from "@/screens/AdminScreen";
import NotFound from "./pages/NotFound";
import { useTrafficStore } from "@/stores/trafficStore";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition type="cinematic">
            <HomeScreen />
          </PageTransition>
        } />
        <Route path="/input" element={
          <PageTransition type="fadeUp">
            <RouteInputScreen />
          </PageTransition>
        } />
        <Route path="/nodes" element={
          <PageTransition type="slide">
            <NodeVisualizationScreen />
          </PageTransition>
        } />
        <Route path="/parallel" element={
          <PageTransition type="slide">
            <ParallelAnimationScreen />
          </PageTransition>
        } />
        <Route path="/output" element={
          <PageTransition type="fadeUp">
            <RouteOutputScreen />
          </PageTransition>
        } />
        <Route path="/admin" element={
          <PageTransition type="default">
            <AdminScreen />
          </PageTransition>
        } />
        <Route path="*" element={
          <PageTransition type="default">
            <NotFound />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { phase, isRunning, theme } = useTrafficStore();
  const showProgress = phase !== 'idle' || isRunning;
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <motion.div
        className="min-h-screen bg-background transition-colors duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.header
          className="sticky top-0 z-50 py-4 px-4 transition-all duration-300"
          initial={false}
          animate={{
            backgroundColor: scrolled
              ? 'hsl(var(--background) / 0.85)'
              : 'hsl(var(--background) / 0.6)',
            backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(8px)',
            borderColor: scrolled
              ? 'hsl(var(--border) / 0.5)'
              : 'hsl(var(--border) / 0.1)',
            boxShadow: scrolled
              ? '0 8px 32px -8px hsl(var(--primary) / 0.1), 0 4px 16px -4px hsl(0 0% 0% / 0.1)'
              : 'none',
          }}
          style={{ borderBottom: '1px solid' }}
        >
          <div className="max-w-7xl mx-auto space-y-3">
            <Navigation />
            {showProgress && (
              <div className="max-w-md mx-auto">
                <StepProgressBar currentPhase={phase} />
              </div>
            )}
          </div>
        </motion.header>

        <main>
          <AnimatedRoutes />
        </main>
      </motion.div>
    </>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SmoothScroll>
            <AppContent />
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
