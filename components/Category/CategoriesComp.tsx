
import React, { useEffect, useMemo, useState } from 'react'
import Similaire from '../DetailArticle/Similaire';
import PubsComp from '../PubsComp';
import Info from '../Accueil/Info';
import UnePubs from '../Accueil/UnePubs';
import Link from 'next/link';
import { Button } from '../ui/button';
import useStore from '@/context/store';
import { usePathname } from 'next/navigation';
import { LuPlus } from "react-icons/lu";

interface Props {
    categorie: Category[] | undefined
    article: Article[] | undefined
    ad: Advertisement[] | undefined
    categoriesList: Category[] | undefined
    setArticle: React.Dispatch<React.SetStateAction<Article[] | undefined>>
}

const CategoryComp = ({ article, ad, categorie, categoriesList, setArticle }: Props) => {

    const { favorite, settings } = useStore()
    const [tail, setTail] = useState("max-h-[379px]")
    const [liste, setListe] = useState<Category[] | undefined>([])
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [allArticles, setAllArticles] = useState<Article[]>(article || []);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>(article || []);



    const handleVoirtout = () => {
        setTail("");
    }
    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };
    const premier = filteredArticles && filteredArticles[0]
    const path = window.location.pathname

    const isUserAtSecondLastSegment = (path: string): boolean => {
        const segments = path.split("/").filter(Boolean);
        return segments.length === 2 && segments[0] === "user";
    };

    const groupSize = 5;

    // Fonction pour générer la liste avec les publicités
    const renderList = () => {
        if (filteredArticles) {
            const result = [];
            for (let i = 0; i < filteredArticles?.length; i += groupSize) {
                // Extraire un groupe de 4 éléments
                const group = filteredArticles?.slice(i, i + groupSize)
                result.push(
                    <div key={`group-${i}`} className='group grid grid-cols-1 md:grid-cols-2 px-7 md:px-0 w-full gap-7'>
                        {group?.filter(a => a.id !== premier?.id).map((x) => {
                            const cat = categorie?.find(a => a.articles.some(b => b.id === x?.id))

                            return (
                                <Link href={`/user/detail-article/${x?.id}`} key={x.id} className='max-w-[398px] w-full flex flex-col gap-5'>
                                    {x.images && (
                                        // isImage(x?.images[0] ? x?.images[0] : settings.noImage) ? (
                                        <img
                                            className="max-w-[398px] w-full h-auto aspect-video rounded-[6px] object-cover"
                                            src={x.images ? `https://tiju.krestdev.com/api/image/${x.images[0].id}` : settings.noImage}
                                            alt={`${x?.images[0]}`}
                                        />
                                        // ) : (
                                        //     <video
                                        //         className="max-w-[398px] w-full h-auto aspect-video rounded-[6px] object-cover"
                                        //         controls
                                        //         muted
                                        //         loop
                                        //         src={x?.images[0] ? x?.images[0] : settings.noImage}
                                        //     >
                                        //         Votre navigateur ne supporte pas la lecture de cette vidéo.
                                        //     </video>
                                        // )
                                    )}
                                    <div>
                                        <p className='text-[#A1A1A1] text-[20px] uppercase font-medium leading-[26px] font-oswald'>{isUserAtSecondLastSegment(path) ? cat?.title : x.type}</p>
                                        <p className='text-[28px] font-medium leading-[36.4px] line-clamp-2 font-oswald'>{x.title}</p>
                                    </div>
                                </Link>
                            )
                        }
                        )}
                    </div>
                );

                // Ajouter une publicité après chaque groupe (sauf le dernier)
                if (i + groupSize < filteredArticles!.length) {
                    result.push(
                        <div key={`ad-${i}`} className='px-7 md:px-0'>
                            {
                                ad && <PubsComp pub={ad} taille={'h-[200px]'} clip={''} />
                            }
                        </div>
                    );
                }
            }

            // Ajouter une publicité après tous les éléments si la liste est <= 4
            if (filteredArticles?.length <= groupSize) {
                result.push(
                    <div key={'final'} className='px-7 md:px-0'>
                        {
                            ad && <PubsComp pub={ad} taille={'h-[200px]'} clip={''} />
                        }
                    </div>
                );
            }
            return result;
        }
    };

    const sim1 = categoriesList?.find(x => x.articles?.some(x => x.id === premier?.id))

    const pathname = usePathname();

    const selected = useMemo(() => {
        return decodeURIComponent(pathname?.split('/').pop()!);
    }, [pathname]);

    // Mise à jour initiale si article vient de props
    useEffect(() => {
        if (article) {
            setAllArticles(article);
            setFilteredArticles(article);
        }
    }, [article]);

    useEffect(() => {
        setListe(categorie?.filter(x => x.parent === categoriesList?.find(x => x.title === selected)?.id && x.articles.length > 0))
    }, [article, categorie, selected, categoriesList])

    return (
        <div className='flex flex-col'>
            {/* {
                <div className='flex flex-row gap-1 px-0 md:px-7'>
                    {path === '/user' ?
                        <div className='flex items-center gap-4 px-7 py-4'>
                            <h1 className='uppercase'>{"Catégories"}</h1>
                        </div> :
                        <div className='flex items-center gap-4 px-7 py-4'>
                            <h1 className='uppercase'>{sim1?.title}</h1>
                            <Button className='flex gap-2 bg-[#FF0068] rounded-none'><LuPlus className='size-5' />{"Ajouter aux favoris"}</Button>
                        </div>
                    }
                </div>
            } */}
            <div className='flex flex-row gap-1 py-3 overflow-x-auto scrollbar-hide'>
                {/* Bouton pour tout afficher */}
                <Button
                    onClick={() => {
                        setSelectedTag(null);
                        setArticle(article); 
                        setFilteredArticles(allArticles)
                    }}
                    variant={"outline"}
                    className={`rounded-none ${selectedTag === null ? "bg-[#0128AE] hover:bg-[#0128AE] hover:text-white text-white" : ""}`}
                >
                    <p>Tout</p>
                </Button>

                {/* Boutons dynamiques des tags */}
                {[...new Set(liste?.map(a => a.title))].map((x, i) => (
                    <Button
                        key={i}
                        onClick={() => {
                            if (selectedTag === x) {
                                // Si on clique à nouveau sur le même tag, on réinitialise le filtre
                                setSelectedTag(null);
                                setFilteredArticles(allArticles);
                            } else {
                                setSelectedTag(x);
                                const filtered = allArticles.filter(a => a.type === x);
                                setFilteredArticles(filtered);
                            }
                        }}
                        variant={"outline"}
                        className={`rounded-none ${selectedTag === x
                            ? "bg-[#0128AE] hover:bg-[#0128AE] hover:text-white text-white"
                            : ""
                            }`}
                    >
                        <p>{x}</p>
                    </Button>
                ))}
            </div>
            <div className='flex flex-col md:flex-row gap-7'>
                <div className='max-w-[824px] w-full h-fit flex flex-col md:sticky md:top-0'>
                    <div className=' flex flex-col justify-start gap-7'>
                        <Link href={`/user/detail-article/${premier?.id}`} className='flex flex-col gap-7'>
                            <div key={premier?.id} className={`relative max-w-[824px] max-h-[320px] h-full w-full`}>
                                {premier?.images && (
                                    // isImage(premier?.images[0] ? premier?.images[0] : settings.noImage) ? (
                                    <img
                                        className={`max-w-[824px] w-full max-h-[320px] h-auto aspect-video rounded-none md:rounded-[6px] object-cover`}
                                        src={premier.images ? `https://tiju.krestdev.com/api/image/${premier.images[0].id}` : settings.noImage}
                                        alt={`${premier.images[0]}`}
                                    />
                                    // ) : (
                                    //     <video
                                    //         className={`max-w-[824px] w-full max-h-[320px] h-auto aspect-video rounded-none md:rounded-[6px] object-cover`}
                                    //         controls
                                    //         muted
                                    //         loop
                                    //         src={premier?.images[0] ? premier?.images[0] : settings.noImage}
                                    //     >
                                    //         Votre navigateur ne supporte pas la lecture de cette vidéo.
                                    //     </video>
                                    // )
                                )}
                                <div className="absolute flex flex-col justify-end top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent rounded-none md:rounded-[6px]">
                                    <div className='flex flex-col px-5 py-7 gap-2 max-w-[824px] w-full  font-oswald uppercase text-white'>
                                        <div className='flex px-3 py-2 gap-2 bg-[#01AE35] w-fit'>
                                            {path === '/user' ? sim1?.title : premier?.type}
                                        </div>
                                        <h1 className='line-clamp-2'>{premier?.title}</h1>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className='flex flex-col gap-7'>{renderList()}</div>
                    </div>
                </div>
                <div className={`${tail} md:max-h-full h-full overflow-hidden max-w-[360px] w-full flex flex-col gap-7 px-7 py-5 md:py-0 md:sticky md:top-0`}>
                    {ad && <UnePubs titre={'A la une'} couleur={'bg-[#B3261E]'} article={favorite?.slice(0, 2).flatMap(cat => cat.articles).slice(0, 1)} pubs={ad} />}
                    {ad && <UnePubs titre={"Aujourd'hui"} couleur={'bg-[#01AE35]'} article={favorite?.slice().flatMap(cat => cat.articles).slice(0, 8)} pubs={ad.slice().reverse()} />}
                </div>
                {tail === "max-h-[379px]" && <Button variant={"outline"} className='rounded-none w-fit mx-7 flex md:hidden' onClick={() => handleVoirtout()}>{"Voir Plus"}</Button>}
                <div className='flex md:hidden px-7 mt-7'>{ad && <PubsComp pub={ad} taille={'h-[300px]'} clip={'clip-custom'} />}</div>
            </div>
        </div>
    )
}

export default CategoryComp
