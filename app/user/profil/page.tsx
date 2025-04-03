"use client"

import axiosConfig from '@/api/api';
import ProfilForm from '@/components/Profil/ProfilForm';
import useStore from '@/context/store'
import { Categorie, Pubs } from '@/data/temps';
import withAuth from '@/lib/withAuth';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'

const page = () => {

  const { favorite } = useStore();
  const [pub, setPub] = useState<Advertisement[]>();
  const axiosClient = axiosConfig();


  const pubData = useQuery({
          queryKey: ["advertisement"],
          queryFn: () => {
              return axiosClient.get<any, AxiosResponse<Advertisement[]>>(
                  `/advertisement`
              );
          },
      });


  useEffect(() => {
    if (pubData.isSuccess) {
      setPub(pubData.data.data)
    }
  }, [pubData.data])



  return (
    <div className='containerBloc'>
      <ProfilForm une={favorite} pub={pub} />
    </div>
  )
}

export default withAuth(page);
