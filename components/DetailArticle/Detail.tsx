import { Article, comment, Users } from '@/data/temps'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa6";
import useStore from '@/context/store';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { User } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '../ui/form';
import { useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { BsThreeDots } from "react-icons/bs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';


const formSchema = z
    .object({
        message: z.string()
            .min(4, "Veuillez entrer au moins 4 caractères")
    });

interface Details {
    details: Article,
    similaire: Article[] | undefined
}

const Detail = ({ details, similaire }: Details) => {

    const { addLike, addComment, currentUser, deleteComment, editComment } = useStore()
    const [like, setLike] = useState(details.like.some(u => u.id === currentUser?.id))
    const [response, setResponse] = useState('');
    const [modifie, setModifie] = useState('');
    const [openRepondre, setOpenRepondre] = useState(false);
    const [openModifier, setOpenModifier] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Crée un nouveau commentaire
            const newComment: comment = {
                id: Date.now(),
                user: currentUser,
                message: values.message,
                reponse: undefined
            };

            // Appelle la fonction addComment pour ajouter le commentaire
            addComment(newComment, details.id);
            form.reset()

        } catch (error) {

        }
    }

    useEffect(() => {
        details;
        similaire;
    }, [details])



    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

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

    const handleOpenRepondre = (id: number) => {
        setOpenRepondre(!openRepondre);
        console.log(openRepondre);
        
    };
    
    // useEffect(()=>{
    //     setOpenRepondre
    //     console.log(openRepondre);
        
    // }, [openRepondre])


    const handleResponseClick = (comment: comment) => {
        console.log('Réponse :', response);
        try {
            // Crée un nouveau commentaire
            const newComment: comment = {
                id: Date.now(),
                user: currentUser,
                message: response,
                reponse: comment
            };

            // Appelle la fonction addComment pour ajouter le commentaire
            addComment(newComment, details.id);
            setOpenRepondre(false)
        } catch (error) {
            console.error("Une erreur est survenue: ", error)
        }
    };

    const handleModifierClick = (id: number) => {
        console.log('Réponse :', modifie);
        try {
            // Appelle la fonction addComment pour ajouter le commentaire
            editComment(id, modifie);
            setOpenModifier(false)
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

    return (
        <div className='containerBloc flex flex-col lg:flex-row gap-5'>
            <div className='flex flex-col gap-8 md:gap-10 px-5 max-w-[844px]'>
                <div className='flex flex-col gap-5 md:gap-7 px-5 max-w-[844px]'>
                    <h2>{details.titre}</h2>
                    <div className='flex flex-col gap-2'>
                        {details.media && (
                            isImage(details.media) ? (
                                <img
                                    onClick={() => handleImageClick(`${details.media}`)}
                                    className="h-[300px] md:h-[400px] md:max-w-[844px] w-screen md:w-auto md:p-0 object-cover cursor-pointer"
                                    src={details.media}
                                    alt={`${details.type}`}
                                />
                            ) : (
                                <video
                                    onClick={() => handleImageClick(`${details.media}`)}
                                    className="h-[300px] md:h-[400px] md:max-w-[844px] w-screen md:w-auto md:p-0 object-cover cursor-pointer"
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    src={details.media}
                                >
                                    Votre navigateur ne supporte pas la lecture de cette vidéo.
                                </video>
                            )
                        )}
                        <div className='flex flex-row gap-3'>
                            <div className='flex flex-row gap-1 items-center'>
                                <Button onClick={handleLike} size={'icon'} variant={'ghost'}>
                                    <BiSolidLike
                                        style={{
                                            color: like ? "red" : "gray",
                                            cursor: "pointer",
                                            fontSize: "24px"
                                        }}
                                        size={30} />
                                </Button>
                                <h2>{details.like.length}</h2>
                            </div>
                            <div className='flex flex-row gap-1 items-center'>
                                <Button size={'icon'} variant={'ghost'}>
                                    <FaRegComment size={30} />
                                </Button>
                                <h2>{details.commentaire.length}</h2>
                            </div>
                        </div>
                    </div>
                    <p className='text-[#545454]'>{details.ajouteLe}</p>
                    <p className='text-[#333333] font-[700px] line-clamp-none'>{details.description}</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-1'>
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Commenter"}</FormLabel>
                                    <FormControl className="grid max-w-[320px] w-full gap-2">
                                        <Textarea
                                            {...field}
                                            rows={3}
                                            placeholder="Entrez votre commentaire ici..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-fit'>Commenter</Button>
                    </form>
                </Form>


                <div className='flex flex-col gap-6'>
                    {details.commentaire.length > 0 && <h2> Commentaires:</h2>}
                    {
                        details.commentaire.map(x => {
                            return (
                                <div key={x.id} className='flex flex-col gap-0 w-fit'>
                                    {x.reponse &&
                                        <div className=' relative w-full bg-gray-300 -left-4 -bottom-3 pt-2 pb-5 px-2 rounded-xl'>
                                            <h3>{x.reponse.user?.nom}</h3>
                                            <p className='line-clamp-1'>{x.reponse.message}</p>
                                        </div>
                                    }
                                    <div className='bg-gray-100 flex flex-col p-5 rounded-xl z-10 w-fit gap-5'>
                                        <div className='flex flex-row items-center justify-between'>
                                            <div className='flex flex-row gap-2'>
                                                <User />
                                                <h3>{x.user?.nom}</h3>
                                            </div>

                                            {
                                                x.user?.id === currentUser?.id &&
                                                <Popover>
                                                    <PopoverTrigger>
                                                        <BsThreeDots className='ml-10' />
                                                    </PopoverTrigger>
                                                    <PopoverContent className='flex flex-col gap-2 w-full'>
                                                        <Popover open={openModifier} onOpenChange={setOpenModifier}>
                                                            <PopoverTrigger asChild>
                                                                <button onClick={() => setOpenModifier(true)} className='hover:text-blue-500'>{"Modifier"}</button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-80 flex flex-col z-50 gap-2">
                                                                <div className="space-y-2 bg-gray-100 rounded-full">
                                                                    <h3 className='line-clamp-1'>{x.message}</h3>
                                                                </div>
                                                                <div className='flex flex-col gap-2'>
                                                                    <Textarea
                                                                        placeholder='Modifier votre commentaire'
                                                                        rows={2}
                                                                        value={modifie}
                                                                        onChange={(e) => setModifie(e.target.value)}
                                                                    />
                                                                    <Button onClick={() => handleModifierClick(x.id)}>{"Modifier"}</Button>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <Dialog>
                                                            <DialogTrigger>
                                                                <button className='hover:text-red-500'>{"Supprimer"}</button>
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
                                                    </PopoverContent>
                                                </Popover>

                                            }

                                        </div>
                                        <p>{x.message}</p>
                                    </div>

                                    <div className='w-full flex justify-end text-[12px]'>
                                        <div className='relative bg-white rounded-full w-fit px-2 flex flex-row z-20 gap-2 -top-2 '>
                                            <Popover open={openRepondre} onOpenChange={setOpenRepondre}>
                                                <PopoverTrigger asChild>
                                                    <button onClick={() => handleOpenRepondre(x.id)} className='hover:text-blue-500'>{"Repondre"}</button>
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
                                            <button className='hover:text-blue-500'>{"Signaler"}</button>
                                        </div>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <h2 className='flex lg:hidden border-b-2'>{"Ceci pourrait aussi vous plaire"}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-5 md:gap-8'>
                {
                    similaire?.map(x => (
                        <Link href={`/detail-article/${x.id}`} key={x.id} className='flex flex-col gap-4'>
                            {x.media && (
                                isImage(x.media) ? (
                                    <img
                                        className="h-[300px] md:h-[200px] lg:h-[300px] w-screen md:max-w-[250px] lg:max-w-[300px] md:w-full p-5 md:p-0 object-cover rounded-lg"
                                        src={x.media}
                                        alt={`${x.type}`}
                                    />
                                ) : (
                                    <video
                                        className="h-[300px] md:h-[200px] lg:h-[300px] w-screen md:max-w-[250px] lg:max-w-[300px] md:w-full p-5 md:p-0 object-cover rounded-lg"
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        src={x.media}
                                    >
                                        Votre navigateur ne supporte pas la lecture de cette vidéo.
                                    </video>
                                )
                            )}
                            <div className='flex flex-col gap-2'>
                                <p className='text-[#182067] pl-2'>{x.type}</p>
                                <h3 className='line-clamp-2'>{x.titre}</h3>
                            </div>
                        </Link>
                    ))
                }
            </div>
            {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                    onClick={handleCloseFullscreen}
                >
                    <div className="relative">
                        {fullscreenImage && (
                            isImage(fullscreenImage) ? (
                                <img
                                    className="max-w-screen-sm md:max-w-screen-lg max-h-screen object-contain"
                                    src={fullscreenImage}
                                />
                            ) : (
                                <video
                                    className="max-w-screen-sm md:max-w-screen-lg max-h-screen object-contain"
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    src={fullscreenImage}
                                >
                                    Votre navigateur ne supporte pas la lecture de cette vidéo.
                                </video>
                            )
                        )}
                        <button
                            className="absolute top-4 right-4 text-white bg-red-500 rounded-full w-10 h-10 flex items-center justify-center text-lg"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCloseFullscreen();
                            }}
                        >
                            <IoCloseOutline size={30} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Detail
