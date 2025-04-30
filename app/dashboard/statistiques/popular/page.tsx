"use client"

import Pagination from '@/components/Dashboard/Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

interface Props {
    dateRanges: {
        [key: string]: DateRange | undefined;
    };
    rangeKey: string;
}

interface ApiResponse {
    articleStats: Record<string, Record<string, number>>;
}

const Page = ({ dateRanges, rangeKey }: Props) => {
    const [chartData, setChartData] = useState<{
        title: string;
        value: number;
    }[]>([]);
    const value = "annee"
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
                    title !== '/category' &&
                    !title.startsWith('Tyju Info Sport') &&
                    !title.startsWith('/category') &&
                    !title.startsWith('Tyjuinfosport') &&
                    !title.startsWith('Tyju infosports') &&
                    !title.startsWith('Article Introuvable') &&
                    !title.startsWith('Titre inconnu') &&
                    !title.startsWith('Article test') &&
                    !title.startsWith('Connexion') &&
                    !title.startsWith('À propos') &&
                    !title.startsWith('Aucun article') &&
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
        };

        fetchViews();
        const interval = setInterval(fetchViews, 10000);
        return () => clearInterval(interval);
    }, [value, dateRanges, rangeKey]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalPages = Math.ceil(chartData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slicedItems = chartData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className='flex flex-col px-5 py-3 gap-3'>
            <h1>{"Les plus visités"}</h1>
            <Table className="border divide-x">
                <TableHeader>
                    <TableRow className="text-[18px] capitalize font-normal">
                        <TableHead>{"Titre"}</TableHead>
                        <TableHead>{"Vues"}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        slicedItems.map((article, index) => (
                            // <div
                            //     key={index}
                            //     className='flex flex-row justify-between items-center gap-2 h-[30.67px] p-3 bg-[#FAFAFA] rounded-[6px]'
                            // >
                                <TableRow key={index} className="text-[16px]">
                                    <TableCell className="border">
                                        <p className=''>{article.title}</p>
                                    </TableCell>
                                    <TableCell className="border">
                                        <p>{article.value}</p>
                                    </TableCell>
                                </TableRow>
                            // </div>
                        ))
                    }
                </TableBody>
            </Table>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div >
    );
};

export default Page;