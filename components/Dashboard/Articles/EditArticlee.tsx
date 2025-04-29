'use client'
import axiosConfig from '@/api/api'
import AddImage from '@/components/add-image'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import useStore from '@/context/store'
import { toast } from '@/hooks/use-toast'
import { usePublishedArticles } from '@/hooks/usePublishedData'
import { cn, slugify } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, isBefore, isSameDay, parse } from "date-fns"
import { fr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import React, { ReactNode, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import TiptapEditor from '@/app/dashboard/articles/add-article/tiptap-content'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import AddImageEdit from './add-image-edit'

const statusArticle = [
    {
        value: "published",
        name: "Publié"
    },
    {
        value: "draft",
        name: "Brouillon"
    },
];

const formSchema = z.object({
    title: z.string({ message: "Ce champ ne peut être vide" }).max(250, { message: "Le titre doit comporter moins de 250 caractères" }),
    featuredImage: z.string({ message: "Veuillez renseigner une image" }),
    excerpt: z.string().max(250, { message: "Le résumé doit comporter moins de 250 caractères" }),
    content: z.string({ message: "Le contenu ne peut être vide" }),
    category: z.string({ message: "Veuillez choisir une catégorie" }),
    headline: z.boolean(),
    status: z.string({ message: "Le statut ne peut être vide" }),
    date: z.date(),
    time: z.string(),
    delay: z.boolean(),
}).refine(data => {
    if (data.delay === false) {
        return true;
    }
    const current = new Date();
    const [hours, mins] = data.time.split(":");

    if (isSameDay(data.date, current)) {
        if (Number(hours) < current.getHours()) {
            return false;
        } else if (Number(hours) === current.getHours()) {
            return Number(mins) >= current.getMinutes() + 15;
        }
    }
    return true;
}, { message: "La publication doit être programmé au moins 15 dans le futur", path: ["time"] })

interface Props {
    children: ReactNode;
    donnee: Article;
};

function EditArticlee({ children, donnee }: Props) {
    const axiosClient = axiosConfig();
    const { categories } = usePublishedArticles();
    const { activeUser } = useStore();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: donnee.title,
            excerpt: donnee.summery,
            content: donnee.description,
            headline: donnee.headline,
            date: donnee.publish_on ? new Date(donnee.publish_on) : new Date(),
            time: donnee.publish_on ? new Date(donnee.publish_on).toTimeString().slice(0, 5) : "09:00",
            delay: false,
            category: String(donnee.catid),
            featuredImage: donnee.imageurl,
            status: donnee.status,
        }
    });

    // console.log(`${process.env.NEXT_PUBLIC_API}image/${donnee.images[0].id}`);
    console.log(donnee);



    const [display, setDisplay] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [dialogO, setDialogO] = React.useState(false);
    const queryClient = useQueryClient();

    React.useEffect(() => {
        if (form.getValues("status") === "published") {
            setDisplay(true);
            if (form.getValues("delay") === true) {
                setShow(true);
            } else {
                setShow(false);
            }
        } else {
            setDisplay(false);
            setShow(false);
        }
    }, [form.watch()])

    const postArticle = useMutation({
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const [hours, mins] = data.time.split(":");
            const publishDate = data.date.setUTCHours(Number(hours), Number(mins));
            if (data.delay === false) {
                return axiosClient.patch(`/articles/${donnee.id}`, {
                    imageurl: data.featuredImage,
                    title: data.title,
                    slug: slugify(data.title),
                    summary: data.excerpt,
                    description: data.content,
                    status: data.status,
                    type: categories.find(x => x.id === Number(data.category))?.title,
                    catid: Number(data.category),
                    "category_id": Number(data.category),
                    "user_id": activeUser?.id.toString(),
                })
            }
            return axiosClient.patch(`/articles/${donnee.id}`, {
                imageurl: data.featuredImage,
                title: data.title,
                slug: slugify(data.title),
                summary: data.excerpt,
                description: data.content,
                status: "draft",
                type: categories.find(x => x.id === Number(data.category))?.title,
                catid: Number(data.category),
                "category_id": Number(data.category),
                "user_id": activeUser?.id,
                publish_on: new Date(publishDate).toISOString()
            })
        },
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Mise à jour Article",
                description: "Votre article a été modifié avec succès !"
            });
            router.replace("/dashboard/articles");
            form.reset();
            setDialogO(false);
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
            console.log(error);
            toast({
                variant: "warning",
                title: "Erreur",
                description: (
                    <pre>
                        <p>{"Un erreur s'est produite lors de l'enregistrement de votre article."}</p>
                        <code>{error.message}</code>
                    </pre>
                )
            })
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("Helo submit");

        postArticle.mutate(data);
    }

    return (

        <Dialog open={dialogO} onOpenChange={setDialogO}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-screen md:max-w-7xl h-screen md:h-[95vh] max-w-none p-6 scrollbar">
                <DialogHeader>
                    <DialogTitle className='text-2xl uppercase'>{"Modifier un Article"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier un article"}
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-5'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-y-5 gap-x-7'>
                            <span className='cols-span-1 lg:col-span-2'>
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Titre de l'article"}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Titre de l'article" className='h-[60px] text-2xl leading-[130%]' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </span>
                            <span className='cols-span-1 lg:col-span-2'>
                                <FormField control={form.control} name="excerpt" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Extrait de l'article"}</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Résumé de l'article" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </span>
                            <span className='cols-span-1 lg:col-span-2'>
                                <FormField control={form.control} name="headline" render={({ field }) => (
                                    <FormItem className='flex gap-3 items-center'>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className='flex flex-col'>
                                            <span className='text-sm font-medium'>{"Ajouter à la Une"}</span>
                                            <span className='text-sm text-paragraph'>{"Activez pour mettre l'article à la Une"}</span>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </span>
                            <span className='cols-span-1 lg:col-span-2'>
                                <FormField control={form.control} name="content" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Contenu de l'article"}</FormLabel>
                                        <FormControl>
                                            <TiptapEditor value={field.value} onValueChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </span>
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Catégorie"}</FormLabel>
                                    <FormControl>
                                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className='h-10'>
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[...new Set(categories)].map((x) => {
                                                    return (
                                                        <SelectItem key={x.id} value={x.id.toString()}>{x.title}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Statut de l'article"}</FormLabel>
                                    <FormControl>
                                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className='h-10'>
                                                <SelectValue placeholder="Sélectionner le statut de l'article" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusArticle.map((y, i) => (
                                                    <SelectItem key={i} value={y.value}>{y.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            {
                                !!display &&
                                <span className='cols-span-1 lg:col-span-2'>
                                    <FormField control={form.control} name="delay" render={({ field }) => (
                                        <FormItem className='flex gap-3 items-center'>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className='flex flex-col'>
                                                <span className='text-sm font-medium'>{"Programmer la publication"}</span>
                                                <span className='text-sm text-paragraph'>{"Désactiver pour publier maintenant et activer pour définir une date de publication"}</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </span>
                            }
                            {
                                show &&
                                <FormField control={form.control} name="date" render={({ field }) => (
                                    <FormItem className='flex flex-col gap-2'>
                                        <FormLabel>{"Date de publication"}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} family={"sans"} className={cn("border-input justify-between")}>
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: fr })
                                                        ) : (
                                                            <span>{"Sélectionner une date"}</span>
                                                        )}
                                                        <CalendarIcon size={20} />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date <= new Date()} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )} />
                            }
                            {
                                show &&
                                <FormField control={form.control} name="time" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Heure de publication de l'article"}</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            }
                            <span className='cols-span-1 lg:col-span-2'>
                                <FormField control={form.control} name="featuredImage" render={({ field }) => (
                                    <FormItem className='flex flex-col gap-2'>
                                        <FormLabel>{"Photo de couverture"}</FormLabel>
                                        <FormControl>
                                            {donnee.imageurl ? <AddImage image={field.value} onChange={field.onChange} /> : <AddImageEdit image={field.value} onChange={field.onChange} idImage={donnee.images[0].id} />}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </span>
                            <span className='col-span-1 lg:col-span-2'>
                                <Button onClick={() => console.log(form.getValues())} family={"sans"} type="submit" className='w-full max-w-sm' disabled={postArticle.isPending} isLoading={postArticle.isPending}>{"Enregistrer"}</Button>
                            </span>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default EditArticlee