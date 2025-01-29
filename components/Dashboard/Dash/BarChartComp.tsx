"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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
const chartData = [
  { mois: "Juillet", reactions: 186 },
  { mois: "Août", reactions: 305 },
  { mois: "Septembre", reactions: 237 },
  { mois: "Octobre", reactions: 73 },
  { mois: "Novembre", reactions: 209 },
  { mois: "Décembre", reactions: 214 },
]

const chartConfig = {
  reactions: {
    label: "Reaction",
    color: "#123BAE",
  },
} satisfies ChartConfig

export function BarChartComp() {
  return (
    <Card>
        <CardHeader>
          <CardTitle>{"Reaction sur Vos Publications"}</CardTitle>
          <CardDescription>{"January - June 2024"}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mois"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="reactions" fill="var(--color-reactions)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Les Reactions Ont Augmentés de 5.2% Ce Mois <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {"Affichage du nombre total de Reaction au cours des 6 derniers mois"}
          </div>
        </CardFooter>
    </Card>
  )
}
