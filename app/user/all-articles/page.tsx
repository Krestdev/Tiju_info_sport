"use client"

import GridAll from '@/components/All/GridAll'
import PubsComp from '@/components/PubsComp'
import useStore from '@/context/store';
import { Article, Pubs } from '@/data/temps';
import withAuth from '@/lib/withAuth';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'

const page = () => {

    const { dataPubs, dataArticles, search } = useStore()
    const [pub1, setPu1] = useState<Pubs[]>();
    
    
    const pubData = useQuery({
        queryKey: ["pubs"],
        queryFn: async () => dataPubs,
    });
    
    useEffect(() => {
        if (pubData.isSuccess) {
            setPu1(pubData.data)
        }
    }, [pubData.data])

    return (
        <div className='containerBloc'>
            {pub1 && <PubsComp pub={pub1} taille={'h-[200px]'} clip={''} />}
            <GridAll article={search} />
        </div>
    )
}

export default page
