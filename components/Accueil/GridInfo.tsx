"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import Info from './Info';
import useStore from '@/context/store';


interface Aff {
    gridAff: Category[];
    couleur: string;
}
const GridInfo = ({ gridAff, couleur }: Aff) => {

    const { settings } = useStore()
    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };
    const [article, setArticle] = useState<Article[]>()

    useEffect(()=>{
        setArticle(gridAff.flatMap(x => x.articles))
    },[gridAff])


    return (
        <div className='containerBloc w-full hidden md:flex flex-col items-center py-[60px] gap-6'>
            <div className='flex flex-row w-full items-center justify-between px-5 gap-4'>
                <h1 className='uppercase'>{gridAff[0].title}</h1>
                <Button className='uppercase rounded-none'><Link href={`/user/${gridAff[0].title}`}>{"Tout voir"}</Link></Button>
            </div>
            <div className='w-full flex flex-row gap-10 px-7'>
                <Info article={article && article[0]} taille={'max-w-[592px] max-h-[333px]'} couleur={couleur} />
                <div className='flex flex-col gap-5'>
                    {
                        article?.slice(0, 3).map((x, i) => (
                            <Link href={`/user/detail-article/${x.id}`} key={i} className='flex flex-row gap-7'>
                                {x.images && (
                                    isImage(x?.images[0] ? x?.images[0] : settings.noImage) ? (
                                        <img
                                            className={`max-w-[160px] max-h-[90px] w-full h-full aspect-video rounded-[6px] object-cover`}
                                            src={x?.images[0] ? x?.images[0] : settings.noImage}
                                            alt={`${x.images[0]}`}
                                        />
                                    ) : (
                                        <video
                                            className={`max-w-[160px] max-h-[90px] w-full h-full aspect-video rounded-[6px] object-cover`}
                                            controls
                                            muted
                                            loop
                                            src={x?.images[0] ? x?.images[0] : settings.noImage}
                                        >
                                            Votre navigateur ne supporte pas la lecture de cette vidéo.
                                        </video>
                                    )
                                )}
                                <div className='flex flex-col gap-1'>
                                    <p className="uppercase font-oswald font-medium text-[16px] leading-[20.8px] text-[#A1A1A1]">
                                        {x.type}
                                    </p>
                                    <h3 className="first-letter:uppercase line-clamp-2">{x.title}</h3>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default GridInfo
