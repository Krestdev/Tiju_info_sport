import { Article, Categorie, comment, Pubs, Users } from '@/data/temps'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { BiDownArrow, BiSolidLike, BiUpArrow } from "react-icons/bi";
import { AiFillDislike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import useStore from '@/context/store';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Share2, ThumbsUp, User } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '../ui/form';
import { useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { BsThreeDots } from "react-icons/bs";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import PubsComp from '../PubsComp';
import { CiUser } from "react-icons/ci";
import Similaire from './Similaire';


const formSchema = z
    .object({
        message: z.string()
            .min(4, "Veuillez entrer au moins 4 caractères")
    });

interface Details {
    details: Article,
    similaire: Article[] | undefined
    pub: Pubs | undefined,
    dataArticle: Categorie[] | undefined
}

const Detail = ({ details, similaire, pub, dataArticle }: Details) => {

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
        favorite
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

    console.log(favorite);
    

    const second = favorite?.filter(x => x.donnees.find(a => a === details)).flatMap(x => x.donnees).filter(x => x === details)[1]
    
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
        console.log("Hello");

        if (commentaire.trim() !== "") {
            const newComment = {
                id: Date.now(),
                user: currentUser,
                message: commentaire,
                reponse: [],
                like: [],
                signals: []
            };
            addComment(newComment, details.id);
            setCommentaire("");
            setOpenCommenter(false);
        }
    };

    useEffect(() => {
        details;
        similaire;
    }, [details])



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



    const handleResponseClick = (comment: comment) => {
        try {
            // Crée un nouveau commentaire
            const newComment: comment = {
                id: Date.now(),
                user: currentUser,
                message: response,
                reponse: [],
                like: [],
                signals: []
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

    return (

        <div className='max-w-[1280px] w-full flex flex-row gap-7'>
            <div className='flex flex-col px-7 gap-5'>
                <div className='flex flex-col py-4 gap-4'>
                    <div>
                        <p className='text-[#A1A1A1]'>{details.type}</p>
                        <h2 className='font-bold'>{details.titre}</h2>
                    </div>
                    {details.media && <img src={details.media} alt="" className='max-w-[836px] w-full h-[420px] rounded-lg object-cover' />}
                </div>
                <div className='flex flex-col py-7 gap-4'>
                    <p className='text-[#545454]'>{details.extrait}</p>
                    <div>
                        <p className='font-bold'>{details.user.nom}</p>
                        <p className='text-[#A1A1A1]'>{details.ajouteLe}</p>
                    </div>
                    <p className='text-[#545454]'>{details.description}</p>
                </div>
                {<PubsComp id={pub!.id} lien={pub!.lien} image={pub!.image} />}
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Button variant={'outline'} className='size-10 rounded-none border-black'><Share2 className='size-5' /></Button>
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
                    <h2 className='font-bold'> {details.commentaire.length <= 9 && '0'}{details.commentaire.length} Commentaire{details.commentaire.length > 1 && 's'}</h2>
                </div>
                <div className='flex flex-col pt-8'>
                    {
                        details.commentaire.map(x => {
                            return (
                                <div key={x.id} className='flex flex-row py-3 gap-3'>
                                    <img src={x.user?.photo ? x.user?.photo : '/images/no-user.jpg'} alt="" className='size-10 object-cover rounded-full' />
                                    <div className='flex flex-col gap-2'>
                                        <h3 className='font-semibold'>{x.user?.nom}</h3>
                                        <p>{x.message}</p>
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
                                                    className='size-5 text-[#012BAE]' />
                                                <p className='font-bold'>{x.like.length} </p>
                                            </Button>
                                            {x.user?.id !== currentUser?.id ?
                                                <div>
                                                    <Popover open={openRepondre === x.id} onOpenChange={() => toggleRepondre(x.id)}>
                                                        <PopoverTrigger asChild>
                                                            <Button className='px-1' variant={'ghost'}>{"Repondre"}</Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80 flex flex-col gap-2">
                                                            <div className="space-y-2 bg-gray-100 rounded-full">
                                                                <h3 className="line-clamp-1">{x.message}</h3>
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
                                                        className={`px-1 hover:text-[#012BAE]`} variant={'ghost'}>{"Signaler"}
                                                    </Button>
                                                </div> :
                                                <div>
                                                    <Popover open={openModifier === x.id} onOpenChange={() => toggleComment(x.id)}>
                                                        <PopoverTrigger asChild>
                                                            <Button className='px-1' variant={'ghost'}>{"Modifier"}</Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80 flex flex-col gap-2">
                                                            <div className="space-y-2 bg-gray-100 rounded-full">
                                                                <h3 className='line-clamp-1'>{x.message}</h3>
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
                                                            <p className='px-1 text-[#B3261E] cursor-pointer'>{"Supprimer"}</p>
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
                                            <div onClick={() => toggleReponse(x.id)} className='flex gap-2 items-center text-blue-500 cursor-pointer'>
                                                {showReponses[x.id] ? <BiUpArrow /> : <BiDownArrow />}
                                                {`${x.reponse.length} Réponse${x.reponse.length > 1 ? "s" : ""}`}
                                            </div>
                                        }
                                        {
                                            showReponses[x.id] &&
                                            x.reponse.map(a => (
                                                <div key={a.id} className='flex flex-row py-3 gap-3'>
                                                    <img src={a.user?.photo ? a.user?.photo : '/images/no-user.jpg'} alt="" className='size-10 object-cover rounded-full' />
                                                    <div className='flex flex-col gap-2'>
                                                        <h3 className='font-semibold'>{a.user?.nom}</h3>
                                                        <p>{a.message}</p>
                                                        <div className='flex flex-row items-center gap-4'>
                                                            <Button variant={'ghost'} className='flex gap-1 px-1'>
                                                                <ThumbsUp className='size-5 text-[#012BAE]' />
                                                                <p className='font-bold'>{a.like ? a.like.length : '0'} </p>
                                                            </Button>
                                                            {a.user?.id !== currentUser?.id ?
                                                                <div>
                                                                    <Popover open={openRepondre === a.id} onOpenChange={() => toggleRepondre(a.id)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button className='px-1' variant={'ghost'}>{"Repondre"}</Button>
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
                                                                    <Button className='px-1 text-[#A1A1A1]' variant={'ghost'}>{"Signaler"}</Button>
                                                                </div> :
                                                                <div>
                                                                    <Popover open={openModifier === a.id} onOpenChange={() => toggleComment(a.id)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button className='px-1' variant={'ghost'}>{"Modifier"}</Button>
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
                                                                            <p className='px-1 text-[#B3261E] cursor-pointer'>{"Supprimer"}</p>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>{"Supprimer"}</DialogTitle>
                                                                                <DialogDescription>{"Voulez-vous vraiment supprimer ce commentaire?"}</DialogDescription>
                                                                            </DialogHeader>

                                                                            <DialogFooter className="sm:justify-end">
                                                                                <DialogClose asChild>
                                                                                    <Button onClick={() => handleDeleteComment(a.id)} type="button">
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
                </div>
            </div>
            <div className='max-w-[360px] w-full flex flex-col gap-7 px-7 py-5'>
                <Similaire tous={dataArticle} similaire={details} />
                <PubsComp id={pub!.id} lien={pub!.lien} image={pub!.image} />
                <Similaire tous={dataArticle} similaire={second} />
            </div>
        </div>

        // <div className='containerBloc flex flex-col lg:flex-row gap-5'>
        //     <div className='flex flex-col gap-8 md:gap-10 px-5 max-w-[844px]'>
        //         <div className='flex flex-col gap-5 md:gap-7 px-5 max-w-[844px]'>
        //             <h2>{details.titre}</h2>
        //             <div className='flex flex-col gap-2'>
        //                 {details.media && (
        //                     isImage(details.media) ? (
        //                         <img
        //                             onClick={() => handleImageClick(`${details.media}`)}
        //                             className="h-[300px] md:h-[400px] md:max-w-[844px] w-screen md:w-auto md:p-0 object-cover cursor-pointer"
        //                             src={details.media}
        //                             alt={`${details.type}`}
        //                         />
        //                     ) : (
        //                         <video
        //                             onClick={() => handleImageClick(`${details.media}`)}
        //                             className="h-[300px] md:h-[400px] md:max-w-[844px] w-screen md:w-auto md:p-0 object-cover cursor-pointer"
        //                             controls
        //                             autoPlay
        //                             muted
        //                             loop
        //                             src={details.media}
        //                         >
        //                             Votre navigateur ne supporte pas la lecture de cette vidéo.
        //                         </video>
        //                     )
        //                 )}
        //                 <div className='flex flex-row gap-3'>
        //                     <div className='flex flex-row items-center gap-2 divide-x-2 bg-gray-100 px-4 rounded-full'>
        //                         <div className='flex flex-row gap-1 items-center'>
        //                             <Button onClick={handleLike} size={'icon'} variant={'ghost'}>
        //                                 <h2 style={{
        //                                         color: like ? "red" : "gray",
        //                                         cursor: "pointer",
        //                                         fontSize: "24px"
        //                                     }}>{details.like.length}</h2>
        //                                 <BiSolidLike
        //                                     style={{
        //                                         color: like ? "red" : "gray",
        //                                         cursor: "pointer",
        //                                         fontSize: "24px"
        //                                     }}
        //                                     size={30} />
        //                             </Button>
        //                         </div>
        //                         <Button onClick={handleSignal} size={'icon'} variant={'ghost'}>
        //                             <AiFillDislike
        //                                 style={{
        //                                     color: signal ? "blue" : "gray",
        //                                     cursor: "pointer",
        //                                     fontSize: "24px"
        //                                 }}
        //                                 size={30} />
        //                         </Button>
        //                     </div>
        //                     <div className='flex flex-row gap-1 items-center'>
        //                         <h2>{details.commentaire.length}</h2>
        //                         <Button size={'icon'} variant={'ghost'}>
        //                             <FaRegComment size={30} />
        //                         </Button>
        //                     </div>
        //                 </div>
        //             </div>
        //             <p className='text-[#545454]'>{details.ajouteLe}</p>
        //             <p className='text-[#333333] font-[700px] line-clamp-none'>{details.description}</p>
        //         </div>
        //         <Form {...form}>
        //             <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-1'>
        //                 <FormField
        //                     control={form.control}
        //                     name="message"
        //                     render={({ field }) => (
        //                         <FormItem>
        //                             <FormLabel>{"Commenter"}</FormLabel>
        //                             <FormControl className="grid max-w-[320px] w-full gap-2">
        //                                 <Textarea
        //                                     {...field}
        //                                     rows={3}
        //                                     placeholder="Entrez votre commentaire ici..."
        //                                 />
        //                             </FormControl>
        //                             <FormMessage />
        //                         </FormItem>
        //                     )}
        //                 />
        //                 <Button type="submit" className='w-fit'>Commenter</Button>
        //             </form>
        //         </Form>


        //         <div className='flex flex-col gap-6'>
        //             {details.commentaire.length > 0 && <h2> Commentaires:</h2>}
        //             {
        //                 details.commentaire.map(x => {
        //                     return (
        //                         <div key={x.id} className='flex flex-col gap-0 w-fit'>
        //                             {/* {x.reponse &&
        //                                 <div className=' relative w-full bg-gray-300 -left-4 -bottom-3 pt-2 pb-5 px-2 rounded-xl'>
        //                                     <h3>{x.reponse.user?.nom}</h3>
        //                                     <p className='line-clamp-1'>{x.reponse.message}</p>
        //                                 </div>
        //                             } */}
        //                             <div className='bg-gray-100 flex flex-col p-5 rounded-xl z-10 w-fit gap-5'>
        //                                 <div className='flex flex-row items-center justify-between'>
        //                                     <div className='flex flex-row gap-2'>
        //                                         <User />
        //                                         <h3>{x.user?.nom}</h3>{currentUser?.id === x.user?.id && <p className='text-blue-500'>{"(Vous)"}</p>}
        //                                     </div>

        //                                     {
        //                                         x.user?.id === currentUser?.id &&
        //                                         <Popover>
        //                                             <PopoverTrigger>
        //                                                 <BsThreeDots className='ml-10' />
        //                                             </PopoverTrigger>
        //                                             <PopoverContent className='flex flex-col gap-2 w-full'>
        // <Popover open={openModifier} onOpenChange={setOpenModifier}>
        //     <PopoverTrigger asChild>
        //         <button onClick={() => setOpenModifier(true)} className='hover:text-blue-500'>{"Modifier"}</button>
        //     </PopoverTrigger>
        //     <PopoverContent className="w-80 flex flex-col z-50 gap-2">
        //         <div className="space-y-2 bg-gray-100 rounded-full">
        //             <h3 className='line-clamp-1'>{x.message}</h3>
        //         </div>
        //         <div className='flex flex-col gap-2'>
        //             <Textarea
        //                 placeholder='Modifier votre commentaire'
        //                 rows={2}
        //                 value={modifie}
        //                 onChange={(e) => setModifie(e.target.value)}
        //             />
        //             <Button onClick={() => handleModifierCom(x.id)}>{"Modifier"}</Button>
        //         </div>
        //     </PopoverContent>
        // </Popover>
        // <Dialog>
        //     <DialogTrigger>
        //         <p className='hover:text-red-500 cursor-pointer'>{"Supprimer"}</p>
        //     </DialogTrigger>
        //     <DialogContent>
        //         <DialogHeader>
        //             <DialogTitle>{"Supprimer"}</DialogTitle>
        //             <DialogDescription>{"Voulez-vous vraiment supprimer ce commentaire?"}</DialogDescription>
        //         </DialogHeader>

        //         <DialogFooter className="sm:justify-end">
        //             <DialogClose asChild>
        //                 <Button onClick={() => handleDeleteComment(x.id)} type="button">
        //                     {"Supprimer"}
        //                 </Button>
        //             </DialogClose>
        //         </DialogFooter>
        //     </DialogContent>
        // </Dialog>
        //                                             </PopoverContent>
        //                                         </Popover>

        //                                     }

        //                                 </div>
        //                                 <p>{x.message}</p>
        //                             </div>

        //                             <div className='w-full flex justify-end text-[12px]'>
        //                                 <div className='relative bg-white rounded-full w-fit px-2 flex flex-row z-20 gap-2 -top-2 '>
        //                                     <button className='hover:text-blue-500'>{"J'aime"}</button>
        //                                     <Popover>
        //                                         <PopoverTrigger asChild>
        //                                             <button className='hover:text-blue-500'>{"Repondre"}</button>
        //                                         </PopoverTrigger>
        //                                         <PopoverContent className="w-80 flex flex-col gap-2">
        //                                             <div className="space-y-2 bg-gray-100 rounded-full">
        //                                                 <h3 className="line-clamp-1">{x.message}</h3>
        //                                             </div>
        //                                             <div className="flex flex-col gap-2">
        //                                                 <Textarea
        //                                                     placeholder="Répondre au commentaire"
        //                                                     rows={2}
        //                                                     value={response}
        //                                                     onChange={(e) => setResponse(e.target.value)}
        //                                                 />
        //                                                 <Button onClick={() => handleResponseClick(x)}>{"Répondre"}</Button>
        //                                             </div>
        //                                         </PopoverContent>
        //                                     </Popover>
        //                                     <button className='hover:text-blue-500'>{"Signaler"}</button>
        //                                 </div>
        //                             </div>
        //                             {x.reponse.length > 0 &&
        //                                 <div onClick={() => toggleReponse(x.id)} className='pl-10 flex gap-2 items-center text-blue-500 cursor-pointer'>
        //                                     {showReponses[x.id] ? <BiUpArrow /> : <BiDownArrow />}
        //                                     {`${x.reponse.length} Réponse${x.reponse.length > 1 ? "s" : ""}`}
        //                                 </div>
        //                             }
        //                             {
        //                                 showReponses[x.id] &&
        //                                 <div className='pl-10 flex flex-col gap-1'>
        //                                     {
        //                                         x.reponse.map(a => {
        //                                             return (
        //                                                 <div key={a.id} className='flex flex-col gap-3 bg-gray-50 rounded-xl px-5 py-2'>
        //                                                     <div>
        //                                                         <div className='flex flex-row items-center justify-between'>
        //                                                             <div className='flex flex-row gap-2'>
        //                                                                 <User />
        //                                                                 <h3>{a.user?.nom}</h3>{currentUser?.id === a.user?.id && <p className='text-blue-500'>{"(Vous)"}</p>}
        //                                                             </div>
        //                                                             {
        //                                                                 a.user?.id === currentUser?.id &&
        //                                                                 <Popover>
        //                                                                     <PopoverTrigger>
        //                                                                         <BsThreeDots className='ml-10' />
        //                                                                     </PopoverTrigger>
        //                                                                     <PopoverContent className='flex flex-col gap-2 w-full'>
        //                                                                         <Popover open={openModifier} onOpenChange={setOpenModifier}>
        //                                                                             <PopoverTrigger asChild>
        //                                                                                 <button onClick={() => setOpenModifier(true)} className='hover:text-blue-500'>{"Modifier"}</button>
        //                                                                             </PopoverTrigger>
        //                                                                             <PopoverContent className="w-80 flex flex-col z-50 gap-2">
        //                                                                                 <div className="space-y-2 bg-gray-100 rounded-full">
        //                                                                                     <h3 className='line-clamp-1'>{a.message}</h3>
        //                                                                                 </div>
        //                                                                                 <div className='flex flex-col gap-2'>
        //                                                                                     <Textarea
        //                                                                                         placeholder='Modifier votre commentaire'
        //                                                                                         rows={2}
        //                                                                                         value={modifie}
        //                                                                                         onChange={(e) => setModifie(e.target.value)}
        //                                                                                     />
        //                                                                                     <Button onClick={() => handleModifierRep(x.id, a.id)}>{"Modifier"}</Button>
        //                                                                                 </div>
        //                                                                             </PopoverContent>
        //                                                                         </Popover>
        //                                                                         <Dialog>
        //                                                                             <DialogTrigger>
        //                                                                                 <p className='hover:text-red-500 cursor-pointer'>{"Supprimer"}</p>
        //                                                                             </DialogTrigger>
        //                                                                             <DialogContent>
        //                                                                                 <DialogHeader>
        //                                                                                     <DialogTitle>{"Supprimer"}</DialogTitle>
        //                                                                                     <DialogDescription>{"Voulez-vous vraiment supprimer ce commentaire?"}</DialogDescription>
        //                                                                                 </DialogHeader>

        //                                                                                 <DialogFooter className="sm:justify-end">
        //                                                                                     <DialogClose asChild>
        //                                                                                         <Button onClick={() => handleDeleteRep(x.id, a.id)} type="button">
        //                                                                                             {"Supprimer"}
        //                                                                                         </Button>
        //                                                                                     </DialogClose>
        //                                                                                 </DialogFooter>
        //                                                                             </DialogContent>
        //                                                                         </Dialog>
        //                                                                     </PopoverContent>
        //                                                                 </Popover>
        //                                                             }
        //                                                         </div>
        //                                                         <p>{a.message}</p>
        //                                                     </div>
        //                                                     <div className='relative text-[12px] bg-white rounded-full w-fit px-2 flex flex-row z-20 gap-2 top-4 left-28 '>
        //                                                         <button className='hover:text-blue-500'>{"j'aime"}</button>
        //                                                         <button className='hover:text-blue-500'>{"signaler"}</button>
        //                                                     </div>
        //                                                 </div>
        //                                             )
        //                                         })
        //                                     }
        //                                 </div>
        //                             }
        //                         </div>
        //                     )
        //                 })
        //             }
        //         </div>
        //     </div>
        //     <h2 className='flex lg:hidden border-b-2'>{"Ceci pourrait aussi vous plaire"}</h2>
        //     <div className='grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-5 md:gap-8'>
        //         {
        //             similaire?.map(x => (
        //                 <Link href={`/user/detail-article/${x.id}`} key={x.id} className='flex flex-col gap-4'>
        //                     {x.media && (
        //                         isImage(x.media) ? (
        //                             <img
        //                                 className="h-[300px] md:h-[200px] lg:h-[300px] w-screen md:max-w-[250px] lg:max-w-[300px] md:w-full p-5 md:p-0 object-cover rounded-lg"
        //                                 src={x.media}
        //                                 alt={`${x.type}`}
        //                             />
        //                         ) : (
        //                             <video
        //                                 className="h-[300px] md:h-[200px] lg:h-[300px] w-screen md:max-w-[250px] lg:max-w-[300px] md:w-full p-5 md:p-0 object-cover rounded-lg"
        //                                 controls
        //                                 autoPlay
        //                                 muted
        //                                 loop
        //                                 src={x.media}
        //                             >
        //                                 Votre navigateur ne supporte pas la lecture de cette vidéo.
        //                             </video>
        //                         )
        //                     )}
        //                     <div className='flex flex-col gap-2'>
        //                         <p className='text-[#182067] pl-2'>{x.type}</p>
        //                         <h3 className='line-clamp-2'>{x.titre}</h3>
        //                     </div>
        //                 </Link>
        //             ))
        //         }
        //     </div>
        //     {fullscreenImage && (
        //         <div
        //             className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
        //             onClick={handleCloseFullscreen}
        //         >
        //             <div className="relative">
        //                 {fullscreenImage && (
        //                     isImage(fullscreenImage) ? (
        //                         <img
        //                             className="max-w-screen-sm md:max-w-screen-lg max-h-screen object-contain"
        //                             src={fullscreenImage}
        //                         />
        //                     ) : (
        //                         <video
        //                             className="max-w-screen-sm md:max-w-screen-lg max-h-screen object-contain"
        //                             controls
        //                             autoPlay
        //                             muted
        //                             loop
        //                             src={fullscreenImage}
        //                         >
        //                             Votre navigateur ne supporte pas la lecture de cette vidéo.
        //                         </video>
        //                     )
        //                 )}
        //                 <button
        //                     className="absolute top-4 right-4 text-white bg-red-500 rounded-full w-10 h-10 flex items-center justify-center text-lg"
        //                     onClick={(e) => {
        //                         e.stopPropagation();
        //                         handleCloseFullscreen();
        //                     }}
        //                 >
        //                     <IoCloseOutline size={30} />
        //                 </button>
        //             </div>
        //         </div>
        //     )}
        // </div>
    )
}

export default Detail
