"use client"

import Similaire from '@/components/DetailArticle/Similaire';
import ProfilForm from '@/components/Profil/ProfilForm';
import PubsComp from '@/components/PubsComp';
import useStore from '@/context/store'
import { Categorie, Pubs } from '@/data/temps';
import withAuth from '@/lib/withAuth';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'

const page = () => {

  const { currentUser, dataPubs, favorite, dataArticles } = useStore();
  const [pub, setPub] = useState<Pubs[]>();
  const [category, setCategory] = useState<Categorie[]>()


  const articleData = useQuery({
    queryKey: ['articles'],
    queryFn: async () => dataArticles,
  });

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
      setCategory(articleData.data)
    }
  }, [articleData.data])



  return (
    <div className='containerBloc'>
      <ProfilForm currentUser={currentUser} category={category} pub={pub} />
    </div>
  )
}

export default withAuth(page);
