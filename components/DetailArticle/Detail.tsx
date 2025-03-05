import { Article, Categorie, comment, Pubs, Users } from '@/data/temps'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { LuHouse } from "react-icons/lu";
import { LuChevronRight } from "react-icons/lu";
import useStore from '@/context/store';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Share2, ThumbsUp } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import PubsComp from '../PubsComp';
import Similaire from './Similaire';
import GridSport from '../GridSport';
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import FullScreen from '../Dashboard/FullScreen';
import { useRouter } from 'next/navigation';
import UnePubs from '../Accueil/UnePubs';
import GridAcc from '../Accueil/GridAcc';


const formSchema = z
    .object({
        message: z.string()
            .min(4, "Veuillez entrer au moins 4 caractères")
    });

interface Details {
    details: Article,
    similaire: Article[] | undefined
    pub: Pubs[] | undefined,
    dataArticle: Categorie[] | undefined
    favorite: Categorie[] | undefined
}

const Detail = ({ details, similaire, pub, dataArticle, favorite }: Details) => {

    const router = useRouter()

    useEffect(() => {
        details;
        similaire;
        pub;
        dataArticle
    }, [])

    const {
        addLike,
        addComment,
        addResponse,
        currentUser,
        deleteComment,
        editComment,
        editReponse,
        deleteReponse,
        addSignals,
        likeComment,
        addResponseLike,
        addResponseSignals
    } = useStore()
    const [like, setLike] = useState(details.like.some(u => u.id === currentUser?.id))
    const [signal, setSignal] = useState<number[]>([])


    const [response, setResponse] = useState('');
    const [modifie, setModifie] = useState('');
    const [openCommenter, setOpenCommenter] = useState(false)
    const [commentaire, setCommentaire] = useState("")
    const [showReponses, setShowReponses] = useState<{ [id: number]: boolean }>({});
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [openModifier, setOpenModifier] = useState<number | null>(null);
    const [openRepondre, setOpenRepondre] = useState<number | null>(null);
    const [masquerCom, setMasquerCom] = useState(true)
    const [allPhoto, setAllPhoto] = useState(false)
    const [photo, setPhoto] = useState<string[]>()
    const [tail, setTail] = useState("max-h-[379px]")

    const sec = dataArticle?.filter(x => x.donnees.filter(x => x === details)).flatMap(x => x.donnees)[0]
    const sim = dataArticle?.find(x => x.donnees.find(a => a === details))
    const second = dataArticle?.filter(x => x.nom !== sim?.nom)[0]

    // console.log(sim);


    const toggleComment = (id: number) => {
        setOpenModifier((prev) => (prev === id ? null : id));
    };

    const toggleRepondre = (id: number) => {
        setOpenRepondre((prev) => (prev === id ? null : id));
    };

    const toggleReponse = (id: number) => {
        setShowReponses((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });

    const handleAddComment = () => {
        if (commentaire.trim() !== "") {
            const newComment = {
                id: Date.now(),
                user: currentUser,
                date: Date.now().toString(),
                message: commentaire,
                reponse: [],
                like: [],
                signals: [],
                delete: false
            };
            addComment(newComment, details.id);
            setCommentaire("");
            setOpenCommenter(false);
        }
    };

    const handleVoirtout = () => {
        setTail("");
    }

    useEffect(() => {
        details;
        similaire;
    }, [details])

    useEffect(() => {
        if (details.media) {
            !allPhoto ? setPhoto(details.media?.slice(1, 4)) : setPhoto(details.media.slice())
        }
    }, [allPhoto, details.media])


    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    const handleImageClick = (src: string) => {
        setFullscreenImage(src);
    };

    const handleCloseFullscreen = () => {
        setFullscreenImage(null);
    };

    const handleLike = () => {
        const userLike: Omit<Users, "password"> | null = currentUser && (({ password, ...rest }) => rest)(currentUser);
        setLike(!like)
        addLike(details.id, userLike!)
    }

    const handleSignal = (id: number) => {
        const userSignal: Omit<Users, "password"> | null = currentUser && (({ password, ...rest }) => rest)(currentUser);
        setSignal([...signal, id])
        addSignals(id, userSignal!)
    }

    const handleLikeC = (id: number) => {
        const userLike: Omit<Users, "password"> | null = currentUser && (({ password, ...rest }) => rest)(currentUser);
        likeComment(id, userLike!)
    }

    const handleLikeR = (idC: number, idR: number) => {
        const userLike: Omit<Users, "password"> | null = currentUser && (({ password, ...rest }) => rest)(currentUser);
        addResponseLike(idC, idR, userLike!)
    }

    const handleSignalR = (idC: number, idR: number) => {
        const userSignal: Omit<Users, "password"> | null = currentUser && (({ password, ...rest }) => rest)(currentUser);
        addResponseSignals(idC, idR, userSignal!)
    }



    const handleResponseClick = (comment: comment) => {
        try {
            // Crée un nouveau commentaire
            const newComment: comment = {
                id: Date.now(),
                date: Date.now().toString(),
                user: currentUser,
                message: response,
                reponse: [],
                like: [],
                signals: [],
                delete: false
            };

            // Appelle la fonction addComment pour ajouter le commentaire
            addResponse(newComment, details.id, comment.id);
            toggleRepondre(comment.id)
            setResponse("")
        } catch (error) {
            console.error("Une erreur est survenue: ", error)
        }
    };

    const handleModifierCom = (id: number) => {
        try {
            // Appelle la fonction addComment pour ajouter le commentaire
            editComment(id, modifie);
            toggleComment(id)
        } catch (error) {
            console.error("Une erreur est survenue: ", error)
        }
    };

    const handleModifierRep = (idC: number, idR: number) => {
        try {
            // Appelle la fonction addComment pour ajouter le commentaire
            editReponse(idC, idR, modifie);
            toggleComment(idC)
        } catch (error) {
            console.error("Une erreur est survenue: ", error)
        }
    };


    async function handleDeleteComment(id: number) {
        try {
            deleteComment(id);
        } catch (error) {
            console.error("Une erreur est survenue: ", error)
        }
    }

    async function handleDeleteRep(idC: number, idR: number) {
        try {
            deleteReponse(idC, idR);
        } catch (error) {
            console.error("Une erreur est survenue: ", error)
        }
    }

    const handleShare = async (image: File[], text: string) => {
        if (navigator.canShare({ files: image })) {
            await navigator.share({
                title: "Partage",
                text: text,
                files: image
            })
            console.log("Succes");

        } else {
            console.log("erreur");

        }
    }

    const cate = dataArticle?.find(x => x.donnees.some(x => x === details))

    return (

        <div className='containerBloc my-3'>
            <div className='w-full flex items-center justify-start px-7 py-3 gap-1'>
                <Button className='rounded-none'><Link href={"/"}><LuHouse /></Link></Button>
                <div className='px-4 gap-2 w-fit h-[40px] flex items-center font-oswald bg-white border border-[#E4E4E4] capitalize text-[14px]'>{cate?.nom}</div>
                <div className='px-4 gap-2 w-fit h-[40px] flex items-center font-oswald bg-white capitalize text-[14px]'><LuChevronRight className='size-[20px]' /></div>
                <div className='px-4 gap-2 w-fit h-[40px] flex items-center font-oswald bg-white border border-[#E4E4E4] capitalize text-[14px]'>{details.type}</div>
            </div>
            <div className='max-w-[1280px] w-full flex flex-col md:flex-row gap-7'>
                <div className='w-full flex flex-col md:flex-row gap-10 px-7'>
                    <div className='max-w-[824px] flex flex-col gap-5'>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <h1 className='text-[40px]'>{details.titre}</h1>
                            </div>
                            {details.media &&
                                <FullScreen image={details.media[0]}>
                                    {details.media && (
                                        isImage(details.media[0]) ? (
                                            <img
                                                className='max-w-[836px] w-full h-auto aspect-video rounded-[6px] object-cover'
                                                src={details.media[0]}
                                                alt={`${details.type} - ${details.titre}`}
                                            />
                                        ) : (
                                            <video
                                                className='max-w-[836px] w-full h-auto aspect-video rounded-[6px] object-cover'
                                                controls
                                                autoPlay
                                                muted
                                                loop
                                                src={details.media[0]}
                                            >
                                                Votre navigateur ne supporte pas la lecture de cette vidéo.
                                            </video>
                                        )
                                    )}
                                </FullScreen>}
                            <div className='flex flex-col gap-4'>
                                <p className='text-[18px] text-[#545454] font-bold'>{details.extrait}</p>
                                <div className={`${details.abonArticle.cout === 0 || (currentUser && currentUser?.abonnement?.cout !== undefined && currentUser?.abonnement.cout >= details.abonArticle.cout) ? 'hidden' : 'flex flex-row w-full items-center justify-center'}`}>
                                    <Link href={"/user/subscribe"} className='w-fit px-3 py-2 gap-2 bg-[#012BAE] text-white capitalize text-center'>{`Abonnez-vous à ${details.abonArticle.nom} pour lire cet article`}</Link>
                                </div>
                                <div>
                                    <p className='font-bold text-[18px]'>{details.user.nom}</p>
                                    <p className='text-[#A1A1A1] text-[18px]'>{details.ajouteLe}</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-6'>
                                <div className={`${details.abonArticle.cout === 0 || (currentUser && currentUser?.abonnement?.cout !== undefined && currentUser?.abonnement.cout >= details.abonArticle.cout) ? '' : 'h-[100px] max-w-[836px] overflow-hidden blur-[3px] z-10 break-words'}`}>
                                    <p className='font-normal'>{details.abonArticle.cout === 0 || (currentUser && currentUser?.abonnement?.cout !== undefined && currentUser?.abonnement.cout >= details.abonArticle.cout) ? details.description : btoa(details.description).split(' ')}</p>
                                </div>
                                {details.abonArticle.cout === 0 || (currentUser && currentUser?.abonnement?.cout !== undefined && currentUser?.abonnement.cout >= details.abonArticle.cout) ?
                                    <div className='flex flex-col md:grid grid-cols-4 gap-4'>
                                        {photo &&
                                            photo.map((x, i) => (
                                                <FullScreen key={i} image={x}>
                                                    {isImage(x) ? (
                                                        <img
                                                            className='max-w-[374px] md:max-w-[197px] w-full h-[239px] md:h-auto aspect-video rounded-[6px] cursor-pointer object-cover overflow-hidden'
                                                            src={x}
                                                            alt={`${details.type} - ${details.titre}`}
                                                        />
                                                    ) : (
                                                        <video
                                                            className='max-w-[374px] md:max-w-[197px] w-full h-[239px] md:h-auto aspect-video rounded-[6px] cursor-pointer object-cover overflow-hidden'
                                                            controls
                                                            autoPlay
                                                            muted
                                                            loop
                                                            src={x}
                                                        >
                                                            Votre navigateur ne supporte pas la lecture de cette vidéo.
                                                        </video>
                                                    )}
                                                </FullScreen>
                                            ))
                                        }
                                        {photo && details.media && details.media?.length > 3 &&
                                            <div >
                                                {!allPhoto &&
                                                    <Button onClick={() => setAllPhoto(!allPhoto)} className='max-w-[374px] md:max-w-[197px] w-full h-[239px] md:h-auto aspect-video rounded-[6px] object-cover relative overflow-hidden bg-transparent/50'>
                                                        {
                                                            isImage(photo[1]) ? (
                                                                <img
                                                                    className='absolute z-0 w-full'
                                                                    src={photo[1]}
                                                                    alt={`${details.type} - ${details.titre}`}
                                                                />
                                                            ) : (
                                                                <video
                                                                    className='absolute z-0 w-full'
                                                                    controls
                                                                    autoPlay
                                                                    muted
                                                                    loop
                                                                    src={photo[1]}
                                                                >
                                                                    Votre navigateur ne supporte pas la lecture de cette vidéo.
                                                                </video>
                                                            )}
                                                        <div className='z-20 w-[374px] md:w-[197px] h-[239px] md:h-[200px] aspect-video rounded-[6px] bg-[#012BAE]/50 flex items-center justify-center text-[20px]'>
                                                            {`Tout Voir + ${details.media.length - 3}`}
                                                        </div>
                                                    </Button>}
                                            </div>
                                        }
                                    </div> : details.media &&
                                    <Link href={"/user/subscribe"} className='w-fit'>
                                        <Button className='max-w-[374px] md:max-w-[197px] w-full h-[239px] md:h-auto aspect-video rounded-[6px] object-cover relative overflow-hidden bg-transparent/50'>
                                            {
                                                isImage(details.media[1]) ? (
                                                    <img
                                                        className='absolute z-0 w-full'
                                                        src={details.media[1]}
                                                        alt={`${details.type} - ${details.titre}`}
                                                    />
                                                ) : (
                                                    <video
                                                        className='absolute z-0 w-full'
                                                        controls
                                                        autoPlay
                                                        muted
                                                        loop
                                                        src={details.media[1]}
                                                    >
                                                        Votre navigateur ne supporte pas la lecture de cette vidéo.
                                                    </video>
                                                )}
                                            <div className='z-20 w-[197px] h-[200px] aspect-video rounded-[6px] bg-[#012BAE]/80 flex flex-col gap-3 items-center justify-center text-center text-wrap'>
                                                <p>{`Abonnez-vous à  ${details.abonArticle.nom} pour voir toutes les photos`}</p>
                                                {`Tout Voir + ${details.media.length - 1}`}
                                            </div>
                                        </Button>
                                    </Link>
                                }
                            </div>
                        </div>

                        {details.abonArticle.cout === 0 || (currentUser && currentUser?.abonnement?.cout !== undefined && currentUser?.abonnement.cout >= details.abonArticle.cout) ?
                            <div className='flex flex-col md:flex-row md:items-center justify-between'>
                                {
                                    currentUser &&
                                    <div className='flex items-center gap-4'>
                                        <Button onClick={() => handleShare([new File([], "nom_du_fichier.txt", {
                                            type: "text/plain",
                                            lastModified: Date.now(),
                                        })]
                                            , details.extrait)} variant={'outline'} className='size-10 rounded-none border-black'><Share2 className='size-5' /></Button>
                                        <Button onClick={handleLike} size={'icon'} variant={'outline'} className='size-10 rounded-none border-black'>
                                            <ThumbsUp
                                                style={{
                                                    color: like ? "red" : "gray",
                                                    cursor: "pointer",
                                                }}
                                                size={30} />
                                        </Button>
                                        <h2 style={{
                                            color: like ? "red" : "gray",
                                            cursor: "pointer",
                                        }}>{details.like.length}</h2>
                                        <Popover open={openCommenter} onOpenChange={setOpenCommenter}>
                                            <PopoverTrigger asChild>
                                                <Button variant={'default'} className='h-10 rounded-none'>{"COMMENTER"}</Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Textarea
                                                        placeholder="Répondre au commentaire"
                                                        rows={2}
                                                        onChange={(e) => setCommentaire(e.target.value)}
                                                    />
                                                    <Button onClick={handleAddComment}>{"COMMENTER"}</Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                }
                                <p className='font-bold'> {details.commentaire.length <= 9 && '0'}{details.commentaire.length} Commentaire{details.commentaire.length > 1 && 's'}</p>
                            </div> : ""
                        }
                        <Button onClick={() => setMasquerCom(!masquerCom)} variant={'link'} className='justify-start p-0 w-fit hover:bg-transparent'>
                            {details.commentaire.length > 0 &&
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
                        {masquerCom ?
                            <div>
                                {details.abonArticle.cout === 0 || (currentUser && currentUser?.abonnement?.cout !== undefined && currentUser?.abonnement.cout >= details.abonArticle.cout) ?
                                    <div className='flex flex-col pt-8'>
                                        {
                                            details.commentaire.filter(a => a.delete === false).map(x => {
                                                return (
                                                    <div key={x.id} className='flex flex-row py-3 gap-3'>
                                                        <img src={x.user?.photo ? x.user?.photo : '/images/no-user.jpg'} alt="" className='size-10 object-cover rounded-full' />
                                                        <div className='flex flex-col gap-2'>
                                                            <p className='font-normal text-[16px]'>{x.user?.nom}</p>
                                                            <p className='text-[14px] leading-[18.2px] text-[#545454]'>{x.message}</p>
                                                            <div className='flex flex-row items-center gap-4'>
                                                                <Button
                                                                    onClick={() => handleLikeC(x.id)}
                                                                    style={{
                                                                        color: x.like.some(x => x.id === currentUser?.id) ? "red" : "#A1A1A1",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    variant={'ghost'} className='flex items-center justify-center gap-1 px-1'>
                                                                    <ThumbsUp
                                                                        style={{
                                                                            color: x.like.some(x => x.id === currentUser?.id) ? "red" : "#A1A1A1",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        className='size-4 text-[#012BAE]' />
                                                                    <p className='font-normal text-[12px] leading-[15.6px]'>{x.like.length} </p>
                                                                </Button>
                                                                {x.user?.id !== currentUser?.id ?
                                                                    <div>
                                                                        <Popover open={openRepondre === x.id} onOpenChange={() => toggleRepondre(x.id)}>
                                                                            <PopoverTrigger asChild>
                                                                                <Button className='px-1 text-[12px] font-ubuntu' variant={'ghost'}>{"Repondre"}</Button>
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
                                                                                    <Button onClick={() => handleResponseClick(x)}>{"Répondre"}</Button>
                                                                                </div>
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                        <Button onClick={() => handleSignal(x.id)}
                                                                            style={{
                                                                                color: x.signals.some(x => x.id === currentUser?.id) ? "red" : "#A1A1A1",
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
                                                                                    <Button onClick={() => handleModifierCom(x.id)}>{"Modifier"}</Button>
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
                                                                                        <Button onClick={() => handleDeleteComment(x.id)} type="button">
                                                                                            {"Supprimer"}
                                                                                        </Button>
                                                                                    </DialogClose>
                                                                                </DialogFooter>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    </div>
                                                                }

                                                            </div>
                                                            {x.reponse.length > 0 &&
                                                                <div onClick={() => toggleReponse(x.id)} className='flex gap-2 items-center text-[12px] text-blue-500 cursor-pointer'>
                                                                    {showReponses[x.id] ? <BiUpArrow className='size-3' /> : <BiDownArrow className='size-3' />}
                                                                    {`${x.reponse.length} Réponse${x.reponse.length > 1 ? "s" : ""}`}
                                                                </div>
                                                            }
                                                            {
                                                                showReponses[x.id] &&
                                                                x.reponse.filter(s => s.delete === false).map(a => (
                                                                    <div key={a.id} className='flex flex-row py-3 gap-3'>
                                                                        <img src={a.user?.photo ? a.user?.photo : '/images/no-user.jpg'} alt="" className='size-10 object-cover rounded-full' />
                                                                        <div className='flex flex-col gap-2'>
                                                                            <p className='font-normal text-[16px]'>{a.user?.nom}</p>
                                                                            <p className='text-[14px] leading-[18.2px] text-[#545454]'>{a.message}</p>
                                                                            <div className='flex flex-row items-center gap-4'>
                                                                                <Button onClick={() => handleLikeR(x.id, a.id)}
                                                                                    style={{
                                                                                        color: a.like.some(x => x.id === currentUser?.id) ? "red" : "#A1A1A1",
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                    variant={'ghost'} className='flex gap-1 px-1'>
                                                                                    <ThumbsUp
                                                                                        style={{
                                                                                            color: a.like.some(x => x.id === currentUser?.id) ? "red" : "#A1A1A1",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                        className='size-5 text-[#012BAE]' />
                                                                                    <p className='font-normal text-[12px] leading-[15.6px]'>{a.like ? a.like.length : '0'} </p>
                                                                                </Button>
                                                                                {a.user?.id !== currentUser?.id ?
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
                                                                                                    <Button onClick={() => handleResponseClick(x)}>{"Répondre"}</Button>
                                                                                                </div>
                                                                                            </PopoverContent>
                                                                                        </Popover>
                                                                                        <Button onClick={() => handleSignalR(x.id, a.id)}
                                                                                            style={{
                                                                                                color: a.signals.some(x => x.id === currentUser?.id) ? "red" : "#A1A1A1",
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
                                                                                                    <Button onClick={() => handleModifierRep(x.id, a.id)}>{"Modifier"}</Button>
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
                                                                                                        <Button onClick={() => handleDeleteRep(x.id, a.id)} type="button">
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
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )
                                        }
                                        <PubsComp pub={pub?.slice().reverse()} taille={'h-[200px]'} clip={''} />
                                    </div> : ""
                                }
                            </div>
                            : ""}
                        <div className='hidden md:flex'>{sim?.donnees && <GridAcc gridAff={sim?.donnees} />}</div>
                        {/* <GridSport liste={sim?.donnees} /> */}
                    </div>
                    <div className='md:max-w-[360px] w-full md:px-7 flex flex-col gap-7'>
                        <div className={`${tail} md:max-h-full h-full overflow-hidden`}>
                            <UnePubs titre={'A la une'} couleur={'bg-[#B3261E]'} article={favorite?.slice(0, 2).flatMap(cat => cat.donnees.slice(0, 1))} pubs={pub} />
                            <UnePubs titre={"Aujourd'hui"} couleur={'bg-[#01AE35]'} article={favorite?.slice().flatMap(cat => cat.donnees.slice()).slice(0, 8)} pubs={pub?.slice().reverse()} />
                        </div>
                        {tail === "max-h-[379px]" && <Button variant={"outline"} className='rounded-none flex md:hidden w-fit' onClick={() => handleVoirtout()}>{"Voir Plus"}</Button>}
                        <div className='flex md:hidden'>{pub && <PubsComp pub={pub} taille={'h-[300px]'} clip={'clip-custom'} />}</div>
                        <div className='flex md:hidden'>{sim?.donnees && <GridAcc gridAff={sim?.donnees} />}</div>
                    </div>
                </div>
                {/* <div className='flex '>
                    <UnePubs titre={'à la une'} couleur={'bg-[#B3261E]'} article={undefined} pubs={undefined} />
                    <UnePubs titre={"Aujourd'hui"} couleur={'bg-[#01AE35]'} article={undefined} pubs={undefined} />
                    <Similaire similaire={details} sim={sim} />
                    {pub && <PubsComp pub={pub.slice().reverse()} taille={'h-[200px]'} clip={''} />}
                    <Similaire similaire={sec} sim={second} />
                </div> */}
            </div>
        </div >
    )
}

export default Detail
