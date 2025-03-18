"use client";

import { useEffect, useState } from "react";
import { Legend, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface CategoryData {
  categorie: string;
  vues: number;
  fill: string;
}

export function CircChar() {
  const [chartData, setChartData] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch("/api/page-view");
        const data = await response.json();

        if (data.categories) {
          // Trier les catégories par nombre de vues décroissant (optionnel si elles sont déjà triées)
          const sortedCategories = data.categories.sort((a: any, b: any) => b.vues - a.vues);

          // Séparer les 4 premiers éléments
          const topCategories = sortedCategories.slice(0, 4).map((item: any, index: number) => ({
            categorie: item.title,
            vues: item.vues,
            fill: chartColors[index % chartColors.length],
          }));

          // Récupérer le reste des catégories et additionner leurs vues
          const otherCategories = sortedCategories.slice(4);
          const totalOtherViews = otherCategories.reduce((sum: number, item: any) => sum + item.vues, 0);

          // Ajouter la catégorie "Autre" si des catégories sont regroupées
          if (totalOtherViews > 0) {
            topCategories.push({
              categorie: "Autres",
              vues: totalOtherViews,
              fill: chartColors[4], // Utilisation de la 5ème couleur
            });
          }

          setChartData(topCategories);
        } else {
          console.log("Erreur API:", data.error);
        }
      } catch (error) {
        console.error("Erreur lors du fetch des données:", error);
      }
    };

    fetchViews();
    const interval = setInterval(fetchViews, 10000);

    return () => clearInterval(interval);
  }, []);

  const chartConfig: ChartConfig = {
    visiteurs: { label: "Nombre de vues" },
  };

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="max-h-[207px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="vues" nameKey="categorie" />
            <Legend layout="vertical" verticalAlign="middle" align="right" iconType="rect" iconSize={20} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
