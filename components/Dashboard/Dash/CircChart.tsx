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
import { Abonnement } from "@/data/temps"


interface Props {
  getPreviousMonths: (count: number) => {
    mois: string;
    monthNumber: number;
    year: number;
  }[]
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
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig



export function CircChart({getPreviousMonths}: Props) {

  const chartData = [
    { bouquet: "Bouquet Or", visitors: 1, fill: "var(--color-chrome)" },
    { bouquet: "Bouquet Diamant", visitors: 5, fill: "var(--color-safari)" },
    { bouquet: "Bouquet Argent", visitors: 2, fill: "var(--color-firefox)" },
    { bouquet: "Bouquet Bronze", visitors: 10, fill: "var(--color-edge)" },
    { bouquet: "Bouquet Normal", visitors: 25, fill: "var(--color-other)" },
  ]

  const { dataUsers } = useStore()
  const [abon, setAbon] = useState<(Abonnement | undefined)[]>()

  const subsData = useQuery({
    queryKey: ["abonnement"],
    queryFn: async () => dataUsers
  })

  useEffect(()=>{
    if (subsData.isSuccess) {
      setAbon(subsData.data.flatMap(x => x.abonnement))
      console.log(abon);
      
    }
  }, [subsData.data])


  const totalAbonnes = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  return (
    <Card className="flex flex-col max-w-md w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{"Utilisateurs et Abonnés"}</CardTitle>
        <CardDescription>{`${getPreviousMonths(5)[0].mois} ${getPreviousMonths(5)[0].year}- ${getPreviousMonths(5)[getPreviousMonths(5).length - 1].mois} ${getPreviousMonths(5)[getPreviousMonths(5).length - 1].year} `}</CardDescription>
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
              strokeWidth={5}
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
                          {totalAbonnes.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {"Utilisateurs"}
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
