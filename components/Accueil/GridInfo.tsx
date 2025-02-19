"use client"

import useStore from '@/context/store';
import { Article, Categorie } from '@/data/temps';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'


interface Aff {
    gridAff: Categorie[]
}
const GridInfo = ({ gridAff }: Aff) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };


    return (
        <div>
            {
                gridAff.slice(0, 1).map((x, i) => {
                    const donne = x.donnees
                    return (
                        <div key={i} className='containerBloc flex flex-col py-3 md:py-[60px] gap-3'>
                            <div className='flex flex-row px-5 gap-4 justify-between'>
                                <h1 className='font-medium  text-[40px]'>{x.nom}</h1>
                                <Link href={`/user/category/${x.nom}`}><h3 className='font-bold border border-black px-3 py-2'>Tout Voir</h3></Link>
                            </div>
                            <div className='flex flex-col md:flex-row gap-7'>
                                <Link href={`/user/detail-article/${donne[0].id}`} className='flex flex-col gap-[10px] px-5 py-4'>
                                    {donne[0].media && <img src={donne[0].media[0]} alt={donne[0].type} className='max-w-[600px] w-full h-auto aspect-video object-cover rounded-[6px]' />}
                                    <div className='flex flex-col'>
                                        <p className='text-[#A1A1A1]'>{donne[0].type}</p>
                                        <h2 className='line-clamp-2 font-bold mr-7 text-[28px]'>{donne[0].titre}</h2>
                                    </div>
                                </Link>
                                <div className='flex flex-col gap-3'>
                                    {
                                        donne.slice(1, 3).map(a => (
                                            <Link href={`/user/detail-article/${a.id}`} key={a.id} className='flex flex-col md:flex-row gap-7 px-5 py-4'>
                                                {a.media && <img src={a.media[0]} alt={a.type} className='max-w-[320px] w-full h-auto aspect-video object-cover rounded-[6px]' />}
                                                <div className='flex flex-col'>
                                                    <p className='text-[#A1A1A1]'>{donne[0].type}</p>
                                                    <h2 className='line-clamp-3 leading-[36.4px] font-bold mr-7 text-[28px]'>{donne[0].titre}</h2>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default GridInfo
