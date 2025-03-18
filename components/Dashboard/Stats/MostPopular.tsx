import React, { useEffect, useState } from 'react'

interface Props {
    value: string
}

const MostPopular = ({ value }: Props) => {

    const [chartData, setChartData] = useState<{ title: string; vues: number; }[]>()

    interface ArticleViews {
        [title: string]: number;
    }

    interface Articles {
        [date: string]: ArticleViews;
    }

    interface TopArticle {
        title: string;
        vues: number;
    }

    function getTopArticles(data: Articles, interval: string): TopArticle[] {
        const now = new Date();
        let startDate = new Date(now);

        // Définir l'intervalle de temps
        if (interval === "semaine") {
            startDate.setDate(now.getDate() - 7);
        } else if (interval === "mois") {
            startDate.setMonth(now.getMonth() - 1);
        } else if (interval === "annee") {
            startDate.setFullYear(now.getFullYear() - 1);
        } else {
            throw new Error("Intervalle invalide");
        }

        let articleViews: ArticleViews = {};

        Object.entries(data).forEach(([date, articles]) => {
            const currentDate = new Date(date);
            if (currentDate >= startDate && currentDate <= now) {
                Object.entries(articles).forEach(([title, views]) => {
                    if (title !== "Aucun article") {
                        articleViews[title] = (articleViews[title] || 0) + views;
                    }
                });
            }
        });

        return Object.entries(articleViews)
            .map(([title, vues]) => ({ title, vues }))
            .sort((a, b) => b.vues - a.vues)
            .slice(0, 5);
    }

    useEffect(() => {
        const fetchViews = async () => {
            try {
                const response = await fetch(`/api/get-realtime-views?interval=${value}`)
                const data = await response.json()

                if (data.articleStats) {
                    setChartData(getTopArticles(data.articleStats, value))
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
        <div className='flex flex-col px-5 py-3 gap-3'>
            {
                chartData?.map((article, index) => (
                    <div key={index} className='flex flex-row justify-between items-center gap-2 h-[30.67px] p-3 bg-[#FAFAFA] rounded-[6px]'>
                        <p className='w-[215px] truncate'>{article.title}</p>
                        <p>{article.vues}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default MostPopular
