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
import { useMutation } from '@tanstack/react-query'
import { format, isSameDay } from "date-fns"
import { fr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import TiptapEditor from './tiptap-content'
import { useRouter } from 'next/navigation'

const statusArticle = [
    {
        value:"published",
        name: "Publié"
    },
    {
        value:"draft",
        name:"Brouillon"
    },
];

const formSchema = z.object({
    title:z.string({message: "Ce champ ne peut être vide"}).max(250, {message: "Le titre doit comporter moins de 250 caractères"}),
    featuredImage:z.string({message: "Veuillez renseigner une image"}),
    excerpt: z.string().max(250, {message: "Le résumé doit comporter moins de 250 caractères"}),
    content: z.string({message: "Le contenu ne peut être vide"}),
    category:z.string({message: "Veuillez choisir une catégorie"}),
    headline:z.boolean(),
    status:z.string({message: "Le statut ne peut être vide"}),
    date:z.date(),
    time:z.string(),
    delay:z.boolean(),
}).refine(data=>{
    if(data.delay === false){
        return true;
    }
    const current = new Date();
        const [hours, mins] = data.time.split(":");
        
        if (isSameDay(data.date, current)) {
            if (Number(hours) < current.getHours()) {
                return false;
            } else if (Number(hours) === current.getHours()) {
                return Number(mins) >= current.getMinutes() + 5;
            }
        }
        return true;
},{message: "La publication doit être programmé au moins 5 mins dans le futur", path: ["time"]})

function AddArticlePage() {
    const axiosClient = axiosConfig();
    const {categories, allchildCategories } = usePublishedArticles();
    const { activeUser } = useStore();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            content: "",
            headline: false,
            date: new Date(),
            time: "09:00",
            delay: false
        }
    });

    const [display, setDisplay] = React.useState(false);
    const [show, setShow] = React.useState(false);
    React.useEffect(()=>{
        if(form.getValues("status")==="published"){
            setDisplay(true);
            if(form.getValues("delay")===true){
                setShow(true);
            } else {
                setShow(false);
            }
        } else {
            setDisplay(false);
            setShow(false);
        }
    },[form.watch()])
    
    const postArticle = useMutation({
        mutationFn: (data:z.infer<typeof formSchema>)=>{
            const [hours, mins] = data.time.split(":");
            const publishDate = data.date.setUTCHours(Number(hours), Number(mins));
            if (data.delay===false){
                return axiosClient.post("articles", {
                    imageurl:data.featuredImage,
                    title: data.title,
                    slug: slugify(data.title),
                    summary: data.excerpt,
                    description: data.content,
                    status:data.status,
                    type: categories.find(x=>x.id=== Number(data.category))?.title,
                    "category_id":Number(data.category),
                    "user_id": activeUser?.id.toString(),
                })
            }
            return axiosClient.post("articles", {
                imageurl:data.featuredImage,
                title: data.title,
                slug: slugify(data.title),
                summary: data.excerpt,
                description: data.content,
                status:"draft",
                type: categories.find(x=>x.id=== Number(data.category))?.title,
                "category_id":Number(data.category),
                "user_id": activeUser?.id,
                publish_on: new Date(publishDate).toISOString()
            })
        },
        onSuccess: ()=>{
            toast({
                variant: "success",
                title: "Nouvel Article",
                description: "Votre article a été enregistré avec succès !"
            });
            router.replace("/dashboard/articles");
            form.reset();

        },
        onError: (error)=>{
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

    function onSubmit(data:z.infer<typeof formSchema>){
        postArticle.mutate(data);
    }

  return (
    <div className='flex flex-col gap-5'>
        <h1>{"Ajouter un article"}</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-y-5 gap-x-7'>
                <span className='cols-span-1 lg:col-span-2'>
                    <FormField control={form.control} name="title" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Titre de l'article"}</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Titre de l'article" className='h-[60px] text-2xl leading-[130%]'/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                </span>
                <span className='cols-span-1 lg:col-span-2'>
                    <FormField control={form.control} name="excerpt" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Extrait de l'article"}</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Résumé de l'article"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                </span>
                <span className='cols-span-1 lg:col-span-2'>
                    <FormField control={form.control} name="headline" render={({field})=>(
                        <FormItem className='flex gap-3 items-center'>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium'>{"Ajouter à la Une"}</span>
                                <span className='text-sm text-paragraph'>{"Activez pour mettre l'article à la Une"}</span>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                </span>
                <span className='cols-span-1 lg:col-span-2'>
                    <FormField control={form.control} name="content" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Contenu de l'article"}</FormLabel>
                            <FormControl>
                                <TiptapEditor value={field.value} onValueChange={field.onChange}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                </span>
                <FormField control={form.control} name="category" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Catégorie"}</FormLabel>
                        <FormControl>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className='h-10'>
                                    <SelectValue placeholder="Sélectionner une catégorie"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {[...new Set(allchildCategories)].map((x)=>(
                                        <SelectItem key={x.id} value={x.id.toString()}>{x.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Statut de l'article"}</FormLabel>
                        <FormControl>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className='h-10'>
                                    <SelectValue placeholder="Sélectionner le statut de l'article"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {statusArticle.map((y, i)=>(
                                        <SelectItem key={i} value={y.value}>{y.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                {
                    !!display &&
                    <span className='cols-span-1 lg:col-span-2'>
                        <FormField control={form.control} name="delay" render={({field})=>(
                            <FormItem className='flex gap-3 items-center'>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium'>{"Programmer la publication"}</span>
                                    <span className='text-sm text-paragraph'>{"Désactiver pour publier maintenant et activer pour définir une date de publication"}</span>
                                </div>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </span>
                }
                {
                     show &&
                    <FormField control={form.control} name="date" render={({field})=>(
                        <FormItem className='flex flex-col gap-2'>
                            <FormLabel>{"Date de publication"}</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} family={"sans"} className={cn("border-input justify-between")}>
                                        {field.value ? (
                                            format(field.value, "PPP", {locale: fr})
                                        ) : (
                                            <span>{"Sélectionner une date"}</span>
                                        )}
                                        <CalendarIcon size={20}/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date)=>date <= new Date()} initialFocus/>
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )} />
                }
                {
                    show && 
                    <FormField control={form.control} name="time" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Heure de publication de l'article"}</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                }
                <span className='cols-span-1 lg:col-span-2'>
                    <FormField control={form.control} name="featuredImage" render={({field})=>(
                        <FormItem className='flex flex-col gap-2'>
                            <FormLabel>{"Photo de couverture"}</FormLabel>
                            <FormControl>
                                <AddImage image={field.value} onChange={field.onChange}/>
                            </FormControl>
                        </FormItem>
                    )} />
                </span>
                <span className='col-span-1 lg:col-span-2'>
                    <Button family={"sans"} type="submit" className='w-full max-w-sm' disabled={postArticle.isPending} isLoading={postArticle.isPending}>{"Enregistrer"}</Button>
                </span>
            </form>
        </Form>
    </div>
  )
}

export default AddArticlePage