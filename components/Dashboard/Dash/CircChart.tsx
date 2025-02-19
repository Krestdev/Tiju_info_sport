"use client"

import React, { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
import useStore from "@/context/store"
import { useQuery } from "@tanstack/react-query"

const n = 5;

interface Props {
  getPreviousMonths: (count: number) => {
    mois: string;
    monthNumber: number;
    year: number;
  }[],
  chartData: {
    bouquet: string;
    visitors: number;
    fill: string;
  }[],
  totalAbonne: number,
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Bouquet Or",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Bouquet Diamant",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Bouquet Argent",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Bouquet Bronze",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Bouquet Normal",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig


export function CircChart({ getPreviousMonths, chartData, totalAbonne }: Props) {

 
  const { dataUsers } = useStore()

  const subsData = useQuery({
    queryKey: ["abonnement"],
    queryFn: async () => dataUsers
  })

  return (
    <Card className="flex flex-col max-w-md w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{"Utilisateurs et Abonnés"}</CardTitle>
        <CardDescription>{`${getPreviousMonths(n)[0].mois} ${getPreviousMonths(n)[0].year}- ${getPreviousMonths(n)[getPreviousMonths(n).length - 1].mois} ${getPreviousMonths(n)[getPreviousMonths(n).length - 1].year} `}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="bouquet"
              innerRadius={60}
              strokeWidth={n}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalAbonne}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {"Utilisateur(s)"}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
