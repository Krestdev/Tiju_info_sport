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
  media: string[] | undefined;
}

const page = () => {
  const { dataArticles, dataPubs, favorite } = useStore();
  const [pub, setPub] = useState<Pubs[]>();
  const [category, setCategory] = useState<Article[]>()

  const articleData = useQuery({
    queryKey: ['articles'],
    queryFn: async () => dataArticles,
  });
  const pubData = useQuery({
    queryKey: ["pubs"],
    queryFn: async () => dataPubs,
  });

  const getFirstArticlesByCategory = (categories: Categorie[]): Article[] => {
    return categories
        .map(category => category.donnees[0]) 
        .filter(article => article !== undefined); 
};



  useEffect(() => {
    if (articleData.isSuccess) {
      setCategory(getFirstArticlesByCategory(articleData.data))
    }
  }, [articleData.data]);

  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data)
    }
  }, [pubData.data])

  return (
    <div className='containerBloc items-center pb-[60px]'>
      <div className='px-7 py-5 md:py-10'>
        <PubsComp pub={pub} taille={'h-[180px]'} clip={''} />
      </div>
      <CategoryComp article={category} ad={pub} categorie={articleData.data} favorite={favorite} />
    </div>
  )
}

export default page
