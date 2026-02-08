import { cn } from '@/lib/utils'

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-muted',
                className
            )}
        />
    )
}

export function SkeletonText({ className }: SkeletonProps) {
    return <Skeleton className={cn('h-4 w-3/4', className)} />
}

export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={cn('space-y-3 p-4', className)}>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
        </div>
    )
}

export function SkeletonMetric({ className }: SkeletonProps) {
    return (
        <div className={cn('text-center space-y-2', className)}>
            <Skeleton className="h-6 w-6 mx-auto rounded-full" />
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
        </div>
    )
}

export function SkeletonNodeCard({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'rounded-3xl p-6 border border-border bg-muted/30 space-y-4',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="w-3 h-3 rounded-full" />
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
                <SkeletonMetric />
                <SkeletonMetric />
                <SkeletonMetric />
            </div>
        </div>
    )
}
