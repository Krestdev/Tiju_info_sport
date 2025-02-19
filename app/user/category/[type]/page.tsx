"use client"

import GridInfo from '@/components/Accueil/GridInfo';
import CategoryComp from '@/components/Category/CategoriesComp';
import PubsComp from '@/components/PubsComp';
import useStore from '@/context/store';
import { Article, Categorie, Pubs } from '@/data/temps';
import withAuth from '@/lib/withAuth';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'

interface Result {
    id: number | undefined;
    titre: string | undefined;
    nom: string;
    media: string[] | undefined;
  }

const page = ({ params }: { params: Promise<{ type: string, id: string }> }) => {
    const param = React.use(params);

    const { dataArticles, dataPubs } = useStore();
    const [article, setArticle] = useState<Result[]>();
    const [pub, setPub] = useState<Pubs[]>();

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
            setArticle(articleData.data.find(x => x.nom.trimEnd() === decodeURIComponent(param.type))?.donnees.map(
                
                x => (
                    {
                        id: x.id,
                        nom: x.type,
                        titre: x.titre,
                        media: x.media
                    }
                )
            ))
        }
    }, [articleData.data, param.type, param.id]);
    useEffect(() => {
        if (pubData.isSuccess) {
          setPub(pubData.data)
        }
      }, [pubData.data])


    return (
        <div className='containerBloc'>
            <CategoryComp article={article} ad={pub} categorie={articleData.data} />
        </div>
    )
}

export default page;