import { Article, Categorie, Pubs } from '@/data/temps';
import React from 'react'
import Similaire from '../DetailArticle/Similaire';
import PubsComp from '../PubsComp';
import Info from '../Accueil/Info';
import UnePubs from '../Accueil/UnePubs';
import Link from 'next/link';
import { Button } from '../ui/button';

interface Result {
    id: number | undefined;
    titre: string | undefined;
    nom: string;
    media: string[] | undefined;
}

interface Props {
    categorie: Categorie[] | undefined
    article: Article[] | undefined
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
                    <div key={`group-${i}`} className='group grid grid-cols-1 md:grid-cols-2 w-full gap-7'>
                        {group.filter(a => a.id !== premier?.id).map((x) => {
                            const cat = categorie?.find(a => a.donnees.some(b => b.id === x?.id))
                            return (
                                <Link  href={path === '/user/category' ? `/user/category/${cat?.nom}` : `/user/detail-article/${x?.id}`} key={x.id} className='max-w-[398px] w-full flex flex-col gap-5'>
                                    {x.media && (
                                        isImage(x.media[0]) ? (
                                            <img
                                                className="max-w-[398px] w-full h-auto aspect-video rounded-[6px] object-cover"
                                                src={x.media[0]}
                                                alt={`${x.type} - ${x.titre}`}
                                            />
                                        ) : (
                                            <video
                                                className="max-w-[398px] w-full h-auto aspect-video rounded-[6px] object-cover"
                                                controls
                                                muted
                                                loop
                                                src={x.media[0]}
                                            >
                                                Votre navigateur ne supporte pas la lecture de cette vidéo.
                                            </video>
                                        )
                                    )}
                                    <div>
                                        <p className='text-[#A1A1A1] text-[20px] uppercase font-medium leading-[26px] font-oswald'>{cat?.nom}</p>
                                        <p className='text-[28px] font-medium leading-[36.4px] line-clamp-2 font-oswald'>{x.titre}</p>
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
                        ad && <PubsComp key={`ad-${i}`} pub={ad} taille={'h-[200px]'} clip={''} />
                    );
                }
            }

            // Ajouter une publicité après tous les éléments si la liste est <= 4
            if (article?.length <= groupSize) {
                result.push(
                    ad && <PubsComp key={'final'} pub={ad} taille={'h-[200px]'} clip={''} />
                );
            }
            return result;
        }
    };

    const sim1 = categorie?.find(x => x.donnees.some(x => x.id === premier?.id))

    return (
        <div className='flex flex-col'>
            {
                <div className='flex flex-row gap-1 px-7 py-3'>
                    <h1 className='uppercase'>{path === '/user/category' ? "Catégories" : ""}</h1>
                </div>
            }
            <div className='flex flex-row gap-1 px-7 py-3'>
                {
                    categorie?.map((x, i) => (
                        <Button variant={"outline"} className='rounded-none' key={i}>
                            <Link href={`/user/category/${x.nom}`}>{x.nom}</Link>
                        </Button>
                    ))
                }
            </div>
            <div className='flex flex-col justify-center md:flex-row gap-7'>
                <div className='flex flex-col'>
                    <div className='max-w-[824px] w-full flex flex-col gap-7'>
                        <Link href={path === '/user/category' ? `/user/category/${sim1?.nom}` : `/user/detail-article/${premier?.id}`} className='flex flex-col gap-7'>
                            <div key={premier?.id} className={`relative max-w-[824px] max-h-[320px] h-full w-full`}>
                                {premier?.media && (
                                    isImage(premier?.media[0]) ? (
                                        <img
                                            className={`max-w-[824px] max-h-[320px] w-full h-auto aspect-video rounded-none md:rounded-[6px] object-cover`}
                                            src={premier?.media[0]}
                                            alt={`${premier?.type} - ${premier?.titre}`}
                                        />
                                    ) : (
                                        <video
                                            className={`max-w-[824px] max-h-[320px] w-full h-auto aspect-video rounded-none md:rounded-[6px] object-cover`}
                                            controls
                                            muted
                                            loop
                                            src={premier?.media[0]}
                                        >
                                            Votre navigateur ne supporte pas la lecture de cette vidéo.
                                        </video>
                                    )
                                )}
                                <div className="absolute flex flex-col justify-end top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent rounded-none md:rounded-[6px]">
                                    <div className='flex flex-col px-5 py-7 gap-2 max-w-[824px] w-full  font-oswald uppercase text-white'>
                                        <div className='flex px-3 py-2 gap-2 bg-[#01AE35] w-fit'>
                                            {sim1?.nom}
                                        </div>
                                        <h1 className='line-clamp-2'>{premier?.titre}</h1>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className='flex flex-col gap-7'>{renderList()}</div>
                    </div>
                </div>
                <div className='max-w-[360px] w-full bg-blue-100 flex flex-col gap-7 px-7 py-5'>
                    <UnePubs titre={'A la une'} couleur={'bg-[#B3261E]'} article={[]} pubs={[]} />
                    <UnePubs titre={"Aujourd'hui"} couleur={'bg-[#01AE35]'} article={[]} pubs={[]} />
                </div>
            </div>
        </div>
    )
}

export default CategoryComp
