"use client"

import useStore from '@/context/store';
import { getUserFavoriteCategories } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import Head from './Head';
import GridAcc from './GridAcc';
import PubsComp from '../PubsComp';
import GridInfo from './GridInfo';
import UnePubs from './UnePubs';
import { Button } from '../ui/button';
import axiosConfig from '@/api/api';
import { AxiosResponse } from 'axios';

const Accueil = () => {

    const { currentUser, setFavorite, favorite } = useStore();
    const [pub, setPub] = useState<Advertisement[]>();
    const [grid2, setGrid2] = useState<Category[]>();
    const [carrHero, setCarrHero] = useState<Article[]>();
    const [une, setUne] = useState<Category[]>();
    const [tail, setTail] = useState("max-h-[379px]")
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



    const handleVoirtout = () => {
        setTail("");
    }
    const handleVoirMoins = () => {
        setTail("max-h-[379px]");
    }
    useEffect(() => {
        if (pubData.isSuccess) {
            setPub(pubData.data.data)
        }
    }, [pubData.data])

    useEffect(() => {
        if (articleData.isSuccess) {
            setUne(articleData.data.data.filter(x => x.articles.length > 0))
        }
    }, [articleData.data])

    useEffect(() => {
        if (une) {
            const articles = une.slice().flatMap(cate => cate.articles)
            setGrid2(une)
            setCarrHero(articles.slice())
            if (currentUser) {
                setFavorite(getUserFavoriteCategories(une.slice(), currentUser.id))
            }
        }
    }, [une, articleData.isSuccess, articleData.isError, articleData.data])

    // useEffect(() => {
    //     if (une) {
    //         const articles = une.slice().flatMap(cate => cate.articles)
    //         setGrid2(une)
    //         setCarrHero(articles.slice())
    //         // setGrid1(une.slice(0))
    //     };
    //     if (currentUser && une) {
    //         setFavorite(getUserFavoriteCategories(une.slice(), currentUser.id))
    //     }
    // }, [une, favorite, articleData.data])

    return (
        une && une?.length > 0 ?
            <div>
                {articleData.isLoading && <div>{"Chargement ..."}</div>}
                {articleData.isSuccess &&
                    <div className='containerBloc flex flex-col justify-center py-8 gap-[10px]'>
                        <div className='w-full flex flex-col-reverse  md:flex-row gap-10 md:px-7'>
                            <div className='max-w-[824px] w-full flex flex-col gap-10'>
                                <div className='w-full flex flex-col gap-10'>
                                    <div className='hidden md:flex'>
                                        {carrHero && <Head gridAff={carrHero} />}
                                    </div>
                                    <div className='px-7 md:px-0'>{carrHero && <GridAcc gridAff={carrHero} />}</div>
                                    <div className='hidden md:flex'>{pub && <PubsComp pub={pub} taille={'h-[200px]'} clip={''} />}</div>
                                </div>
                            </div>
                            <div className='md:max-w-[360px] w-full md:px-7 gap-7'>
                                <div className='flex pb-7 !px-0 md:hidden'>
                                    {carrHero && <Head gridAff={carrHero} />}
                                </div>
                                <div className={`${tail} md:max-h-full h-full overflow-hidden px-7 md:px-0`}>
                                    <UnePubs titre={'A la une'} couleur={'bg-[#B3261E]'} article={une?.slice(0, 2).flatMap(cat => cat.articles.slice(0, 1))} pubs={pub} />
                                    <UnePubs titre={"Aujourd'hui"} couleur={'bg-[#01AE35]'} article={une?.slice().flatMap(cat => cat.articles.slice()).slice(0, 8)} pubs={pub?.slice().reverse()} />
                                </div>
                                {tail === "max-h-[379px]" && <Button variant={"outline"} className='mx-7 rounded-none mt-3 flex md:hidden' onClick={() => handleVoirtout()}>{"Voir Plus"}</Button>}
                                {tail === "" && <Button variant={"outline"} className='mx-7 rounded-none mt-3 flex md:hidden' onClick={() => handleVoirMoins()}>{"Voir Moins"}</Button>}
                                <div className='flex md:hidden mt-7'>{pub && <PubsComp pub={pub} taille={'h-[300px]'} clip={'clip-custom'} />}</div>
                            </div>
                        </div>
                        <div>
                            {une && <GridInfo gridAff={une.slice(0,4)} couleur={'bg-[#0A0E93]'} />}
                            <div className='hidden md:flex'>{pub && <PubsComp pub={pub} taille={'h-[200px]'} clip={''} />}</div>
                            {une && <GridInfo gridAff={une.slice(5,9)} couleur={'bg-[#0180F8]'} />}
                        </div>
                    </div>}
            </div> :
            <div className='flex items-center justify-center h-[320px]'>
                <h1>
                    {"Aucun article publié"}
                </h1>
            </div>

    )
}

export default Accueil
