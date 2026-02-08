/**
 * PDF Export Module
 * 
 * Generates production-ready PDF reports from simulation results using
 * html2canvas for capture and jsPDF for PDF generation.
 */

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import type {
    PerformanceMetrics,
    SystemAnalytics,
    RegionNodeAnalytics,
    RouteResult,
    SimulationReport,
} from '@/types/traffic'
import { generateId } from '@/lib/utils'

/* ============================================================
   TYPES
============================================================ */

export interface PDFExportOptions {
    filename?: string
    includeCharts?: boolean
    includeNodeDetails?: boolean
    quality?: 'low' | 'medium' | 'high'
}

const QUALITY_SCALE = {
    low: 0.75,
    medium: 1,
    high: 1.5,
}

/* ============================================================
   REPORT GENERATION
============================================================ */

/**
 * Generate simulation report data structure
 */
export function generateReportData(params: {
    source: string
    destination: string
    metrics: PerformanceMetrics
    systemAnalytics: SystemAnalytics | null
    nodeAnalytics: Record<string, RegionNodeAnalytics>
    routeResult: RouteResult | null
    startedAt: number | null
    finishedAt: number | null
}): SimulationReport {
    const {
        source,
        destination,
        metrics,
        systemAnalytics,
        nodeAnalytics,
        routeResult,
        startedAt,
        finishedAt,
    } = params

    const duration = startedAt && finishedAt ? finishedAt - startedAt : 0

    return {
        id: generateId(),
        generatedAt: Date.now(),
        mode: 'parallel',
        source,
        destination,
        metrics,
        systemAnalytics: systemAnalytics || {
            totalLoad: 0,
            peakCongestion: 0,
            avgCongestion: 0,
            efficiencyPercent: metrics.efficiency,
            resourceUtilization: 0,
            nodesTotal: Object.keys(nodeAnalytics).length,
            nodesCompleted: metrics.successfulRequests,
            nodesFailed: metrics.failedRequests,
            nodesProcessing: 0,
            totalPacketsProcessed: 0,
            totalPacketsDropped: 0,
            overallThroughput: 0,
        },
        nodeAnalytics,
        routeResult,
        simulationDuration: duration,
        regionsProcessed: Object.keys(nodeAnalytics),
    }
}

/* ============================================================
   PDF GENERATION
============================================================ */

/**
 * Export results page to PDF
 */
