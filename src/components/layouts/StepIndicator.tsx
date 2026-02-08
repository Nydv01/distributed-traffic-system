import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationPhase } from '@/types/traffic'

interface Step {
    id: string
    label: string
    phases: SimulationPhase[]
}

const SIMULATION_STEPS: Step[] = [
    { id: 'input', label: 'Configure', phases: ['idle', 'input'] },
    { id: 'processing', label: 'Process', phases: ['requesting', 'processing'] },
    { id: 'aggregate', label: 'Aggregate', phases: ['aggregating'] },
    { id: 'optimize', label: 'Optimize', phases: ['optimizing'] },
    { id: 'complete', label: 'Results', phases: ['complete'] },
]

interface StepIndicatorProps {
    currentPhase: SimulationPhase
    className?: string
    compact?: boolean
}

export function StepIndicator({
    currentPhase,
    className,
    compact = false,
}: StepIndicatorProps) {
    const currentStepIndex = SIMULATION_STEPS.findIndex((step) =>
        step.phases.includes(currentPhase)
    )

    return (
        <div
            className={cn(
                'flex items-center justify-center',
                compact ? 'gap-2' : 'gap-4',
                className
            )}
        >
            {SIMULATION_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex
                const isCurrent = index === currentStepIndex
                const isPending = index > currentStepIndex

                return (
                    <div key={step.id} className="flex items-center">
                        {/* Step Circle */}
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className={cn(
                                'relative flex items-center justify-center rounded-full transition-all',
                                compact ? 'w-8 h-8' : 'w-10 h-10',
                                isCompleted && 'bg-success text-success-foreground',
                                isCurrent && 'bg-primary text-primary-foreground',
                                isPending && 'bg-muted text-muted-foreground'
                            )}
                        >
                            {isCompleted ? (
                                <Check className={cn(compact ? 'w-4 h-4' : 'w-5 h-5')} />
                            ) : (
                                <span className={cn('font-semibold', compact ? 'text-sm' : 'text-base')}>
                                    {index + 1}
                                </span>
                            )}

                            {/* Pulse animation for current step */}
                            {isCurrent && (
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-primary"
                                    initial={{ opacity: 0.5, scale: 1 }}
                                    animate={{ opacity: 0, scale: 1.5 }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                />
                            )}
                        </motion.div>

                        {/* Step Label */}
                        {!compact && (
                            <span
                                className={cn(
                                    'ml-2 text-sm font-medium whitespace-nowrap',
                                    isCompleted && 'text-success',
                                    isCurrent && 'text-primary',
                                    isPending && 'text-muted-foreground'
                                )}
                            >
                                {step.label}
                            </span>
                        )}

                        {/* Connector Line */}
                        {index < SIMULATION_STEPS.length - 1 && (
                            <div
                                className={cn(
                                    'h-0.5 rounded-full transition-colors',
                                    compact ? 'w-4 ml-2' : 'w-8 ml-4',
                                    index < currentStepIndex ? 'bg-success' : 'bg-muted'
                                )}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// Compact variant for navigation bar
export function StepProgressBar({
    currentPhase,
    className,
}: Omit<StepIndicatorProps, 'compact'>) {
    const currentStepIndex = SIMULATION_STEPS.findIndex((step) =>
        step.phases.includes(currentPhase)
    )

    const progress = ((currentStepIndex + 1) / SIMULATION_STEPS.length) * 100

    return (
        <div className={cn('w-full', className)}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{SIMULATION_STEPS[currentStepIndex]?.label || 'Ready'}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                />
            </div>
        </div>
    )
}
