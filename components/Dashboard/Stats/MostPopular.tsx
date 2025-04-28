"use client"

import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

interface Props {
    value: string;
    dateRanges: {
        [key: string]: DateRange | undefined;
    };
    rangeKey: string;
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
    ): { title: string; value: number }[] {
        const viewsMap: Record<string, number> = {};

        Object.values(articleStats).forEach((articles) => {
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

    useEffect(() => {
        const fetchViews = async () => {
            try {
                setError(null);
                let queryParam = `interval=${value}`;

                if (rangeKey && dateRanges[rangeKey]) {
                    const { from, to } = dateRanges[rangeKey]!;
                    queryParam = `from=${from?.toISOString() ?? ''}&to=${to?.toISOString() ?? ''}&interval=${value}`;
                }

                const response = await fetch(`/api/get-realtime-views?${queryParam}`);
                
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }

                const data: ApiResponse = await response.json();

                if (data.articleStats && typeof data.articleStats === 'object') {
                    const articles = mergeDuplicateTitles(
                        transformArticleStats(data.articleStats)
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

        fetchViews();
        const interval = setInterval(fetchViews, 10000);
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