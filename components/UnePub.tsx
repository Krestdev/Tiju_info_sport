import useStore from '@/context/store'
import { Categorie, Pubs } from '@/data/temps'
import Link from 'next/link'
import React from 'react'

interface Aff {
    gridAff: Categorie[] | undefined,
    pubAff: Pubs[] | undefined
}

const UnePub = ({ gridAff, pubAff }: Aff) => {

    const { settings } = useStore();

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    return (
        <div className='flex flex-col px-7 py-5 gap-7 max-w-[360px] w-full'>
            <div className='flex flex-col'>
                <p className='text-[24px] font-semibold px-3 py-4'>{"À la une"}</p>
                <div className='flex flex-col'>
                    {
                        gridAff?.slice(0, 2).flatMap(x => x.donnees.slice(1, 4).map(x => {
                            return (
                                <Link key={x.id} href={`/user/detail-article/${x.id}`} className='flex flex-row items-center gap-4 p-4'>
                                    {x.media && (
                                        isImage(x.media[0]) ? (
                                            <img
                                                className='object-cover max-w-[80px] max-h-[60px] h-full w-full rounded-[6px]'
                                                src={x.media[0]}
                                                alt={`${x.type} - ${x.titre}`}
                                            />
                                        ) : (
                                            <video
                                                className='object-cover max-w-[80px] max-h-[60px] h-full w-full rounded-[6px]'
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
                                    <p className='line-clamp-3 leading-[18.2px] font-bold text-[14px]'>{x.titre}</p>
                                </Link>
                            )
                        })
                        )
                    }
                </div>
            </div>
            <div className='flex flex-col w-full gap-7'>
                {
                    pubAff?.slice(0, 2).map(x => {
                        return (
                            <Link key={x.id} href={x.lien}>
                                <img className='w-[300px] h-[300px] object-cover clip-custom' src={x.image} alt={settings.pub} />
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default UnePub