export async function exportToPDF(
    elementId: string,
    report: SimulationReport,
    options: PDFExportOptions = {}
): Promise<void> {
    const {
        filename = `simulation-report-${Date.now()}.pdf`,
        quality = 'high',
    } = options

    const scale = QUALITY_SCALE[quality]
    const element = document.getElementById(elementId)

    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`)
    }

    // Create PDF document
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15

    // Header
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Distributed Traffic Simulation Report', margin, 25)

    // Metadata
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Date: ${new Date(report.generatedAt).toLocaleString()}`, margin, 35)
    pdf.text(`Mode: Parallel Distributed Processing`, margin, 42)
    pdf.text(`Route: ${report.source} → ${report.destination}`, margin, 49)

    // Divider
    pdf.setDrawColor(200)
    pdf.line(margin, 55, pageWidth - margin, 55)

    // Performance Summary
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Performance Summary', margin, 65)

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    const summaryData = [
        ['Sequential Time:', `${report.metrics.sequentialTime}ms`],
        ['Parallel Time:', `${report.metrics.parallelTime}ms`],
        ['Speedup Factor:', `${report.metrics.speedupFactor.toFixed(2)}x`],
        ['Efficiency:', `${report.metrics.efficiency.toFixed(1)}%`],
        ['Total Requests:', `${report.metrics.totalRequests}`],
        ['Successful:', `${report.metrics.successfulRequests}`],
        ['Failed:', `${report.metrics.failedRequests}`],
    ]

    let y = 75
    summaryData.forEach(([label, value]) => {
        pdf.text(label, margin, y)
        pdf.text(value, margin + 50, y)
        y += 7
    })

    // Divider
    pdf.line(margin, y + 3, pageWidth - margin, y + 3)
    y += 13

    // System Analytics
    if (report.systemAnalytics) {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('System Analytics', margin, y)
        y += 10

        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        const analyticsData = [
            ['Total Load:', `${report.systemAnalytics.totalLoad.toFixed(1)}%`],
            ['Peak Congestion:', `${report.systemAnalytics.peakCongestion.toFixed(1)}%`],
            ['Resource Utilization:', `${report.systemAnalytics.resourceUtilization.toFixed(1)}%`],
            ['Nodes Completed:', `${report.systemAnalytics.nodesCompleted}/${report.systemAnalytics.nodesTotal}`],
        ]

        analyticsData.forEach(([label, value]) => {
            pdf.text(label, margin, y)
            pdf.text(value, margin + 50, y)
            y += 7
        })

        y += 5
    }

    // Divider
    pdf.line(margin, y, pageWidth - margin, y)
    y += 10

    // Speedup Explanation
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Speedup Calculation', margin, y)
    y += 10

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const explanation = [
        'Speedup Factor = Sequential Time / Parallel Time',
        `                = ${report.metrics.sequentialTime}ms / ${report.metrics.parallelTime}ms`,
        `                = ${report.metrics.speedupFactor.toFixed(2)}x`,
        '',
        'Efficiency = (Speedup / Number of Nodes) × 100',
        `           = (${report.metrics.speedupFactor.toFixed(2)} / ${report.systemAnalytics?.nodesTotal || 6}) × 100`,
        `           = ${report.metrics.efficiency.toFixed(1)}%`,
    ]

    explanation.forEach(line => {
        pdf.text(line, margin, y)
        y += 6
    })

    y += 5

    // Divider
    pdf.line(margin, y, pageWidth - margin, y)
    y += 10

    // Conclusion
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Conclusion', margin, y)
    y += 10

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    const timeSaved = report.metrics.sequentialTime - report.metrics.parallelTime
    const percentFaster = ((timeSaved / report.metrics.sequentialTime) * 100).toFixed(0)

    const conclusion = [
        `Parallel distributed processing reduced execution time by ${percentFaster}%.`,
        `The simulation achieved a ${report.metrics.speedupFactor.toFixed(2)}x speedup with ${report.metrics.efficiency.toFixed(1)}% efficiency.`,
        ``,
        `Route optimized: ${report.source} → ${report.destination}`,
        report.routeResult ? `Path: ${report.routeResult.path.join(' → ')}` : '',
        report.routeResult ? `Distance: ${report.routeResult.totalDistance.toFixed(1)} km` : '',
        report.routeResult ? `Estimated Time: ${report.routeResult.estimatedTime.toFixed(0)} minutes` : '',
    ]

    conclusion.forEach(line => {
        if (line) {
            pdf.text(line, margin, y)
            y += 7
        }
    })

    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(128)
    pdf.text(
        'Generated by Distributed Traffic System | Parallel Computing Demonstration',
        margin,
        pageHeight - 10
    )

    // Try to capture and add chart image
    try {
        // Wait a small bit for any final layout/animation settling
        await new Promise(resolve => setTimeout(resolve, 300))

        const canvas = await html2canvas(element, {
            scale: scale, // Use optimized scale for smaller file
            useCORS: true,
            logging: false,
            backgroundColor: '#0f172a', // Match the app's dark theme
            removeContainer: true,
            // Limit canvas size for smaller files
            windowWidth: Math.min(element.scrollWidth, 1200),
            windowHeight: Math.min(element.scrollHeight, 1600),
        })

        // Add chart on second page
        pdf.addPage()
        pdf.setFillColor(15, 23, 42) // #0f172a
        pdf.rect(0, 0, pageWidth, pageHeight, 'F')

        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Visual System Results', margin, 25)

        // Use JPEG format with 70% quality for much smaller file size
        const imgData = canvas.toDataURL('image/jpeg', 0.7)
        const imgWidth = pageWidth - (margin * 2)
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Center on page if shorter than page
        const yOffset = imgHeight < (pageHeight - 60) ? (pageHeight - imgHeight) / 2 : 35

        pdf.addImage(imgData, 'JPEG', margin, yOffset, imgWidth, Math.min(imgHeight, pageHeight - 50))
    } catch (err) {
        console.warn('Could not capture chart image:', err)
    }

    // Save PDF using an explicit blob for better mobile/browser compatibility
    const pdfBlob = pdf.output('blob')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(pdfBlob)
    link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
}

/**
 * Quick export function for use in components
 */
export async function quickExportPDF(params: {
    elementId: string
    source: string
    destination: string
    metrics: PerformanceMetrics
    systemAnalytics: SystemAnalytics | null
    nodeAnalytics: Record<string, RegionNodeAnalytics>
    routeResult: RouteResult | null
    startedAt: number | null
    finishedAt: number | null
}): Promise<void> {
    const report = generateReportData(params)

    // Generate proper filename with source, destination, and date
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS
    const sourceClean = params.source.replace(/[^a-zA-Z0-9]/g, '_')
    const destClean = params.destination.replace(/[^a-zA-Z0-9]/g, '_')

    const filename = `Traffic_Report_${sourceClean}_to_${destClean}_${dateStr}_${timeStr}.pdf`

    await exportToPDF(params.elementId, report, { filename })
}
