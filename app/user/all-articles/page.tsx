"use client"

import axiosConfig from '@/api/api';
import GridAll from '@/components/All/GridAll'
import PubsComp from '@/components/PubsComp'
import useStore from '@/context/store';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'

const page = () => {

    const { search } = useStore()
    const [pub1, setPu1] = useState<Advertisement[]>();
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
            setPu1(pubData.data.data)
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
