
import useStore from '@/context/store';
import { isImage } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface Props {
    article: Article | undefined;
    taille: string;
    couleur: string;
}

const Info = ({ article, taille, couleur }: Props) => {
    const {settings} = useStore()
    return (
        <Link href={`/user/detail-article/${article?.id}`} className={`relative ${taille} h-full w-full`}>
            {article?.images && (
                isImage(article?.images[0] ? article?.images[0] : settings.noImage) ? (
                    <img
                        className={`${taille} w-full h-auto aspect-video rounded-none md:rounded-[6px] object-cover`}
                        src={article?.images[0] ? article?.images[0] : settings.noImage}
                        alt={`${article?.images[0]}`}
                    />
                ) : (
                    <video
                        className={`${taille} w-full h-auto aspect-video rounded-none md:rounded-[6px] object-cover`}
                        controls
                        muted
                        loop
                        src={article?.images[0] ? article?.images[0] : settings.noImage}
                    >
                        Votre navigateur ne supporte pas la lecture de cette vidéo.
                    </video>
                )
            )}
            <div className="absolute flex flex-col justify-end top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent rounded-none md:rounded-[6px]">
                <div className='flex flex-col px-5 py-7 gap-2 max-w-[824px] w-full  font-oswald uppercase text-white'>
                    <div className={`flex px-3 py-2 gap-2 ${couleur} w-fit`}>
                        {article?.type}
                    </div>
                    <h1 className='line-clamp-2'>{article?.title}</h1>
                </div>
            </div>
        </Link>
    );
};

export default Info;
