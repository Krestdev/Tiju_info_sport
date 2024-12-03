"use client"

import useStore from '@/context/store';
import { Article } from '@/data/temps';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'


interface Aff {
    gridAff: Article[]
}
const GridInfo = ({ gridAff }: Aff) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    return (
        <div className='containerBloc grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {
                gridAff?.map((x: any) => {
                    return (
                        <Link key={x.id} href={`/detail-article/${x.id}`}>
                            <div key={x.id} className='flex flex-col justify-center gap-3 p-5'>
                                {x.media && (
                                    isImage(x.media) ? (
                                        <img
                                            className='object-cover h-[200px] w-[365.33px] rounded-lg'
                                            src={x.media}
                                            alt={x.type}
                                        />
                                    ) : (
                                        <video
                                            className='object-cover h-[200px] w-[365.33px] rounded-lg'
                                            controls
                                            autoPlay
                                            muted
                                            loop
                                            src={x.media}
                                        >
                                            Votre navigateur ne supporte pas la lecture de cette vidéo.
                                        </video>
                                    )
                                )}
                                <p className='uppercase text-[#182067]'>{x.type}</p>
                                <h3 className='line-clamp-2'>{x.titre}</h3>
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default GridInfo
