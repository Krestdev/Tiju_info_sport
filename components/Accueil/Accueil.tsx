"use client"

import useStore from '@/context/store';
import { Article, Categorie, Pubs } from '@/data/temps';
import { getUserFavoriteCategories } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import Head from './Head';
import GridAcc from './GridAcc';
import PubsComp from '../PubsComp';
import GridInfo from './GridInfo';
import UnePubs from './UnePubs';
import { Button } from '../ui/button';

const Accueil = () => {

    // const router = useRouter();
    // const pathname = usePathname();

    const { dataPubs, dataArticles, currentUser, favorite, setFavorite } = useStore();
    // const [art, setArt] = useState<Categorie[]>();
    const [pub, setPub] = useState<Pubs[]>();
    // const [pub1, setPu1] = useState<Pubs>();
    // const [pub2, setPu2] = useState<Pubs>();
    // const [blog1, setBlog1] = useState<Article>();
    // const [blog2, setBlog2] = useState<Article>();
    const [grid1, setGrid1] = useState<Categorie[]>();
    const [grid2, setGrid2] = useState<Categorie[]>();
    const [carrHero, setCarrHero] = useState<Article[]>();
    const [une, setUne] = useState<Categorie[]>();
    const [tail, setTail] = useState("max-h-[379px]")

    const pubData = useQuery({
        queryKey: ["pubs"],
        queryFn: async () => dataPubs,
    });

    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles,
    });

    const handleVoirtout = () => {
        setTail("");
    }
    useEffect(() => {
        if (pubData.isSuccess) {
            setPub(pubData.data)
            // setPu1(pubData.data[0])
            // setPu2(pubData.data[1])
        }
    }, [pubData.data])

    useEffect(() => {
        if (articleData.isSuccess) {
            const articles = articleData.data.slice().flatMap(cate => cate.donnees)
            // setBlog1(articles[articles.length - 2])
            // setBlog2(articles[articles.length - 1])
            setGrid1(favorite?.slice(0))
            setGrid2(favorite?.slice(1))
            // setArt(articleData.data)
            setCarrHero(articles.slice())
            setUne(favorite)
        };
        if (currentUser && articleData.data) {
            setFavorite(getUserFavoriteCategories(articleData.data.slice(), currentUser.id))
        }
    }, [articleData.data])

    return (
        <div className='containerBloc flex flex-col justify-center py-8 gap-[10px]'>
            <div className='w-full flex flex-col-reverse items-center  md:flex-row gap-10 md:px-7'>
                <div className='max-w-[824px] w-full flex flex-col gap-10 md:px-7'>
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
                    <div className={`${tail} md:max-h-full h-full overflow-hidden px-7`}>
                        <UnePubs titre={'A la une'} couleur={'bg-[#B3261E]'} article={une?.slice(0, 2).flatMap(cat => cat.donnees.slice(0, 1))} pubs={pub} />
                        <UnePubs titre={"Aujourd'hui"} couleur={'bg-[#01AE35]'} article={une?.slice().flatMap(cat => cat.donnees.slice()).slice(0, 8)} pubs={pub?.slice().reverse()} />
                    </div>
                    {tail === "max-h-[379px]" && <Button variant={"outline"} className='rounded-none mx-7 flex md:hidden' onClick={() => handleVoirtout()}>{"Voir Plus"}</Button>}
                    <div className='flex md:hidden px-7 mt-7'>{pub && <PubsComp pub={pub} taille={'h-[300px]'} clip={'clip-custom'} />}</div>
                </div>
            </div>
            <div>
                {grid2 && <GridInfo gridAff={grid2} />}
                <div className='hidden md:flex'>{pub && <PubsComp pub={pub} taille={'h-[200px]'} clip={''} />}</div>
                {grid2 && <GridInfo gridAff={grid2} />}
            </div>
        </div>
    )
}

export default Accueil
