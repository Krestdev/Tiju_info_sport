import { Article } from '@/data/temps';
import Link from 'next/link';
import React from 'react'
import Similaire from '../DetailArticle/Similaire';

interface Result {
    id: number | undefined;
    titre: string | undefined;
    nom: string;
    media: string | undefined;
}

interface Props {
    article: Result[] | undefined
}

const CategoryComp = ({ article }: Props) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };
    const premier = article && article[0]

    const path = window.location.pathname


    return (
        <div className='flex flex-row gap-7'>
            <div className='containerBloc flex flex-col gap-7'>
                <div className='flex flex-col gap-7 px-7'>
                    <div key={premier?.id} className='flex flex-col gap-4 py-4'>
                        <p className='text-[#A1A1A1]'>{premier?.nom}</p>
                        <h3>{premier?.titre}</h3>
                        <img src={premier?.media} alt={premier?.nom} className='max-w-[836px] w-full h-[420px] object-cover' />
                    </div>
                </div>
                <div className='flex flex-col gap-7'>
                    {
                        article?.filter(x => x.id !== premier?.id).map(x => (
                            <Link key={x.id} href={path === '/user/category' ? `/user/category/${x.nom}` : `/user/detail-article/${x.id}`} className='flex flex-row gap-7 px-5 py-4'>
                                <img src={x.media} alt={x.nom} className='max-w-[384px] w-full h-[203px] rounded-lg object-cover' />
                                <div className='flex flex-col'>
                                    <p className='text-[#A1A1A1]'>{x.nom}</p>
                                    <h3 className='line-clamp-3'>{x.titre}</h3>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
            <Similaire similaire={undefined} sim={undefined} />
        </div>
    )
}

export default CategoryComp
