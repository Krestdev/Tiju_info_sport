import { Article } from '@/data/temps';
import { isImage } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface Props {
    article: Article | undefined;
    taille: string;
    couleur: string;
}

const Info = ({ article, taille, couleur }: Props) => {
    return (
        <Link href={`/user/detail-article/${article?.id}`} className={`relative ${taille} h-full w-full`}>
            {article?.media && (
                isImage(article?.media[0]) ? (
                    <img
                        className={`${taille} w-full h-auto aspect-video rounded-none md:rounded-[6px] object-cover`}
                        src={article?.media[0]}
                        alt={`${article?.type} - ${article?.titre}`}
                    />
                ) : (
                    <video
                        className={`${taille} w-full h-auto aspect-video rounded-none md:rounded-[6px] object-cover`}
                        controls
                        muted
                        loop
                        src={article?.media[0]}
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
                    <h1 className='line-clamp-2'>{article?.titre}</h1>
                </div>
            </div>
        </Link>
    );
};

export default Info;
