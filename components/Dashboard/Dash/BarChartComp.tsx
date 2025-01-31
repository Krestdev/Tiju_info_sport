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
import useStore from "@/context/store"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Article } from "@/data/temps"



// const chartData = [
//   { mois: "Juillet", reactions: 186 },
//   { mois: "Août", reactions: 305 },
//   { mois: "Septembre", reactions: 237 },
//   { mois: "Octobre", reactions: 73 },
//   { mois: "Novembre", reactions: 209 },
//   { mois: "Décembre", reactions: 214 },
// ]

const chartConfig = {
  reactions: {
    label: "Reaction",
    color: "#123BAE",
  },
} satisfies ChartConfig

interface Props {
  getPreviousMonths: (count: number) => {
    mois: string;
    monthNumber: number;
    year: number;
  }[]
}

export function BarChartComp({ getPreviousMonths }: Props) {

  const { dataArticles } = useStore()
  const [art, setArt] = useState<Article[]>([]);

  // Récupération des articles avec react-query
  const articleData = useQuery({
    queryKey: ["articles"],
    queryFn: async () => dataArticles,
  });

  // Fonction pour générer les données du graphique
  const generateChartData = (articles: Article[] | undefined, count: number) => {
    const previousMonths = getPreviousMonths(count);

    const data = previousMonths.map(({ mois, monthNumber, year }) => {
      const filteredArticles = articles?.filter(article => {
        const [day, month, yearArticleRaw] = article.ajouteLe.split("/").map(Number);
        const yearArticle = yearArticleRaw < 100 ? yearArticleRaw + 2000 : yearArticleRaw;
        return month === monthNumber && yearArticle === year;
      }) || [];

      const reactions = filteredArticles.reduce((total, article) => {
        return (
          total +
          (article.like?.length || 0) +
          (article.commentaire?.length || 0) +
          (article.commentaire?.flatMap(y => y.reponse)?.length || 0)
        );
      }, 0);

      return { mois, reactions };
    });

    // Fusion des doublons éventuels
    const mergedData = data.reduce<{ mois: string; reactions: number }[]>((acc, curr) => {
      const existing = acc.find(item => item.mois === curr.mois);
      if (existing) {
        existing.reactions += curr.reactions;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
    return mergedData;
  };

  // Calcul de la variation en pourcentage
  const calculatePercentageVariation = (data: { mois: string; reactions: number }[]) => {
    if (data.length < 2) return null;

    const lastMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];

    if (previousMonth.reactions === 0) {
      return lastMonth.reactions > 0 ? 100 : 0;
    }

    const variation = ((lastMonth.reactions - previousMonth.reactions) / previousMonth.reactions) * 100;
    return variation.toFixed(2);
  };

  useEffect(() => {
    if (articleData.isSuccess) {
      const allArticles = articleData.data.flatMap(x => x.donnees);
      setArt(allArticles);
    }
  }, [articleData.data]);


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{"Reaction sur Vos Publications"}</CardTitle>
        <CardDescription>{`${getPreviousMonths(5)[0].mois} ${getPreviousMonths(5)[0].year}- ${getPreviousMonths(5)[getPreviousMonths(5).length - 1].mois} ${getPreviousMonths(5)[getPreviousMonths(5).length - 1].year} `}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={generateChartData(art, 5)}
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
        <div className="flex gap-2 font-medium leading-none capitalize">
          {`Les Reactions ont variées de ${calculatePercentageVariation(generateChartData(art, 5))}% Ce Mois`} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {"Affichage du nombre total de Reaction au cours des 5 derniers mois"}
        </div>
      </CardFooter>
    </Card>
  )
}
