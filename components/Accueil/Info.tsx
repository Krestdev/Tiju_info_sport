
import { isImage } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface Props {
    article: Article;
    taille?: string;
    couleur: string;
}

const Info = ({ article, taille, couleur }: Props) => {
    
    return (
        <Link href={`/user/detail-article/${article.id}`} className={`relative ${taille} h-full w-full rounded-md overflow-hidden`}>
            {article.images && (
                // isImage(article?.images[0] ? article?.images[0] : settings.noImage) ? (
                <img
                    className={`${taille} w-full h-auto aspect-video object-cover`}
                    src={ article.images[0].id ? `https://tiju.krestdev.com/api/image/${article.images[0].id}` : "/images/fecafoot.jpeg"}
                    alt={`Image`}
                />
                // ) : (
                //     <video
                //         className={`${taille} w-full h-auto aspect-video rounded-none md:rounded-[6px] object-cover`}
                //         controls
                //         muted
                //         loop
                //         src={article?.images[0] ? article?.images[0] : settings.noImage}
                //     >
                //         Votre navigateur ne supporte pas la lecture de cette vidéo.
                //     </video>
                // )
            )}
            <div className="absolute flex flex-col justify-end top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent">
                <div className='flex flex-col px-5 py-7 gap-2 w-full font-oswald uppercase text-white'>
                    <span className={`flex px-3 py-2 gap-2 ${couleur} w-fit`}>
                        {article.type}
                    </span>
                    <h3 className='article-title text-white'>{article.title}</h3>
                </div>
            </div>
        </Link>
    );
};

export default Info;
