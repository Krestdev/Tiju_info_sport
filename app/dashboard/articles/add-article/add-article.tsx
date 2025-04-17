'use client'
import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { usePublishedArticles } from '@/hooks/usePublishedData'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import TiptapEditor from './tiptap-content'

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
    featuredImage:z.string({message: "Ce champs ne peut être vide"}),
    excerpt: z.string().max(250, {message: "Le résumé doit comporter moins de 250 caractères"}),
    content: z.string({message: "Le contenu ne peut être vide"}),
    category:z.string({message: "Veuillez choisir une catégorie"}),
    headline:z.boolean(),
    status:z.string({message: "Le statut ne peut être vide"})
})

function AddArticlePage() {
    const axiosClient = axiosConfig();
    const {categories} = usePublishedArticles();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
    });
    
    function onSubmit(data:z.infer<typeof formSchema>){
        console.log(data);
        //add it here
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
                    <FormField control={form.control} name="content" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Contenu de l'article"}</FormLabel>
                            <FormControl>
                                <TiptapEditor value={field.value}/>
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
                                    {[...new Set(categories)].map((x)=>(
                                        <SelectItem key={x.id} value={x.title}>{x.title}</SelectItem>
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
                <span className='col-span-1 lg:col-span-2'>
                    <Button family={"sans"} type="submit" className='w-full max-w-sm'>{"Enregistrer"}</Button>
                </span>
            </form>
        </Form>
    </div>
  )
}

export default AddArticlePage