"use client"

import CategoryComp from '@/components/Category/CategoriesComp'
import PubsComp from '@/components/PubsComp'
import useStore from '@/context/store'
import { Article, Categorie, Pubs } from '@/data/temps'
import withAuth from '@/lib/withAuth'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

interface Result {
  id: number | undefined;
  titre: string | undefined;
  nom: string;
  media: string | undefined;
}

const page = () => {


  const { dataArticles, dataPubs } = useStore();
  const [pub, setPub] = useState<Pubs>();
  const [category, setCategory] = useState<Result[]>()

  const articleData = useQuery({
    queryKey: ['articles'],
    queryFn: async () => dataArticles,
  });
  const pubData = useQuery({
    queryKey: ["pubs"],
    queryFn: async () => dataPubs,
  });  

  function getLastImagesByCategory(categories: Categorie[]): Result[] {
    return categories.map(categorie => {
      const lastArticleWithMedia = [...categorie.donnees]
        .reverse()
        .find(article => article.media !== undefined);

      return {
        id: lastArticleWithMedia?.id,
        titre: lastArticleWithMedia?.titre,
        nom: categorie.nom,
        media: lastArticleWithMedia?.media
      };
    });
  }


  useEffect(() => {
    if (articleData.isSuccess) {
      setCategory(getLastImagesByCategory(articleData.data))
    }
  }, [articleData.data]);


  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data[0])
    }
  }, [pubData.data])  

  return (
    <div className='containerBloc '>
      <CategoryComp article={category} ad={pub} categorie={articleData.data} />
    </div>
  )
}

export default withAuth(page)
