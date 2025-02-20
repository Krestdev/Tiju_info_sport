import useStore from '@/context/store'
import { Article, Categorie } from '@/data/temps'
import Link from 'next/link'
import React from 'react'


interface Props {
    similaire: Article | undefined
    sim: Categorie | undefined,
}

const Similaire = ({ sim, similaire }: Props) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    return (
        <div className='max-w-[360px] w-full flex flex-col gap-4'>
            <div className='w-full'>
                <h2 className='flex flex-row justify-start font-oswald font-medium'>{`Dans ${sim?.nom}`}</h2>
                {
                    sim?.donnees.filter(x => x !== similaire).slice(0, 2).map(item => (
                        <Link href={`/user/detail-article/${item.id}`} key={item.id} className='flex flex-col gap-7 px-5 py-4'>
                            {item.media && (
                                isImage(item.media[0]) ? (
                                    <img
                                        className='max-w-[264px] w-full h-auto aspect-video rounded-[6px] object-cover'
                                        src={item.media[0]}
                                        alt={`${item.type} - ${item.titre}`}
                                    />
                                ) : (
                                    <video
                                        className='max-w-[264px] w-full h-auto aspect-video rounded-[6px] object-cover'
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        src={item.media[0]}
                                    >
                                        Votre navigateur ne supporte pas la lecture de cette vidéo.
                                    </video>
                                )
                            )}
                            <div className='flex flex-col'>
                                <p className='text-[#A1A1A1]'>{item.type}</p>
                                <h2 className='line-clamp-2 font-bold'>{item.titre}</h2>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Similaire
