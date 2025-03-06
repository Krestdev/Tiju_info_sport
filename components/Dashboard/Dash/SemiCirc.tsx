"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [{ month: "january", desktop: 1260, mobile: 570 }]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const SemiCirc = () => {
    const totalVisitors = chartData[0].desktop + chartData[0].mobile

    return (
        <div className="flex flex-col items-center justify-center h-[140px] gap-3 px-5 py-3">
            <p className="font-bold text-[40px] leading-[52px]">6432</p>
            <p className="text-[16px] leading-[20.8px] text-[#545454]">visites</p>
        </div>
    )
}

export default SemiCirc