"use client"

import CategoryComp from '@/components/Category/CategoriesComp'
import PubsComp from '@/components/PubsComp'
import useStore from '@/context/store'
import { Article, Pubs } from '@/data/temps'
import withAuth from '@/lib/withAuth'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

interface Result {
  id: number;
  type: string;
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



  function getLastArticlesByType(articles: Article[]): Result[] {
    const map = new Map<string, Article>();

    for (let i = articles.length - 1; i >= 0; i--) {
      const article = articles[i];
      if (!map.has(article.type)) {
        map.set(article.type, article);
      }
    }

    return Array.from(map.values()).map((article) => ({
      id: article.id,
      type: article.type,
      media: article.media,
    }));
  }

  useEffect(() => {
    if (articleData.isSuccess) {
      setCategory(getLastArticlesByType(articleData.data))
    }
  }, [articleData.data]);

  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data[0])
    }
  }, [pubData.data])

  return (
    <div>
      {pub && <PubsComp {...pub} />}
      <CategoryComp category={category} />
    </div>
  )
}

export default withAuth(page)
