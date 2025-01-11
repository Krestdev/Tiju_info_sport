"use client"

import React from 'react'
import { Categorie, Pubs } from '@/data/temps';
import Link from 'next/link';
import { BiFootball } from 'react-icons/bi';
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
        <div className='containerBloc flex flex-col md:flex-row gap-10'>
            <div className='flex flex-col md:flex-row gap-12'>
                <div className='flex flex-col gap-10'>
                    <div className='flex flex-col justify-between md:flex-row'>
                        <div className='flex flex-col gap-5 px-7 py-5 w-full'>
                            <h3>{"Tous les Sports"}</h3>
                            <div className='flex flex-col gap-2'>
                                {gridAff &&
                                    gridAff.map(x => {
                                        return (
                                            <Link key={x.nom} href={`/user/category/${x.nom}`}>
                                                <div className='border-b pl-2 pb-2 max-w-[360px] w-full flex gap-[10px] items-center'>{x.nom} <IconeComp nom={x.nom} /></div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='flex flex-row items-center p-7 gap-7'>
                            {
                                gridAff?.slice(0, 1).map(x => x.donnees.slice(1, 2).map(x => (
                                    <Link href={`/user/detail-article/${x.id}`} key={x.id} className='flex flex-col gap-5'>
                                        <img src={x.media} alt="" className='object-cover max-w-[464px] w-full h-auto aspect-video rounded-lg' />
                                        <div>
                                            <p className='text-[#A1A1A1] font-normal'>{x.type}</p>
                                            <h2 className='line-clamp-2 font-bold mr-7 text-[28px]'>{x.titre}</h2>
                                        </div>
                                    </Link>
                                )))
                            }

                        </div>
                    </div>
                    <div className='flex p-7 gap-7'>
                        {
                            gridAff?.slice(2).map(x => x.donnees.slice(1, 2).map(x => (
                                <Link href={`/user/detail-article/${x.id}`} key={x.id} className='flex flex-col gap-5'>
                                    <img src={x.media} alt={x.description} className='object-cover max-w-[824px] w-full h-auto aspect-video' />
                                    <div>
                                        <p className='text-[#A1A1A1] font-normal'>{x.type}</p>
                                        <h2 className='line-clamp-1 font-bold mr-7 text-[28px]'>{x.titre}</h2>
                                        <p className='text-[#545454] line-clamp-2'>{x.description}</p>
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
