import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

interface Props {
    value: string;
    dateRanges: {
        [key: string]: DateRange | undefined;
    };
    rangeKey: string;
}

interface ArticleData {
    title: string;
    vues: number;
}

interface ApiResponse {
    articleStats: Record<string, Record<string, number>>;
}

const MostPopular = ({ value, dateRanges, rangeKey }: Props) => {
    const [chartData, setChartData] = useState<{
        title: string;
        value: number;
    }[]>([]);
    const [error, setError] = useState<string | null>(null);

    function transformArticleStats(
        articleStats: Record<string, Record<string, number>>,
        startDate: string,
        endDate: string
    ): { title: string; value: number }[] {
        const viewsMap: Record<string, number> = {};

        Object.entries(articleStats).forEach(([rawDate, articles]) => {
            const match = rawDate.match(/(\d{2})\/(\d{2})/);
            if (!match) return;

            const [_, month, day] = match;
            const year = new Date().getFullYear();

            const parsedDate = new Date(`${year}-${month}-${day}`);

            if (parsedDate >= new Date(startDate) && parsedDate <= new Date(endDate)) {
                Object.entries(articles).forEach(([title, vues]) => {
                    if (
                        title !== '(not set)' &&
                        title !== '/detail-article' &&
                        !title.startsWith('Tyju Info Sport') &&
                        !title.startsWith('Tyjuinfosport') &&
                        !title.startsWith('Tyju infosports') &&
                        !title.startsWith('Article Introuvable') &&
                        !title.startsWith('Titre inconnu') &&
                        !title.startsWith('Article test') &&
                        !title.startsWith('Connexion') &&
                        !title.startsWith('À propos') &&
                        !title.startsWith('Profil')
                    ) {
                        viewsMap[title] = (viewsMap[title] || 0) + vues;
                    }
                });
            }
        });

        return Object.entries(viewsMap).map(([title, value]) => ({
            title,
            value,
        }));
    }


    function mergeDuplicateTitles(
        data: { title: string; value: number }[]
    ): { title: string; value: number }[] {
        const merged: Record<string, number> = {};

        data.forEach(({ title, value }) => {
            merged[title] = (merged[title] || 0) + value;
        });

        return Object.entries(merged)
            .map(([title, value]) => ({ title, value }))
            .sort((a, b) => b.value - a.value);
    }

    function getDatesFromValue(value: string): { startDate: string; endDate: string } {
        const today = new Date();
        let startDate = new Date();
    
        switch (value) {
            case 'semaine':
                startDate.setDate(today.getDate() - 7);
                break;
            case 'mois':
                startDate.setMonth(today.getMonth() - 1);
                break;
            case 'annee':
                startDate.setFullYear(today.getFullYear() - 1);
                break;
            default:
                startDate = today;
        }
    
        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
        };
    }
    

    function getStartAndEndDates(): { startDate: string; endDate: string } | null {
        if (rangeKey && dateRanges[rangeKey]) {
            const { from, to } = dateRanges[rangeKey]!;
            if (from && to) {
                return {
                    startDate: from.toISOString().split('T')[0],
                    endDate: to.toISOString().split('T')[0]
                };
            }
        }
    
        const fromValue = getDatesFromValue(value);
        if (fromValue.startDate && fromValue.endDate) {
            return fromValue;
        }
    
        return null;
    }
    

    useEffect(() => {
        const fetchViews = async () => {
            try {
                setError(null);
    
                const dates = getStartAndEndDates();
                if (!dates) {
                    setChartData([]);
                    return;
                }
    
                const { startDate, endDate } = dates;
                const queryParam = `from=${startDate}&to=${endDate}&interval=${value}`;
                const response = await fetch(`/api/get-realtime-views?${queryParam}`);
    
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }
    
                const data: ApiResponse = await response.json();
    
                if (data.articleStats && typeof data.articleStats === 'object') {
                    const articles = mergeDuplicateTitles(
                        transformArticleStats(data.articleStats, startDate, endDate)
                    );
                    setChartData(articles);
                } else {
                    setChartData([]);
                }
            } catch (err: any) {
                console.error('Erreur récupération vues :', err);
                setError('Impossible de charger les données.');
            }
        };
    
        const getStartAndEndDates = (): { startDate: string; endDate: string } | null => {
            if (rangeKey && dateRanges[rangeKey]) {
                const { from, to } = dateRanges[rangeKey]!;
                if (from && to) {
                    return {
                        startDate: from.toISOString().split('T')[0],
                        endDate: to.toISOString().split('T')[0]
                    };
                }
            }
    
            const { startDate, endDate } = getDatesFromValue(value);
            if (startDate && endDate) {
                return { startDate, endDate };
            }
    
            return null;
        };
    
        fetchViews();
        const interval = setInterval(fetchViews, 10000);
        console.log(value);
        return () => clearInterval(interval);
    }, [value, dateRanges, rangeKey]);
    

    

    return (
        <div className='flex flex-col px-5 py-3 gap-3 h-[208px]'>
            {error ? (
                <p className='text-red-500'>{error}</p>
            ) : chartData.length === 0 ? (
                <p className='text-gray-500'>Aucun article trouvé dans cette période.</p>
            ) : (
                chartData.slice(0,4).map((article, index) => (
                    <div
                        key={index}
                        className='flex flex-row justify-between items-center gap-2 h-[30.67px] p-3 bg-[#FAFAFA] rounded-[6px]'
                    >
                        <p className='w-[215px] truncate'>{article.title}</p>
                        <p>{article.value}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default MostPopular;
