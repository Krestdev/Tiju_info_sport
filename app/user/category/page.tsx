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


  const { dataArticles, dataPubs } = useStore();
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
        .map(category => category.donnees[0]) // Récupère le premier article de chaque catégorie
        .filter(article => article !== undefined); // Supprime les catégories vides
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
      <div className='px-7 py-10'>
        <PubsComp pub={pub} taille={'h-[200px]'} clip={''} />
      </div>
      <CategoryComp article={category} ad={pub} categorie={articleData.data} />
    </div>
  )
}

export default page
