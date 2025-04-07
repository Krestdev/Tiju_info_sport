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
        queryKey: ["categories"],
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
            setCate(articleData.data.data.filter((x) => x.parent !== null));
        }
    }, [articleData.data]);

    useEffect(() => {
        if (cate && articleData.isSuccess) {
            setArticle(cate.filter(x => x.parent === articleData.data.data.find(x => x.title === param.category)?.id).flatMap(x => x.articles))
        }
    }, [cate, param.category, param.id, articleData.data]);

    useEffect(() => {
        if (pubData.isSuccess) {
            setPub(pubData.data.data)
        }
    }, [pubData.data])    

    // console.log(cate);
    

    return (
        <div className='containerBloc items-center pb-[60px]'>
            <div className='px-7 py-5 md:py-10'>
                {pub && <PubsComp pub={pub} taille={'h-[200px]'} clip={''} />}
            </div>
            <CategoryComp categoriesList={articleData.data?.data} article={article} ad={pub} categorie={cate} setArticle={setArticle} />
        </div>
    )
}

export default page;