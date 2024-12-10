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

    const { addLike, addComment, currentUser } = useStore()
    const [like, setLike] = useState(details.like.some(u => u.id === currentUser?.id))
    const [repondre, setRepondre] = useState(false)

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
                                    <div className='bg-gray-100 flex flex-col gap-3 p-5 rounded-xl w-fit'>
                                        <div className='flex flex-row gap-2'>
                                            <User />
                                            <h3>{x.user?.nom}</h3>
                                        </div>
                                        <p>{x.message}</p>
                                    </div>
                                    <div className='w-full flex justify-end text-[12px]'>
                                        <div className='relative bg-white rounded-full w-fit px-2 flex flex-row gap-2 -top-2 '>
                                            <button onClick={()=>setRepondre(true)} className='hover:text-blue-500'>{"Répondre"}</button>
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
