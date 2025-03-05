"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useStore from '@/context/store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from '@/components/ui/input';
import LexicalEditor from './LexicalEditor';
import { Textarea } from '@/components/ui/textarea';
import { LuPlus } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
    nom: z.string().min(4, {
        message: "Name must be at least 4 characters.",
    }),
    type: z.string().min(4, {
        message: "Name must be at least 4 characters.",
    }),
    titre: z.string().min(10, {
        message: "Name must be at least 10 characters.",
    }),
    extrait: z.string().min(10, {
        message: "Name must be at least 10 characters.",
    }),
    description: z.string().min(10, {
        message: "Name must be at least 10 characters.",
    }),
    media: z
        .any()
        .refine(
            (files) =>
                Array.isArray(files) && files.length > 0 && files.every(file => file instanceof File),
            { message: "Veuillez sélectionner au moins une image et assurez-vous que chaque image est un fichier valide." }
        ),
    abonArticle: z.string(),
});


const AddArticle = () => {


    const { addCategory, currentAdmin, dataArticles } = useStore();
    const queryClient = useQueryClient();
    const [article, setArticle] = useState<string[]>()
    const [entry, setEntry] = useState<string>("")

    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles
    })

    useEffect(() => {
        if (articleData.isSuccess) {
            setArticle([...new Set(articleData.data.flatMap(x => x.donnees).flatMap(x => x.type))])
        }
    }, [articleData.data])



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            type: "",
            titre: "",
            extrait: "",
            description: "",
            media: "",
            abonArticle: ""
        },
    });


    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Hello");

        addCategory({
            nom: values.nom,
            donnees: [
                {
                    id: Date.now(),
                    type: values.type,
                    titre: values.titre,
                    extrait: values.extrait,
                    description: values.description,
                    ajouteLe: new Date(Date.now()).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
                    media: values.media,
                    user: currentAdmin!,
                    abonArticle: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    commentaire: [],
                    like: [],
                    statut: "",
                    auteur: currentAdmin
                }
            ]
        });

        queryClient.invalidateQueries({ queryKey: ["pubs"] })
        toast.success("Ajouté avec succès");
        form.reset();
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEntry(e.target.value)
    }

    const filterData = useMemo(() => {
        if (!article) return [];
        if (entry === "") return article;
        return article.filter((el) =>
            Object.values(el).some((value) =>
                String(value)
                    .toLocaleLowerCase()
                    .includes(entry.toLocaleLowerCase())
            )
        );
        //to do: complete this code
    }, [entry, article]);



    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5 px-7 py-10"
            >
                <h1 className='uppercase text-[40px]'>{"Ajouter un article"}</h1>

                <FormField
                    control={form.control}
                    name="titre"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} className='h-[60px] border-[#A1A1A1]' placeholder="Titre de l'article" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <LexicalEditor value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="extrait"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Extrait de l'article"}</FormLabel>
                            <FormControl>
                                <Input className='max-w-[384px] w-full h-[60px]' {...field} placeholder="Résumé de l'article" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex flex-col gap-2'>
                    <FormField
                        control={form.control}
                        name="abonArticle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{"Catégorie"}</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className='border border-[#A1A1A1] max-w-[384px] w-full h-[60px] flex items-center p-2 rounded-none'>
                                            <SelectValue
                                                placeholder={
                                                    <div>
                                                        <div className='h-10 flex gap-2 px-3 py-2 border border-[#A1A1A1] items-center'>
                                                            <LuPlus />
                                                            {"Ajouter une Catégorie"}
                                                        </div>
                                                    </div>
                                                } />
                                        </SelectTrigger>
                                        <SelectContent className='border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2'>
                                            <div>
                                                <Input
                                                type='search' 
                                                onChange={handleSearch} 
                                                value={entry} 
                                                placeholder='rechercher une catégorie' 
                                                className='h-10 w-full'
                                                 />
                                                {filterData?.map((x, i) => (
                                                    <SelectItem key={i} value={x}>
                                                        {x}
                                                    </SelectItem>
                                                ))}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <Button variant={"outline"} className='max-w-[384px] w-full font-normal rounded-none'>{"Enregistrer"}</Button>
                    <Button className='max-w-[384px] w-full rounded-none font-normal'>{"Publier"}</Button>
                </div>
            </form>
        </Form>
    )
}

export default AddArticle
