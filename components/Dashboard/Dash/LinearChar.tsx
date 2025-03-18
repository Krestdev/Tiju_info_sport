"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

const chartConfig = {
  view: {
    label: "Vues",
    color: "hsl(173, 56%, 38%)"
,
  },
} satisfies ChartConfig

interface Props {
  value: string
}

const LinearChat = ({value}: Props) => {

  function convertData(data: Record<string, Record<string, number>>, value: string) {
    if (value === "mois") {
      return Object.entries(data).map(([key, articles]) => {
        const sem = key.match(/\d{2}\/\d{2}/)?.[0] || key;
        const vues = Object.values(articles).reduce((sum, v) => sum + v, 0);
        return { sem: `Sem ${sem}`, vues };
      });
    } else if (value === "semaine") {
      return Object.entries(data).map(([key, articles]) => {
        const date = new Date(key);
        const sem = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        const vues = Object.values(articles).reduce((sum, v) => sum + v, 0);
        return { sem, vues };
      });
    } else if (value === "annee") {
      return Object.entries(data).map(([key, articles]) => {
        const mois = new Date(`${key}-01`).toLocaleDateString('fr-FR', { month: 'short' });
        const vues = Object.values(articles).reduce((sum, v) => sum + v, 0);
        return { sem: mois.charAt(0).toUpperCase() + mois.slice(1), vues };
      });
    }
    return [];
  }
  
    

  const [chartData, setChartData] = useState<{sem: string; vues: number; }[]>()



  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(`/api/get-realtime-views?interval=${value}`)
        const data = await response.json()

        if (data.articleStats) {
          setChartData(convertData(data.articleStats, value))
        }
      } catch (error) {
        console.error("Erreur récupération v :", error)
      }
    }    

    fetchViews()
    const interval = setInterval(fetchViews, 10000)

    return () => clearInterval(interval)
  }, [value])

  return (
    <div className="max-h-[208px]">
      <Card>
        <CardContent className="max-h-[208px]">
          <ChartContainer config={chartConfig} 
              className="h-fit">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="sem"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0} 
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                dataKey="vues"
                type="linear"
                fill="var(--color-view)"
                fillOpacity={0.4}
                stroke="var(--color-view)"
                className="h-[208px]"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default LinearChat
