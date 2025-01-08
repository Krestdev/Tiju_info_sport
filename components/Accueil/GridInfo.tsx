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
                        <div key={i} className='containerBloc flex flex-col py-[60px] gap-3'>
                            <div className='flex flex-row px-5 gap-4 justify-between'>
                                <h2 className='font-bold'>{x.nom}</h2>
                                <Link href={`/user/category/${x.nom}`}><h3 className='font-bold'>Tout Voir</h3></Link>
                            </div>
                            <div className='flex flex-col md:flex-row gap-7'>
                                <Link href={`/user/detail-article/${donne[0].id}`} className='flex flex-col gap-[10px] px-5 py-4'>
                                    <img src={donne[0].media} alt={donne[0].type} className='max-w-[600px] w-full h-[338px] object-cover rounded-lg' />
                                    <div className='flex flex-col'>
                                        <p className='text-[#A1A1A1]'>{donne[0].type}</p>
                                        <h2 className='line-clamp-2 font-bold mr-7 text-[28px]'>{donne[0].titre}</h2>
                                    </div>
                                </Link>
                                <div className='flex flex-col gap-3'>
                                    {
                                        donne.slice(1, 3).map(a => (
                                            <Link href={`/user/detail-article/${a.id}`} key={a.id} className='flex flex-col md:flex-row gap-7 px-5 py-4'>
                                                <img src={a.media} alt={a.type} className='max-w-[320px] w-full h-[180px] object-cover rounded-lg' />
                                                <div className='flex flex-col'>
                                                    <p className='text-[#A1A1A1]'>{donne[0].type}</p>
                                                    <h2 className='line-clamp-3 font-bold mr-7 text-[28px]'>{donne[0].titre}</h2>
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

        // <div className='containerBloc grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        //     {
        //         gridAff?.map((x: any) => {
        //             return (
        //                 <Link key={x.id} href={`/user/detail-article/${x.id}`}>
        //                     <div key={x.id} className='flex flex-col justify-center gap-3 p-5'>
        //                         {x.media && (
        //                             isImage(x.media) ? (
        //                                 <img
        //                                     className='object-cover h-[200px] w-[365.33px] rounded-lg'
        //                                     src={x.media}
        //                                     alt={x.type}
        //                                 />
        //                             ) : (
        //                                 <video
        //                                     className='object-cover h-[200px] w-[365.33px] rounded-lg'
        //                                     controls
        //                                     autoPlay
        //                                     muted
        //                                     loop
        //                                     src={x.media}
        //                                 >
        //                                     Votre navigateur ne supporte pas la lecture de cette vidéo.
        //                                 </video>
        //                             )
        //                         )}
        //                         <p className='uppercase text-[#182067]'>{x.type}</p>
        //                         <h3 className='line-clamp-2'>{x.titre}</h3>
        //                     </div>
        //                 </Link>
        //             )
        //         })
        //     }
        // </div>
    )
}

export default GridInfo
