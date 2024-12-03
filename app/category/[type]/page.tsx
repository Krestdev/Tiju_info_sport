"use client"

import GridInfo from '@/components/Accueil/GridInfo';
import PubsComp from '@/components/PubsComp';
import useStore from '@/context/store';
import { Article, Pubs } from '@/data/temps';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'

const page = ({ params }: { params: Promise<{ type: string, id: string }> }) => {
    const param = React.use(params);

    const { dataArticles, dataPubs } = useStore();
    const [article, setArticle] = useState<Article[] | undefined>();
    const [pub, setPub] = useState<Pubs>();

    const articleData = useQuery({
        queryKey: ['articles'],
        queryFn: async () => dataArticles,
    });
    const pubData = useQuery({
        queryKey: ["pubs"],
        queryFn: async () => dataPubs,
      });

    useEffect(()=>{
        if (articleData.isSuccess) {
            setArticle(articleData.data.filter(x=> x.type === decodeURIComponent(param.type)))
        }
    }, [articleData.data, param.type, param.id]);
    useEffect(() => {
        if (pubData.isSuccess) {
          setPub(pubData.data[0])
        }
      }, [pubData.data])

    return (
        <div>
            {pub && <PubsComp {...pub} />}
            {article && <GridInfo gridAff={article} />}
        </div>
    )
}

export default page
