import { Article, Categorie, Pubs } from '@/data/temps';
import React, { useState } from 'react'
import Similaire from '../DetailArticle/Similaire';
import PubsComp from '../PubsComp';
import Info from '../Accueil/Info';
import UnePubs from '../Accueil/UnePubs';
import Link from 'next/link';
import { Button } from '../ui/button';
import useStore from '@/context/store';
import { usePathname } from 'next/navigation';
import { LuPlus } from "react-icons/lu";
import { group } from 'console';

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
    favorite: Categorie[] | undefined
}

const CategoryComp = ({ article, ad, categorie }: Props) => {

    const { favorite } = useStore()
    const [tail, setTail] = useState("max-h-[379px]")
    const [display, setDisplay] = useState(article)

    const handleVoirtout = () => {
        setTail("");
    }
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
                const group = article?.slice(i, i + groupSize) 
                result.push(
                    <div key={`group-${i}`} className='group grid grid-cols-1 md:grid-cols-2 px-7 md:px-0 w-full gap-7'>
                        {group?.filter(a => a.id !== premier?.id).map((x) => {
                            const cat = categorie?.find(a => a.donnees.some(b => b.id === x?.id))
                            return (
                                <Link href={path === '/user/category' ? `/user/category/${cat?.nom}` : `/user/detail-article/${x?.id}`} key={x.id} className='max-w-[398px] w-full flex flex-col gap-5'>
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
                                        <p className='text-[#A1A1A1] text-[20px] uppercase font-medium leading-[26px] font-oswald'>{path === '/user/category' ? cat?.nom : x.type}</p>
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
                        <div key={`ad-${i}`} className='px-7 md:px-0'>
                            {
                                ad && <PubsComp pub={ad} taille={'h-[154px]'} clip={''} />
                            }
                        </div>
                    );
                }
            }

            // Ajouter une publicité après tous les éléments si la liste est <= 4
            if (article?.length <= groupSize) {
                result.push(
                    <div key={'final'} className='px-7 md:px-0'>
                        {
                            ad && <PubsComp pub={ad} taille={'h-[154px]'} clip={''} />
                        }
                    </div>
                );
            }
            return result;
        }
    };

    const sim1 = categorie?.find(x => x.donnees.some(x => x.id === premier?.id))

    const pathname = usePathname();
    const categoryId = pathname?.split('/').pop();


    return (
        <div className='flex flex-col'>
            {
                <div className='flex flex-row gap-1 px-0 md:px-7'>
                    {path === '/user/category' ?
                        <div className='flex items-center gap-4 px-7 py-4'>
                            <h1 className='uppercase'>{"Catégories"}</h1>
                        </div> :
                        <div className='flex items-center gap-4 px-7 py-4'>
                            <h1 className='uppercase'>{categoryId}</h1>
                            <Button className=' flex gap-2 bg-[#FF0068] rounded-none'><LuPlus className='size-5' />{"Ajouter aux favoris"}</Button>
                        </div>
                    }
                </div>
            }
            {path === '/user/category' ? <div className='flex flex-row gap-1 px-7 py-3 overflow-x-auto scrollbar-hide'>
                {
                    categorie?.map((x, i) => (
                        <Button variant={"outline"} className='rounded-none' key={i}>
                            <Link href={`/user/category/${x.nom}`}>{x.nom}</Link>
                        </Button>
                    ))
                }
            </div> :
                <div className='flex flex-row gap-1 px-7 py-3 overflow-x-auto scrollbar-hide'>
                    {
                        [...new Set(article?.map(x => x.type))]
                        .map((x, i) => (
                            <Button onClick={() => setDisplay(article?.filter(a => a.type === x))} variant={"outline"} className='rounded-none' key={i}>
                                {x}
                            </Button>
                        ))
                    }
                </div>
            }
            <div className='flex flex-col justify-center md:flex-row gap-7'>
                <div className='h-fit flex flex-col items-center sticky top-0'>
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
                                            {path === '/user/category' ? sim1?.nom : premier?.type}
                                        </div>
                                        <h1 className='line-clamp-2'>{premier?.titre}</h1>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className='flex flex-col gap-7'>{renderList()}</div>
                    </div>
                </div>
                <div className={`${tail} md:max-h-full h-full overflow-hidden max-w-[360px] w-full flex flex-col gap-7 px-7 py-5 md:py-0 sticky top-0`}>
                    <UnePubs titre={'A la une'} couleur={'bg-[#B3261E]'} article={favorite?.slice(0, 2).flatMap(cat => cat.donnees.slice(0, 1))} pubs={ad} />
                    <UnePubs titre={"Aujourd'hui"} couleur={'bg-[#01AE35]'} article={favorite?.slice().flatMap(cat => cat.donnees.slice()).slice(0, 8)} pubs={ad?.slice().reverse()} />
                </div>
                {tail === "max-h-[379px]" && <Button variant={"outline"} className='rounded-none w-fit mx-7 flex md:hidden' onClick={() => handleVoirtout()}>{"Voir Plus"}</Button>}
                <div className='flex md:hidden px-7 mt-7'>{ad && <PubsComp pub={ad} taille={'h-[300px]'} clip={'clip-custom'} />}</div>
            </div>
        </div>
    )
}

export default CategoryComp
