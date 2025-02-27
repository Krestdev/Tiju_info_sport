import { Article, Pubs } from '@/data/temps';
import React from 'react';
import PubsComp from '../PubsComp';
import Link from 'next/link';

interface Props {
    titre: string;
    couleur: string;
    article: Article[] | undefined;
    pubs: Pubs[] | undefined;
    affPub?: boolean
}

const UnePubs = ({ titre, couleur, article, pubs, affPub=false }: Props) => {
    const groupSize = 5;


    const renderArticlesWithAds = () => {
        if (!article) return null;

        const result: React.JSX.Element[] = [];

        article.forEach((x, index) => {
            result.push(
                <Link href={`/user/detail-article/${x.id}`} key={x.id} className="flex flex-col py-4 gap-2 border-t border-[#E4E4E4]">
                    <p className="uppercase font-oswald font-medium text-[14px] leading-[18.2px] text-[#A1A1A1]">
                        {x.type}
                    </p>
                    <h4 className="first-letter:uppercase line-clamp-2">{x.titre}</h4>
                </Link>
            )
            if ((index + 1) % groupSize === 0 || (article.length <= groupSize && index === article.length - 1)) {
                result.push(
                    <div key={`ad-${index}`} className={`hidden md:flex ${(article.length <= groupSize && index === article.length - 1) ? "mb-4" : ""}`}>
                        {affPub === true || affPub === undefined ? "" : <PubsComp pub={pubs} taille={'h-[300px]'} clip={'clip-custom'} />}
                    </div>
                );
            }
        });

        return result;
    };

    return (
        <div className="flex flex-col">
            <div className="border-b border-[#A1A1A1]">
                <div className={`w-fit ${couleur} px-4 py-2`}>
                    <p className="uppercase font-oswald font-medium text-[20px] leading-[26px] text-white">{titre}</p>
                </div>
            </div>
            <div>{renderArticlesWithAds()}</div>
        </div>
    );
};

export default UnePubs;
