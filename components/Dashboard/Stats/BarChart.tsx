"use client";

import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

const chartConfig: ChartConfig = {
  desktop: {
    label: "Ordinateur",
    color: "hsl(var(--chart-1))",
  },
  tablet: {
    label: "Tablette",
    color: "hsl(var(--chart-2))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Autre",
    color: "hsl(var(--chart-4))",
  },
};

interface Props {
  value: string;
}

interface DeviceData {
  id: string;
  nom: string;
  Vues: number;
}

const deviceMapping: Record<string, string> = {
  desktop: "Ordinateur",
  tablet: "Tablette",
  mobile: "Mobile",
};

const BarChar = ({ value }: Props) => {
  const [chartData, setChartData] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/devise-info?value=${value}`);
        if (!res.ok) throw new Error("Erreur lors du fetch des données");

        const result = await res.json();
        const formattedData = result.map((item: { device: string; users: number }) => ({
          id: item.device,
          nom: deviceMapping[item.device] || "Autre",
          Vues: item.users,
        }));

        setChartData(formattedData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [value]);

  return (
    <div className="max-h-[208px]">
      <Card>
        <CardContent className="max-h-[208px]">
          <ChartContainer config={chartConfig}
          className="h-[208px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
              <YAxis
                dataKey="nom"
                type="category"
                tickLine={false}
                tickMargin={2}
                axisLine={false}
              />
              <XAxis dataKey="Vues" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              
              {/* Une seule Bar avec couleur dynamique via Cell */}
              <Bar dataKey="Vues" radius={5}>
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={chartConfig[entry.id]?.color || "gray"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarChar;
