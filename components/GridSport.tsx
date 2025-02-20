import { Article } from '@/data/temps'
import Link from 'next/link'
import React from 'react'

interface Props {
    liste: Article[] | undefined
}

const GridSport = ({ liste }: Props) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-7'>
            {
                liste?.map(x => (
                    <Link href={`/user/detail-article/${x.id}`} key={x.id} className='flex flex-col max-w-[400px] w-full px-5 py-4 gap-7'>
                        {x.media && (
                            isImage(x.media[0]) ? (
                                <img
                                    className='max-w-[360px] w-full h-[203px] object-cover rounded-[6px]'
                                    src={x.media[0]}
                                    alt={`${x.type} - ${x.titre}`}
                                />
                            ) : (
                                <video
                                    className='max-w-[360px] w-full h-[203px] object-cover rounded-[6px]'
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
                            <p className='text-[#A1A1A1]'>{x.type}</p>
                            <h2 className='line-clamp-2 font-bold'>{x.titre}</h2>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default GridSport
