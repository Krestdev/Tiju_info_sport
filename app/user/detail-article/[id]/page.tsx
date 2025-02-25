"use client";

import Detail from '@/components/DetailArticle/Detail';
import Test from '@/components/DetailArticle/Test';
import PubsComp from '@/components/PubsComp';
import useStore from '@/context/store';
import { Article, Categorie, Pubs } from '@/data/temps';
import withAuth from '@/lib/withAuth'
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useEffect, useState, use } from 'react';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const param = React.use(params);

  const { dataArticles, dataPubs, favorite } = useStore();
  const [article, setArticle] = useState<Article | undefined>();
  const [pub, setPub] = useState<Pubs[]>();
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
      setPub(pubData.data)
    }
  }, [pubData.data])


  useEffect(() => {
    if (articleData.isSuccess) {
      const articles = articleData.data.flatMap(cate => cate.donnees)
      const foundArticle = articles.find(x => x.id === Number(param.id));
      setArticle(foundArticle);
      setSimilaire(articles.filter(x => x.type === foundArticle?.type && x.id !== foundArticle.id).slice(0, 2))
    }
  }, [articleData.data, param.id]);

  if (!article) {
    return <div>Chargement ou article introuvable...</div>;
  }



  return (
    <div className='containerBloc gap-3'>
      <div className='px-7'>
      {pub && <PubsComp pub={pub} taille={'h-[200px]'} clip={''} />}
      </div>
      <Detail details={article} similaire={similaire} pub={pub} dataArticle={articleData.data} favorite={favorite}/>
    </div>
  );
};

export default Page;