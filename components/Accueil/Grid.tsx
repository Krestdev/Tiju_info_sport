"use client"

import React from 'react'
import { Categorie } from '@/data/temps';
import Link from 'next/link';
import { BiFootball } from 'react-icons/bi';
import IconeComp from '../IconeComp';


interface Aff {
    gridAff: Categorie[] | undefined
}

const Grid = ({ gridAff }: Aff) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    return (
        <div className='containerBloc flex flex-col md:flex-row gap-10'>
            <div className='flex flex-col md:flex-row gap-12'>
                {/* <span className='px-3 py-4 flex flex-row gap-3'> */}
                <div className='flex flex-col gap-2 w-full'>
                    <h3>{"Tous les Sports"}</h3>
                    {gridAff &&
                        gridAff.map(x => {
                            return (
                                <Link key={x.nom} href={`/category/${x.nom}`}>
                                    <div className='border-b pl-2 pb-2 max-w-[360px] w-full flex gap-[10px] items-center'>{x.nom} <IconeComp nom={x.nom} /></div>
                                </Link>
                            )
                        })
                    }
                </div>
                <div className='flex flex-row'>
                    {
                        gridAff?.slice(0, 1).map(x => x.donnees.slice(1, 2).map(x => (
                            <Link href={`/detail-article/${x.id}`} key={x.id} className='flex flex-col gap-2'>
                                <img src={x.media} alt="" className='object-cover max-w-[464px] w-full h-[236.25px] rounded-lg' />
                                {<h2 className='line-clamp-1 pl-3 pr-5'>{x.titre}</h2>}
                            </Link>
                        )))
                    }

                </div>
                {/* </span> */}

            </div>
            <div className='max-w-[360px] w-full flex flex-col gap-7 px-7 py-5'>
                <p className='text-[20px] font-semibold'>{"À la une"}</p>
                <div className='flex flex-col'>
                    {
                        gridAff?.slice(0, 3).map(x => x.donnees.slice(1, 3).map(x => {
                            return (
                                <Link key={x.id} href={`/detail-article/${x.id}`} className='flex flex-row items-center gap-4 p-4'>
                                    <img src={x.media} alt={x.type} className='object-cover max-w-[80px] max-h-[60px] h-full w-full rounded-lg' />
                                    <p className='line-clamp-3 font-medium'>{x.titre}</p>
                                </Link>
                            )
                        })
                        )
                    }
                </div>

            </div>
        </div>
    )
}

export default Grid
