import React, { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker';

interface Props {
    value: string,
    dateRanges: {
        [key: string]: DateRange | undefined;
    },
    rangeKey: string
}

const MostPopular = ({ value, dateRanges, rangeKey }: Props) => {

    const [chartData, setChartData] = useState<{ title: string; vues: number; }[]>([])

    function getTopArticlesInRange(
        data: Record<string, Record<string, number>>,
        startDate: string,
        endDate: string
    ) {
        let articleViews: Record<string, number> = {};

        Object.entries(data).forEach(([date, articles]) => {
            if (date >= startDate && date <= endDate) {
                Object.entries(articles).forEach(([title, views]) => {
                    if (title !== "Aucun article" && title !== "/detail-article") {
                        articleViews[title] = (articleViews[title] || 0) + views;
                    }
                });
            }
        });

        return Object.entries(articleViews)
            .map(([title, vues]) => ({ title, vues }))
            .sort((a, b) => b.vues - a.vues) 
            .slice(0, 4); 
    }

    // Fonction pour calculer les dates selon `value`
    const getDatesFromValue = (value: string) => {
        const today = new Date();
        let startDate = new Date(today);
        let endDate = new Date(today);
        
        if (value === 'semaine') {
            startDate.setDate(today.getDate() - 7); 
        } else if (value === 'mois') {
            startDate.setMonth(today.getMonth() - 1); 
        } else if (value === 'année') {
            startDate.setFullYear(today.getFullYear() - 1); 
        }
        
        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    }

    useEffect(() => {
        const fetchViews = async () => {
            try {
                let startDate = '', endDate = '';
                
                // Si un rangeKey est défini dans dateRanges, on donne la priorité à ces dates
                if (rangeKey && dateRanges[rangeKey]) {
                    const { from, to } = dateRanges[rangeKey]!;
                    startDate = from?.toISOString().split('T')[0] ?? '';
                    endDate = to?.toISOString().split('T')[0] ?? '';
                } else {
                    // Sinon, on utilise la valeur de `value` pour calculer les dates
                    const { startDate: calculatedStartDate, endDate: calculatedEndDate } = getDatesFromValue(value);
                    startDate = calculatedStartDate;
                    endDate = calculatedEndDate;
                }

                let queryParam = `from=${startDate}&to=${endDate}&interval=${value}`;
                const response = await fetch(`/api/get-realtime-views?${queryParam}`);
                const data = await response.json();
                if (data.articleStats && typeof data.articleStats === 'object') {
                    setChartData(getTopArticlesInRange(data.articleStats, startDate, endDate));
                }

            } catch (error) {
                console.error("Erreur récupération vues :", error);
            }
        };

        fetchViews();
        const interval = setInterval(fetchViews, 10000);

        return () => clearInterval(interval);
    }, [value, dateRanges, rangeKey]);

    return (
        <div className='flex flex-col px-5 py-3 gap-3 h-[208px]'>
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
