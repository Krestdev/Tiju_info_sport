import { Article, Categorie, Pubs } from '@/data/temps';
import Link from 'next/link';
import React from 'react'
import Similaire from '../DetailArticle/Similaire';
import PubsComp from '../PubsComp';

interface Result {
    id: number | undefined;
    titre: string | undefined;
    nom: string;
    media: string[] | undefined;
}

interface Props {
    categorie: Categorie[] | undefined
    article: Result[] | undefined
    ad: Pubs[] | undefined
}

const CategoryComp = ({ article, ad, categorie }: Props) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };
    const premier = article && article[0]

    const path = window.location.pathname
    const groupSize = 5;

    // Fonction pour générer la liste avec les publicités
    const renderList = () => {
        if (article) {
            const result = [];
            for (let i = 0; i < article?.length; i += groupSize) {
                // Extraire un groupe de 4 éléments
                const group = article!.slice(i, i + groupSize);
                result.push(
                    <div key={`group-${i}`} className="group">
                        {group.filter(a => a.id !== premier?.id).map((x) => {
                            return (
                                <Link key={x.id} href={path === '/user/category' ? `/user/category/${x && x.nom}` : `/user/detail-article/${x?.id}`} className='flex flex-col-reverse lg:flex-row gap-7 px-5 py-4'>
                                    <img src={x.media && x.media[0]} alt={x.nom} className='max-w-[384px] w-full h-auto aspect-video rounded-lg object-cover' />
                                    <div className='flex flex-col'>
                                        <p className='text-[#A1A1A1]'>{x.nom}</p>
                                        <h2 className='line-clamp-3 font-bold'>{x.titre}</h2>
                                    </div>
                                </Link>
                            )
                        }
                        )}
                    </div>
                );

                // Ajouter une publicité après chaque groupe (sauf le dernier)
                if (i + groupSize < article!.length) {
                    result.push(
                        ad && <PubsComp key={`ad-${i}`} pub={ad} />
                    );
                }
            }

            // Ajouter une publicité après tous les éléments si la liste est <= 4
            if (article?.length <= groupSize) {
                result.push(
                    ad && <PubsComp key={'final'} pub={ad} />
                );
            }
            return result;
        }
    };

    const sim1 = categorie?.filter(x => x.nom !== premier?.nom)[1]
    const sim2 = categorie?.find(x => x.donnees.find(a => a.type !== premier?.nom))

    const sec1 = categorie?.filter(x => x.donnees.filter(x => x.id === premier?.id)).flatMap(x => x.donnees)[0]

    return (
        <div className='flex flex-col md:flex-row gap-7'>
            <div className='containerBloc flex flex-col gap-7'>
                <Link href={path === '/user/category' ? `/user/category/${premier && premier.nom}` : `/user/detail-article/${premier?.id}`} className='flex flex-col gap-7 px-7'>
                    <div key={premier?.id} className='flex flex-col gap-4 py-4'>
                        <p className='text-[#A1A1A1]'>{premier?.nom}</p>
                        <h2 className='font-bold'>{premier?.titre}</h2>
                        <img src={premier?.media && premier?.media[0]} alt={premier?.nom} className='max-w-[836px] w-full h-auto aspect-video object-cover' />
                    </div>
                </Link>
                <div className='flex flex-col gap-7'>{renderList()}</div>
            </div>
            <div className='max-w-[360px] flex flex-col gap-7 px-7 py-5'>
                <Similaire similaire={sec1} sim={ sim1 } />
                <PubsComp pub={ad} />
                <Similaire similaire={sec1} sim={ sim2 } />
            </div>

        </div>
    )
}

export default CategoryComp
