"use client";

import Detail from '@/components/DetailArticle/Detail';
import PubsComp from '@/components/PubsComp';
import useStore from '@/context/store';
import { Article, Pubs } from '@/data/temps';
import withAuth from '@/lib/withAuth'
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useEffect, useState, use } from 'react';

// interface ArticleDetail {
//   params: {
//     id: string;
//   };
// }

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const param = React.use(params);
  
  const { dataArticles, dataPubs } = useStore();
  const [article, setArticle] = useState<Article | undefined>();
  const [pub, setPub] = useState<Pubs>();
  const [similaire, setSimilaire] = useState<Article[] | undefined>();
  

  const articleData = useQuery({
    queryKey: ['articles'],
    queryFn: async () => dataArticles,
  })

  const pubData = useQuery({
    queryKey: ["pubs"],
    queryFn: async () => dataPubs,
  });

  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data[0])
    }
  }, [pubData.data])

  useEffect(() => {
    if (articleData.isSuccess) {
      const foundArticle = articleData.data.find(x => x.id === Number(param.id));
      setArticle(foundArticle);
      setSimilaire(articleData.data.filter(x => x.type === foundArticle?.type && x.id !== foundArticle.id).slice(0,2))
    }
  }, [articleData.data, param.id]);

  if (!article) {
    return <div>Chargement ou article introuvable...</div>;
  }

  return (
    <div>
      {pub && <PubsComp {...pub} />}
      <Detail details={article} similaire={similaire} />
    </div>
  );
};

export default withAuth(Page);