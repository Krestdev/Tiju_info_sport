
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { LuHouse, LuSend, LuX } from "react-icons/lu";
import { LuChevronRight } from "react-icons/lu";
import useStore from '@/context/store';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Share2, ThumbsUp } from 'lucide-react';
import { string, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import PubsComp from '../PubsComp';
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import FullScreen from '../Dashboard/FullScreen';
import { useRouter } from 'next/navigation';
import UnePubs from '../Accueil/UnePubs';
import GridAcc from '../Accueil/GridAcc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosConfig from '@/api/api';
import Head from 'next/head';
import { Input } from '../ui/input';


const formSchema = z
    .object({
        message: z.string()
            .min(4, "Veuillez entrer au moins 4 caractères")
    });

interface Details {
    details: Article,
    similaire: Article[] | undefined
    pub: Advertisement[] | undefined,
    dataArticle: Category[] | undefined
    favorite: Category[] | null
}

const Detail = ({ details, similaire, pub, dataArticle, favorite }: Details) => {

    useEffect(() => {
        details;
        similaire;
        pub;
        dataArticle
    }, [])

    const {
        currentUser,
        settings,
        token
    } = useStore()


    const [response, setResponse] = useState('');
    const [modifie, setModifie] = useState('');
    const [openCommenter, setOpenCommenter] = useState(false)
    const [openCommenterMob, setOpenCommenterMob] = useState(false)
    const [commentaire, setCommentaire] = useState("")
    const [showReponses, setShowReponses] = useState<{ [id: number]: boolean }>({});
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [openModifier, setOpenModifier] = useState<number | null>(null);
    const [openRepondre, setOpenRepondre] = useState<number | null>(null);
    const [masquerCom, setMasquerCom] = useState(true)
    const [allPhoto, setAllPhoto] = useState(false)
    const [photo, setPhoto] = useState<string[]>()
    const [tail, setTail] = useState("max-h-[379px]")
    const queryClient = useQueryClient();
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "*/*",
    });

    const sim = dataArticle?.find(x => x.articles.find(a => a === details))

    //Fonctions principales

    // Liker un article
    const likerA = useMutation({
        mutationKey: ["comment"],
        mutationFn: (id: string) => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/articles/like/${id}`, {
                user_id: idU
            });
        },
    });

    function handleLike(id: string) {
        likerA.mutate(id);
    }

    React.useEffect(() => {
        if (likerA.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } else if (likerA.isError) {
            console.log(likerA.error)
        }
    }, [likerA.isError, likerA.isSuccess, likerA.error])

    //Unliker un commentaire

    const unLikerA = useMutation({
        mutationKey: ["comment"],
        mutationFn: (id: string) => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/articles/unlike/${id}`, {
                user_id: idU
            });
        },
    });

    function handleUnLikeA(id: string) {
        unLikerA.mutate(id);
    }

    React.useEffect(() => {
        if (unLikerA.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } else if (unLikerA.isError) {
            console.log(unLikerA.error)
        }
    }, [unLikerA.isError, unLikerA.isSuccess, unLikerA.error])

    function handleClickLikeArticleButton(id: string) {
        if (details.likes.some(x => x === currentUser?.id)) {
            handleUnLikeA(id);
        } else {
            handleLike(id);
        }
    }

    //commenter
    const commenter = useMutation({
        mutationKey: ["comment"],
        mutationFn: (id: string) => {
            const idU = String(currentUser.id)
            return axiosClient.post(`/comments/${id}`,
                {
                    user_id: idU,
                    message: commentaire
                }
            )
        }
    })
    const handleAddComment = (id: string) => {
        commenter.mutate(id);
    };

    React.useEffect(() => {
        if (commenter.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } else if (commenter.isError) {
            console.log(commenter.error)
        }
    }, [commenter.isError, commenter.isSuccess, commenter.error])

    //Repondre au commentaire
    const repondre = useMutation({
        mutationKey: ["comment"],
        mutationFn: ({ idA, idC }: { idA: string, idC: string }) => {
            const idU = String(currentUser.id)
            return axiosClient.post(`/comments/${idA}/${idC}`,
                {
                    user_id: idU,
                    message: response
                }
            )
        }
    })
    const handleResponseClick = (idA: string, idC: string) => {
        repondre.mutate({ idA, idC });
    };

    React.useEffect(() => {
        if (repondre.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } else if (repondre.isError) {
            console.log(repondre.error)
        }
    }, [repondre.isError, repondre.isSuccess, repondre.error])

    //Modifier un commentaire
    const modifierCom = useMutation({
        mutationKey: ["comment"],
        mutationFn: (id: string) => {
            return axiosClient.patch(`/comments/${id}`, {
                message: modifie
            });
        },
    });

    function handleModifierCom(id: string) {
        modifierCom.mutate(id);
    }

    React.useEffect(() => {
        if (modifierCom.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } else if (modifierCom.isError) {
            console.log(modifierCom.error)
        }
    }, [modifierCom.isError, modifierCom.isSuccess, modifierCom.error])

    //Liker les commentaires
    const likerC = useMutation({
        mutationKey: ["comment"],
        mutationFn: (id: string) => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/comments/like/${id}`, {
                user_id: idU
            });
        },
    });

    function handleLikeC(id: string) {
        likerC.mutate(id);
    }

    React.useEffect(() => {
        if (likerC.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } else if (likerC.isError) {
            console.log(likerC.error)
        }
    }, [likerC.isError, likerC.isSuccess, likerC.error])

    //Unliker un commentaire

    const unLikerC = useMutation({
        mutationKey: ["comment"],
        mutationFn: (id: string) => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/comments/unlike/${id}`, {
                user_id: idU
            });
        },
    });

    function handleUnLikeC(id: string) {
        unLikerC.mutate(id);
    }
    React.useEffect(() => {
        if (unLikerC.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } else if (unLikerC.isError) {
            console.log(unLikerC.error)
        }
    }, [unLikerC.isError, unLikerC.isSuccess, unLikerC.error])

    //Signaler les commentaires
    const signalC = useMutation({
        mutationKey: ["comment"],
        mutationFn: (id: string) => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/comments/signal/${id}`, {
                user_id: idU
            });
        },
    });

    function handleSignalC(id: string) {
        signalC.mutate(id);
    }

    React.useEffect(() => {
        if (signalC.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } else if (signalC.isError) {
            console.log(signalC.error)
        }
    }, [signalC.isError, signalC.isSuccess, signalC.error])

    //Unsignaler un commentaire

    const unsignalC = useMutation({
        mutationKey: ["comment"],
        mutationFn: (id: string) => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/comments/unsignal/${id}`, {
                user_id: idU
            });
        },
    });

    function handleUnSignalC(id: string) {
        unsignalC.mutate(id);
    }

    React.useEffect(() => {
        if (unsignalC.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        } else if (unsignalC.isError) {
            console.log(unsignalC.error)
        }
    }, [unsignalC.isError, unsignalC.isSuccess, unsignalC.error])

    //Supprimer les commentaires

    const { mutate: deleteComments } = useMutation({
        mutationFn: async (articleId: number) => {
            return axiosClient.delete(`/comments/${articleId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    const toggleComment = (id: number) => {
        setOpenModifier((prev) => (prev === id ? null : id));
    };

    const toggleRepondre = (id: number) => {
        setOpenRepondre((prev) => (prev === id ? null : id));
    };

    const toggleReponse = (id: number) => {
        setShowReponses(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });

    const handleVoirtout = () => {
        setTail("");
    }

    useEffect(() => {
        details;
        similaire;
    }, [details])

    // useEffect(() => {
    //     if (details.images) {
    //         !allPhoto ? setPhoto(details.images.slice(1, 4)) : setPhoto(details.images.slice())
    //     }
    // }, [allPhoto, details.images])


    const isImage = (media: string | undefined): boolean => {
        console.log(media);

        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };


    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();

        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHeure = Math.floor(diffMin / 60);
        const diffJour = Math.floor(diffHeure / 24);

        if (diffSec < 60) {
            return `Il y a ${diffSec} seconde${diffSec > 1 ? 's' : ''}`;
        } else if (diffMin < 60) {
            return `Il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
        } else if (diffHeure < 24) {
            return `Il y a ${diffHeure} heure${diffHeure > 1 ? 's' : ''}`;
        } else if (diffJour <= 2) {
            return `Il y a ${diffJour} jour${diffJour > 1 ? 's' : ''}`;
        } else {
            return `Publié le ${date.toLocaleDateString('fr-FR')}`;
        }
    };


    // function peutConsulter(utilisateur: Users | null, article: Article): boolean {
    //     // Si l'article est gratuit (coutMois et coutAn à 0), tout le monde peut le lire
    //     if (article.abonArticle.coutMois === 0 && article.abonArticle.coutAn === 0) {
    //         return true;
    //     }

    //     // Vérifier si l'utilisateur est défini et s'il a un abonnement
    //     if (!utilisateur || !utilisateur.abonnement) {
    //         return false; // Non connecté ou abonnement manquant → accès refusé
    //     }

    //     // Vérifier si l'abonnement de l'utilisateur permet de lire l'article
    //     return (
    //         utilisateur.abonnement.coutMois >= article.abonArticle.coutMois &&
    //         utilisateur.abonnement.coutAn >= article.abonArticle.coutAn
    //     );
    // }



    const cate = dataArticle?.find(x => x.articles.some(x => x === details))
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: details.title,
                    text: details.summery,
                    url: `https://www.tyjuinfosport.com/user/detail-article/${details.id}`,
                });
                console.log('Partage réussi');
            } catch (err) {
                console.error('Erreur lors du partage', err);
            }
        } else {
            alert("Le partage n'est pas supporté par ce navigateur.");
        }
    };

    return (

        <div className='containerBloc my-3'>
            {/* <div className='w-full flex items-center justify-start px-7 py-3 gap-1'>
                <Button className='rounded-none'><Link href={"/"}><LuHouse /></Link></Button>
                <div className='px-4 gap-2 w-fit h-[40px] flex items-center font-oswald bg-white border border-[#E4E4E4] capitalize text-[14px]'>{cate?.title}</div>
                <div className='px-4 gap-2 w-fit h-[40px] flex items-center font-oswald bg-white capitalize text-[14px]'><LuChevronRight className='size-[20px]' /></div>
                <div className='px-4 gap-2 w-fit h-[40px] flex items-center font-oswald bg-white border border-[#E4E4E4] capitalize text-[14px]'>{details.type}</div>
            </div> */}
            <div className='max-w-[1280px] w-full flex flex-col md:flex-row gap-7'>
                <div className='w-full flex flex-col md:flex-row gap-10 px-7'>
                    <div className='max-w-[824px] flex flex-col gap-5'>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <h1 className='text-[40px]'>{details.title}</h1>
                            </div>
                            {details.images &&
                                <FullScreen image={details.images ? details.images : settings.noImage}>
                                    {details.images && (
                                        // isImage(details.images ? details.images : settings.noImage) ? (
                                        <img
                                            className='max-w-[836px] w-full h-auto aspect-video rounded-[6px] object-cover'
                                            src={details.images ? `https://tiju.krestdev.com/api/image/${details.images[0].id}` : settings.noImage}
                                            alt={""}
                                        />
                                        //     ) : (
                                        //         <video
                                        //             className='max-w-[836px] w-full h-auto aspect-video rounded-[6px] object-cover'
                                        //             controls
                                        //             autoPlay
                                        //             muted
                                        //             loop
                                        //             src={details.images ? details.images : settings.noImage}
                                        //         >
                                        //             Votre navigateur ne supporte pas la lecture de cette vidéo.
                                        //         </video>
                                        //     )
                                    )
                                    }
                                </FullScreen>}
                            <div className='flex flex-col gap-4'>
                                <p className='text-[18px] font-bold'>{details.summery}</p>
                                <div
                                    // className={`${peutConsulter(currentUser, details) ? 'hidden' :`}`
                                    className={`'flex flex-row w-full items-center justify-center'} hidden`}>
                                    <Link href={"/user/subscribe"} className='w-fit px-3 py-2 gap-2 bg-[#012BAE] text-white capitalize text-center'>
                                        {`Abonnez-vous à`}
                                        {/* ${details.abonArticle.nom} */}
                                        {`pour lire cet article`}
                                    </Link>
                                </div>
                                <div>
                                    <p className='font-normal text-[18px] font-ubuntu text-[#545454]'>{`Publié ${formatDate(details.created_at)} par ${details.author.name}`}</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-6' >

                                {/* <div
                                    // className={`${peutConsulter(currentUser, details) ? '' :`}
                                    className={`'h-[100px] max-w-[836px] overflow-hidden blur-[3px] z-10 break-words'} hidden`}
                                    dangerouslySetInnerHTML={{ __html: details.description }}
                                /> */}
                                <div
                                // className={`${peutConsulter(currentUser, details) ? '' :"" }`}
                                // className={`'h-[100px] max-w-[836px] overflow-hidden blur-[3px] z-10 break-words'}`}
                                >
                                    <>
                                        {/* {peutConsulter(currentUser, details) ? */}
                                        {/* {details.description} */}
                                        <div dangerouslySetInnerHTML={{ __html: details.description }} />
                                        {/* //  : btoa(details.description).split(' ') */}
                                    </>
                                </div>
                                {/* {peutConsulter(currentUser, details) ? */}
                                <div className='flex flex-col md:grid grid-cols-4 gap-4'>
                                    {photo &&
                                        photo.map((x, i) => (
                                            <FullScreen key={i} image={x ? x : settings.noImage}>
                                                {isImage(x ? x : settings.noImage) ? (
                                                    <img
                                                        className='max-w-[374px] md:max-w-[197px] w-full h-[239px] md:h-auto aspect-video rounded-[6px] cursor-pointer object-cover overflow-hidden'
                                                        src={x ? x : settings.noImage}
                                                        alt={x}
                                                    />
                                                ) : (
                                                    <video
                                                        className='max-w-[374px] md:max-w-[197px] w-full h-[239px] md:h-auto aspect-video rounded-[6px] cursor-pointer object-cover overflow-hidden'
                                                        controls
                                                        autoPlay
                                                        muted
                                                        loop
                                                        src={x ? x : settings.noImage}
                                                    >
                                                        Votre navigateur ne supporte pas la lecture de cette vidéo.
                                                    </video>
                                                )}
                                            </FullScreen>
                                        ))
                                    }
                                    {photo && details.images && details.images?.length > 3 &&
                                        <div >
                                            {!allPhoto &&
                                                <Button onClick={() => setAllPhoto(!allPhoto)} className='max-w-[374px] md:max-w-[197px] w-full h-[239px] md:h-auto aspect-video rounded-[6px] object-cover relative overflow-hidden bg-transparent/50'>
                                                    {
                                                        isImage(photo[1] ? photo[1] : settings.noImage) ? (
                                                            <img
                                                                className='absolute z-0 w-full'
                                                                src={photo[1] ? photo[1] : settings.noImage}
                                                                alt={`${details.type} - ${details.title}`}
                                                            />
                                                        ) : (
                                                            <video
                                                                className='absolute z-0 w-full'
                                                                controls
                                                                autoPlay
                                                                muted
                                                                loop
                                                                src={photo[1] ? photo[1] : settings.noImage}
                                                            >
                                                                Votre navigateur ne supporte pas la lecture de cette vidéo.
                                                            </video>
                                                        )}
                                                    <div className='z-20 w-[374px] md:w-[197px] h-[239px] md:h-[200px] aspect-video rounded-[6px] bg-[#012BAE]/50 flex items-center justify-center text-[20px]'>
                                                        {`Tout Voir + ${details.images.length - 3}`}
                                                    </div>
                                                </Button>}
                                        </div>
                                    }
                                </div>
                                {/* : details.images &&
                                    <Link href={"/user/subscribe"} className='w-fit'>
                                        <Button className='max-w-[374px] md:max-w-[197px] w-full h-[239px] md:h-auto aspect-video rounded-[6px] object-cover relative overflow-hidden bg-transparent/50'>
                                            {
                                                isImage(details.images[1] ? details.images[1] : settings.noImage) ? (
                                                    <img
                                                        className='absolute z-0 w-full'
                                                        src={details.images[1] ? details.images[1] : settings.noImage}
                                                        alt={details.images[1]}
                                                    />
                                                ) : (
                                                    <video
                                                        className='absolute z-0 w-full'
                                                        controls
                                                        autoPlay
                                                        muted
                                                        loop
                                                        src={details.images[1] ? details.images[1] : settings.noImage}
                                                    >
                                                        Votre navigateur ne supporte pas la lecture de cette vidéo.
                                                    </video>
                                                )}
                                            <div className='z-20 w-[197px] h-[200px] aspect-video rounded-[6px] bg-[#012BAE]/80 flex flex-col gap-3 items-center justify-center text-center text-wrap'>
                                                <p>{`Abonnez-vous à`}
                                                    {`pour voir toutes les photos`}</p>
                                                {`Tout Voir + ${details.images.length - 1}`}
                                            </div>
                                        </Button>
                                    </Link> */}
                                {/* } */}
                            </div>
                        </div>

                        {/* {peutConsulter(currentUser, details) ? */}
                        <div className='flex flex-col md:flex-row md:items-center justify-between'>
                            {
                                currentUser &&
                                <div className='flex items-center gap-4'>
                                    <Button onClick={() => handleShare()} variant={'outline'} className='size-10 rounded-none border-black'><Share2 className='size-5' /></Button>
                                    <Button onClick={() => handleClickLikeArticleButton(details.id.toString())} size={'icon'} variant={'outline'} className='size-10 rounded-none border-black'>
                                        <ThumbsUp
                                            style={{
                                                color: details.likes.some(x => x === currentUser?.id) ? "#012BAE" : "#A1A1A1",
                                                cursor: "pointer",
                                            }}
                                            size={30} />
                                    </Button>
                                    <h2
                                        style={{
                                            color: details.likes.some(x => x === currentUser?.id) ? "012BAE" : "#A1A1A1",
                                            cursor: "pointer",
                                        }}
                                    >{details.likes.length}</h2>
                                    {/* <div className='hidden md:flex'>
                                        <Popover open={openCommenter} onOpenChange={setOpenCommenter}>
                                            <PopoverTrigger asChild>
                                                <Button variant={'default'} className='h-10 rounded-none'>{"COMMENTER"}</Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="hidden w-80 md:flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Textarea
                                                        placeholder="Tapez votre commentaire"
                                                        rows={2}
                                                        onChange={(e) => setCommentaire(e.target.value)}
                                                    />
                                                    <Button onClick={() => { setOpenCommenter(false); handleAddComment(details.id.toString()) }}>{"COMMENTER"}</Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div> */}
                                    <div className='flex'>
                                        <Button
                                            onClick={() => setOpenCommenter(true)}
                                        >
                                            COMMENTER
                                        </Button>

                                        {openCommenter && (
                                            <div className="fixed inset-0 flex items-end justify-center z-50">
                                                <div className="bg-white flex md:flex-col gap-2 items-center w-full max-w-md shadow-lg rounded-[20px]">
                                                    <Input
                                                        className="flex md:hidden w-full border border-gray-300 rounded-[20px] resize-none"
                                                        placeholder="Tapez votre commentaire"
                                                        value={commentaire}
                                                        onChange={(e) => setCommentaire(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <Textarea
                                                        rows={3}
                                                        className="hidden md:flex w-full border border-gray-300 resize-none"
                                                        placeholder="Tapez votre commentaire"
                                                        value={commentaire}
                                                        onChange={(e) => setCommentaire(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <div className='flex justify-end md:justify-start md:gap-2 md:mt-1'>
                                                        <Button
                                                            className='flex md:hidden bg-transparent shadow-none text-[#012BAE]'
                                                            onClick={() => { setOpenCommenter(false); handleAddComment(details.id.toString()) }}
                                                        >
                                                            <LuSend />
                                                        </Button>
                                                        <Button
                                                            className='hidden md:flex'
                                                            onClick={() => { setOpenCommenter(false); handleAddComment(details.id.toString()) }}
                                                        >
                                                            {"COMMENTER"}
                                                        </Button>
                                                        <Button
                                                            variant={"ghost"}
                                                            className='hidden md:flex'
                                                            onClick={() => {  setCommentaire(""); setOpenCommenter(false) }}
                                                        >
                                                            {"ANNULER"}
                                                        </Button>
                                                        <Button
                                                            variant={"ghost"}
                                                            className='flex md:hidden bg-transparent shadow-none text-black'
                                                            onClick={() => {  setCommentaire(""); setOpenCommenter(false) }}
                                                        >
                                                            <LuX />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            }
                            <p className='font-bold'> {details.comments.length <= 9 && '0'}{details.comments.length} Commentaire{details.comments.length > 1 && 's'}</p>
                        </div>
                        {/* : ""
                        } */}
                        <Button onClick={() => setMasquerCom(!masquerCom)} variant={'link'} className='justify-start p-0 w-fit hover:bg-transparent'>
                            {details.comments.length > 0 &&
                                <div className='flex gap-2 items-center font-ubuntu font-normal cursor-pointer text-[18px]'>
                                    {
                                        masquerCom ?
                                            <div className='flex gap-2'>
                                                <FaRegEyeSlash /> {"Masquer les commentaires"}
                                            </div> :
                                            <div className='flex gap-2'>
                                                <FaRegEye />
                                                {"Afficher les commentaires"}
                                            </div>
                                    }
                                </div>
                            }
                        </Button>
                        <div>
                            {/* {peutConsulter(currentUser, details) ? */}
                            {masquerCom ?
                                < div className='flex flex-col '>
                                    {
                                        details.comments.filter(comment => !(details.comments.flatMap(comment => comment.response.map(rep => rep.id)).includes(comment.id))).map(x => {
                                            return (
                                                <div key={x.id} className='flex flex-row py-3 gap-3'>
                                                    <img src={x.author?.photo ? x.author?.photo : '/images/no-user.jpg'} alt="" className='size-10 object-cover rounded-full' />
                                                    <div className='flex flex-col gap-2'>
                                                        <p className='font-normal text-[16px]'>{x.author?.name}</p>
                                                        <p className='text-[14px] leading-[18.2px] text-[#545454]'>{x.message}</p>
                                                        <div className='flex flex-row items-center gap-4'>
                                                            <Button disabled={!currentUser}
                                                                onClick={() => x.likes.find(x => x === currentUser?.id) ? handleUnLikeC(x.id.toString()) : handleLikeC(x.id.toString())}
                                                                style={{
                                                                    color: x.likes.some(x => x === currentUser?.id) ? "#012BAE" : "#A1A1A1",
                                                                    cursor: "pointer",
                                                                }}
                                                                variant={'ghost'} className='flex items-center justify-center gap-1 px-1'>
                                                                <ThumbsUp
                                                                    style={{
                                                                        color: currentUser && x.likes.some(x => x === currentUser?.id) ? "#012BAE" : "#A1A1A1",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    className='size-4 text-[#012BAE]' />
                                                                <p className='font-normal text-[12px] leading-[15.6px]'>{x.likes.length} </p>
                                                            </Button>
                                                            {x.author.id !== currentUser?.id ?
                                                                <div>
                                                                    <Popover open={openRepondre === x.id} onOpenChange={() => toggleRepondre(x.id)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button disabled={!currentUser} className='px-1 text-[12px] font-ubuntu' variant={'ghost'}>{"Repondre"}</Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-80 flex flex-col gap-2">
                                                                            <div className="space-y-2 bg-gray-100 rounded-full">
                                                                                <p className='text-[14px] leading-[18.2px] text-[#545454]'>{x.message}</p>
                                                                            </div>
                                                                            <div className="flex flex-col gap-2">
                                                                                <Textarea
                                                                                    placeholder="Répondre au commentaire"
                                                                                    rows={2}
                                                                                    value={response}
                                                                                    onChange={(e) => setResponse(e.target.value)}
                                                                                />
                                                                                <Button onClick={() => handleResponseClick(details.id.toString(), x.id.toString())}>{"Répondre"}</Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                    <Button disabled={!currentUser} onClick={() => x.signals.find(x => x === currentUser?.id) ? handleSignalC(x.id.toString()) : handleUnSignalC(x.id.toString())}
                                                                        style={{
                                                                            color: currentUser && x.signals && x.signals.some(x => x === currentUser?.id) ? "red" : "#A1A1A1",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        className={`px-1 text-[12px] font-ubuntu hover:text-[#012BAE]`} variant={'ghost'}>{"Signaler"}
                                                                    </Button>
                                                                </div> :
                                                                <div>
                                                                    <Popover open={openModifier === x.id} onOpenChange={() => toggleComment(x.id)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button className='px-1 text-[12px] font-ubuntu' variant={'ghost'}>{"Modifier"}</Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-80 flex flex-col gap-2">
                                                                            <div className="space-y-2 bg-gray-100 rounded-full">
                                                                                <p className='text-[14px] leading-[18.2px] text-[#545454] line-clamp-1'>{x.message}</p>
                                                                            </div>
                                                                            <div className='flex flex-col gap-2'>
                                                                                <Textarea
                                                                                    placeholder='Modifier votre commentaire'
                                                                                    rows={2}
                                                                                    defaultValue={x.message}
                                                                                    onChange={(e) => setModifie(e.target.value)}
                                                                                />
                                                                                <Button onClick={() => handleModifierCom(x.id.toString())}>{"Modifier"}</Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                    <Dialog>
                                                                        <DialogTrigger>
                                                                            <p className='px-1 text-[#B3261E] text-[12px] cursor-pointer'>{"Supprimer"}</p>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>{"Supprimer"}</DialogTitle>
                                                                                <DialogDescription>{"Voulez-vous vraiment supprimer ce commentaire?"}</DialogDescription>
                                                                            </DialogHeader>
                                                                            <DialogFooter className="sm:justify-end">
                                                                                <DialogClose asChild>
                                                                                    <Button onClick={() => deleteComments(x.id)} type="button">
                                                                                        {"Supprimer"}
                                                                                    </Button>
                                                                                </DialogClose>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </div>
                                                            }

                                                        </div>
                                                        {x.response.length > 0 &&
                                                            <div onClick={() => toggleReponse(x.id)} className='flex gap-2 items-center text-[12px] text-blue-500 cursor-pointer'>
                                                                {showReponses[x.id] ? <BiUpArrow className='size-3' /> : <BiDownArrow className='size-3' />}
                                                                {`${x.response.length} Réponse${x.response.length > 1 ? "s" : ""}`}
                                                            </div>
                                                        }
                                                        {
                                                            showReponses[x.id] ?
                                                                x.response.map(a => (
                                                                    <div key={a.id} className='flex flex-row py-3 gap-3'>
                                                                        <img src={a.author?.photo ? a.author?.photo : '/images/no-user.jpg'} alt="" className='size-10 object-cover rounded-full' />
                                                                        <div className='flex flex-col gap-2'>
                                                                            <p className='font-normal text-[16px]'>{a.author.name}</p>
                                                                            <p className='text-[14px] leading-[18.2px] text-[#545454]'>{a.message}</p>
                                                                            <div className='flex flex-row items-center gap-4'>
                                                                                <Button onClick={() => a.likes.some(x => x === currentUser?.id) ? handleUnLikeC(a.id.toString()) : handleLikeC(a.id.toString())}
                                                                                    style={{
                                                                                        color: a.likes.some(x => x === currentUser?.id) ? "red" : "#A1A1A1",
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                    variant={'ghost'} className='flex gap-1 px-1'>
                                                                                    <ThumbsUp
                                                                                        style={{
                                                                                            color: a.likes.some(x => x === currentUser?.id) ? "red" : "#A1A1A1",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                        className='size-5 text-[#012BAE]' />
                                                                                    <p className='font-normal text-[12px] leading-[15.6px]'>{a.likes.length} </p>
                                                                                </Button>
                                                                                {a.author.id !== currentUser?.id ?
                                                                                    <div>
                                                                                        <Popover open={openRepondre === a.id} onOpenChange={() => toggleRepondre(a.id)}>
                                                                                            <PopoverTrigger asChild>
                                                                                                <Button className='px-1 text-[12px] font-ubuntu' variant={'ghost'}>{"Repondre"}</Button>
                                                                                            </PopoverTrigger>
                                                                                            <PopoverContent className="w-80 flex flex-col gap-2">
                                                                                                <div className="space-y-2 bg-gray-100 rounded-full">
                                                                                                    <h3 className="line-clamp-1">{a.message}</h3>
                                                                                                </div>
                                                                                                <div className="flex flex-col gap-2">
                                                                                                    <Textarea
                                                                                                        placeholder="Répondre au commentaire"
                                                                                                        rows={2}
                                                                                                        value={response}
                                                                                                        onChange={(e) => setResponse(e.target.value)}
                                                                                                    />
                                                                                                    <Button onClick={() => handleResponseClick(details.id.toString(), x.id.toString())}>{"Répondre"}</Button>
                                                                                                </div>
                                                                                            </PopoverContent>
                                                                                        </Popover>
                                                                                        <Button onClick={() => a.signals.find(x => x === currentUser?.id) ? handleUnSignalC(a.id.toString()) : handleSignalC(a.id.toString())} style={{
                                                                                            color: a.signals.some(x => x === currentUser?.id) ? "red" : "#A1A1A1",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                            className='px-1 text-[#A1A1A1]' variant={'ghost'}>{"Signaler"}</Button>
                                                                                    </div> :
                                                                                    <div>
                                                                                        <Popover open={openModifier === a.id} onOpenChange={() => toggleComment(a.id)}>
                                                                                            <PopoverTrigger asChild>
                                                                                                <Button className='px-1 text-[12px] font-ubuntu' variant={'ghost'}>{"Modifier"}</Button>
                                                                                            </PopoverTrigger>
                                                                                            <PopoverContent className="w-80 flex flex-col gap-2">
                                                                                                <div className="space-y-2 bg-gray-100 rounded-full">
                                                                                                    <h3 className='line-clamp-1'>{a.message}</h3>
                                                                                                </div>
                                                                                                <div className='flex flex-col gap-2'>
                                                                                                    <Textarea
                                                                                                        placeholder='Modifier votre commentaire'
                                                                                                        rows={2}
                                                                                                        defaultValue={a.message}
                                                                                                        onChange={(e) => setModifie(e.target.value)}
                                                                                                    />
                                                                                                    <Button onClick={() => handleModifierCom(a.id.toString())}>{"Modifier"}</Button>
                                                                                                </div>
                                                                                            </PopoverContent>
                                                                                        </Popover>
                                                                                        <Dialog>
                                                                                            <DialogTrigger>
                                                                                                <p className='px-1 text-[#B3261E] text-[12px] cursor-pointer'>{"Supprimer"}</p>
                                                                                            </DialogTrigger>
                                                                                            <DialogContent>
                                                                                                <DialogHeader>
                                                                                                    <DialogTitle>{"Supprimer"}</DialogTitle>
                                                                                                    <DialogDescription>{"Voulez-vous vraiment supprimer ce commentaire?"}</DialogDescription>
                                                                                                </DialogHeader>

                                                                                                <DialogFooter className="sm:justify-end">
                                                                                                    <DialogClose asChild>
                                                                                                        <Button onClick={() => deleteComments(a.id)} type="button">
                                                                                                            {"Supprimer"}
                                                                                                        </Button>
                                                                                                    </DialogClose>
                                                                                                </DialogFooter>
                                                                                            </DialogContent>
                                                                                        </Dialog>
                                                                                    </div>
                                                                                }

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )) : ""
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }
                                        )
                                    }
                                    {pub && <PubsComp pub={pub?.slice().reverse()} taille={'h-[200px]'} clip={''} />}
                                </div>
                                : ""}
                            {/* : ""
                                } */}
                        </div>
                        <div className='hidden md:flex'>{sim?.articles && <GridAcc gridAff={sim?.articles.filter(x => x.id !== details.id)} />}</div>
                        {/* <GridSport liste={sim?.articles} /> */}
                    </div>
                    <div className='md:max-w-[360px] w-full md:px-7 flex flex-col gap-7'>
                        <div className={`${tail} md:max-h-full h-full overflow-hidden`}>
                            <UnePubs titre={'A la une'} couleur={'bg-[#B3261E]'} article={favorite?.slice(0, 2).flatMap(cat => cat.articles.slice(0, 1))} pubs={pub} />
                            <UnePubs titre={"Aujourd'hui"} couleur={'bg-[#01AE35]'} article={favorite?.slice().flatMap(cat => cat.articles.slice()).slice(0, 8)} pubs={pub?.slice().reverse()} />
                        </div>
                        {tail === "max-h-[379px]" && <Button variant={"outline"} className='rounded-none flex md:hidden w-fit' onClick={() => handleVoirtout()}>{"Voir Plus"}</Button>}
                        <div className='flex md:hidden'>{pub && <PubsComp pub={pub} taille={'h-[300px]'} clip={'clip-custom'} />}</div>
                        <div className='flex md:hidden'>{sim?.articles && <GridAcc gridAff={sim?.articles} />}</div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Detail
