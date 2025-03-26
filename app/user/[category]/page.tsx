"use client"

import axiosConfig from '@/api/api';
import GridInfo from '@/components/Accueil/GridInfo';
import CategoryComp from '@/components/Category/CategoriesComp';
import PubsComp from '@/components/PubsComp';
import useStore from '@/context/store';
import withAuth from '@/lib/withAuth';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'


const page = ({ params }: { params: Promise<{ category: string, id: string }> }) => {
    const param = React.use(params);

    const [article, setArticle] = useState<Article[]>();
    const [pub, setPub] = useState<Advertisement[]>();
    const [cate, setCate] = useState<Category[]>()
    const axiosClient = axiosConfig();

    const articleData = useQuery({
        queryKey: ["categoryv"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Category[]>>(
                `/category`
            );
        },
    });

    const pubData = useQuery({
        queryKey: ["advertisement"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Advertisement[]>>(
                `/advertisement`
            );
        },
    });


    useEffect(() => {
        if (articleData.isSuccess) {
            setCate(articleData.data.data.filter(x => x.articles.length > 0))
        }
    }, [articleData.data])

    useEffect(() => {
        if (cate) {
            setArticle(cate.find(x => x.title === param.category)?.articles)
        }
    }, [cate, param.category, param.id]);

    useEffect(() => {
        if (pubData.isSuccess) {
            setPub(pubData.data.data)
        }
    }, [pubData.data])


    return (
        <div className='containerBloc items-center pb-[60px]'>
            <div className='px-7 py-5 md:py-10'>
                {pub && <PubsComp pub={pub} taille={'h-[180px]'} clip={''} />}
            </div>
            <CategoryComp article={article} ad={pub} categorie={cate} />
        </div>
    )
}

export default page;