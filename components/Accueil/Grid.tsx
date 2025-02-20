"use client"

import React from 'react'
import { Categorie, Pubs } from '@/data/temps';
import Link from 'next/link';
import IconeComp from '../IconeComp';
import UnePub from '../UnePub';


interface Aff {
    gridAff: Categorie[] | undefined,
    pubAff: Pubs[] | undefined
}

const Grid = ({ gridAff, pubAff }: Aff) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    return (
        <div className='containerBloc flex flex-col md:flex-row gap-2 md:gap-10'>
            <div className='flex flex-col md:flex-row gap-6 md:gap-12'>
                <div className='flex flex-col gap-5 md:gap-10'>
                    <div className='flex flex-col justify-between md:flex-row'>
                        <div className='flex flex-col gap-2 md:gap-5 px-7 py-2 md:py-5 max-w-[360px] w-full'>
                            <Link href={"/user/category"} className='font-semibold text-[24px]'>{"Tous les Sports"}</Link>
                            <div className='flex flex-col gap-2'>
                                {gridAff &&
                                    gridAff.slice(0, 10).map(x => {
                                        return (
                                            <Link key={x.nom} href={`/user/category/${x.nom}`}>
                                                <div className='border-b pl-2 pb-2 max-w-[360px] w-full flex gap-[10px] items-center text-[16px] font-medium'>{x.nom} <IconeComp nom={x.nom} /></div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='flex flex-row items-center p-3 md:p-7 gap-7'>
                            {
                                gridAff?.slice(1, 2).map(x => x.donnees.slice(1, 2).map(x => (
                                    <Link href={`/user/detail-article/${x.id}`} key={x.id} className=' max-w-[464px] w-full flex flex-col gap-5'>
                                        {x.media && (
                                            isImage(x.media[0]) ? (
                                                <img
                                                    className='object-cover max-w-[464px] w-full h-auto aspect-video rounded-[6px]'
                                                    src={x.media[0]}
                                                    alt={`${x.type} - ${x.titre}`}
                                                />
                                            ) : (
                                                <video
                                                    className='object-cover max-w-[464px] w-full h-auto aspect-video rounded-[6px]'
                                                    controls
                                                    autoPlay
                                                    muted
                                                    loop
                                                    src={x.media[0]}
                                                >
                                                    Votre navigateur ne supporte pas la lecture de cette vidéo.
                                                </video>
                                            )
                                        )}
                                        <div>
                                            <p className='text-[#A1A1A1] text-[16px] font-normal'>{x.type}</p>
                                            <h2 className='line-clamp-2 font-bold text-[28px]'>{x.titre}</h2>
                                        </div>
                                    </Link>
                                )))
                            }

                        </div>
                    </div>
                    <div className='flex p-3 md:p-7 items-center justify-center'>
                        {
                            gridAff?.slice(2, 3).map(x => x.donnees.slice(0, 1).map(x => (
                                <Link href={`/user/detail-article/${x.id}`} key={x.id} className='flex flex-col gap-5 max-w-[824px] w-full'>
                                    {x.media && (
                                        isImage(x.media[0]) ? (
                                            <img
                                                className='max-w-[824px] w-full h-auto aspect-video rounded-[6px] object-cover'
                                                src={x.media[0]}
                                                alt={`${x.type} - ${x.titre}`}
                                            />
                                        ) : (
                                            <video
                                                className='max-w-[824px] w-full h-auto aspect-video rounded-[6px] object-cover'
                                                controls
                                                autoPlay
                                                muted
                                                loop
                                                src={x.media[0]}
                                            >
                                                Votre navigateur ne supporte pas la lecture de cette vidéo.
                                            </video>
                                        )
                                    )}
                                    <div className='w-full'>
                                        <p className='text-[#A1A1A1] text-[16px] font-normal'>{x.type}</p>
                                        <h2 className='line-clamp-1 font-bold mr-7 text-[28px]'>{x.titre}</h2>
                                        <p className='text-[#545454] text-[16px] line-clamp-2'>{x.description}</p>
                                    </div>
                                </Link>
                            )))
                        }
                    </div>
                </div>
            </div>

            <UnePub gridAff={gridAff} pubAff={pubAff} />
        </div>
    )
}

export default Grid
