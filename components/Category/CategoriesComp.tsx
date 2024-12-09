import { Article } from '@/data/temps';
import Link from 'next/link';
import React from 'react'

interface Result {
    nom: string;
    media: string | undefined;
}

interface Display {
    category: Result[] | undefined
}


const CategoryComp = ({ category }: Display) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };


    return (
        <div className='containerBloc grid grid-cols-1 md:grid-cols-2 gap-12'>
            {
                category?.map((x, i) => (
                    <Link href={`/category/${x.nom}`} key={i} className='flex flex-col py-7 gap-7'>
                        {x.media && (
                            isImage(x.media) ? (
                                <img
                                    className='w-[560px] h-[260px] object-cover rounded-lg'
                                    src={x.media}
                                    alt={x.nom}
                                />
                            ) : (
                                <video
                                    className='w-[560px] h-[260px] object-cover rounded-lg'
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
                        <h3>{x.nom}</h3>
                    </Link>
                ))
            }
        </div>
    )
}

export default CategoryComp
