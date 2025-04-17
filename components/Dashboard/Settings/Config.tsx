"use client"

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { usePublishedArticles } from '@/hooks/usePublishedData';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddRessource from './AddRessource';
import { LuSquarePen } from 'react-icons/lu';
import DeleteValidation from '../Articles/DeleteValidation';
import { LucidePlusCircle, Trash2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axiosConfig from '@/api/api';
import useStore from '@/context/store';

const formSchema = z.object({
    items: z.array(z.number()),
});

const formSchema1 = z.object({
    items: z.array(z.number()),
});

const Config = () => {

    const { mainCategories, childCategories } = usePublishedArticles()
    const { currentUser } = useStore()
    const axiosClient = axiosConfig();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            items: mainCategories.filter(x => x.footShow).flatMap(x => x.id)
        },
    })

    const editCategory = useMutation({
        mutationKey: ["category"],
        mutationFn: ({ id }: { data: z.infer<typeof formSchema>, id: string },) => {
            const idU = String(currentUser.id)
            const cat = mainCategories.find(x => x.id === Number(id))
            console.log(cat);
            
            return axiosClient.patch(`/category/${id}`, {
                user_id: idU,
                ...cat,
                footShow: !cat?.footShow
            });
        },
    });

    function onSubmit1(data: z.infer<typeof formSchema1>) {
        data.items.forEach(element => {
            
        });
    }

    const form1 = useForm<z.infer<typeof formSchema1>>({
        resolver: zodResolver(formSchema1),
        defaultValues: {
            items: childCategories.filter(x => x.footShow).flatMap(x => x.id),
        },
    })

    return (
        <div className='flex flex-col gap-5 px-7 py-10'>
            <h1>{"Configuration du pied de page"}</h1>
            <Form {...form}>
                <form className='flex flex-col gap-5 scrollbar' >
                    <div className='flex flex-col gap-5 pt-5'>
                        <h3 className='uppercase text-[28px]'>{"Catégories"}</h3>
                        <FormField
                            control={form.control}
                            name='items'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center gap-2'>
                                    <FormControl>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex gap-2 items-center'>
                                                <Checkbox
                                                    checked={mainCategories.length > 0 && field.value?.length === mainCategories.length}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked ? mainCategories.map((item) => item.id) : []);
                                                    }}
                                                />
                                                {"Toutes les catégories"}
                                            </div>
                                            {
                                                mainCategories.map((item, i) => {
                                                    return (
                                                        <div key={i} className='flex gap-2 items-center'>
                                                            <Checkbox
                                                                checked={field.value?.includes(item.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                            {item.title}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type='button' className='w-fit' onClick={() => { }}>{"Sauvegarder"}</Button>
                </form>
            </Form>
            <Form {...form1}>
                <form className='flex flex-col gap-5 scrollbar' >
                    <div className='flex flex-col gap-5 pt-5'>
                        <h3 className='uppercase text-[28px]'>{"Sous catégories"}</h3>
                        <FormField
                            control={form1.control}
                            name='items'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center gap-2'>
                                    <FormControl>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex gap-2 items-center'>
                                                <Checkbox
                                                    checked={childCategories.length > 0 && field.value?.length === childCategories.length}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked ? childCategories.map((item) => item.id) : []);
                                                    }}
                                                />
                                                {"Toutes les sous-catégories"}
                                            </div>
                                            {
                                                childCategories.map((item, i) => {
                                                    return (
                                                        <div key={i} className='flex gap-2 items-center'>
                                                            <Checkbox
                                                                checked={field.value?.includes(item.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                            {item.title}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type='button' className='w-fit' onClick={() => { }}>{"Sauvegarder"}</Button>
                </form>
            </Form>

            {/* <div className='flex flex-col gap-5 pt-5'>
                <h3 className='uppercase text-[28px]'>{"Ressources"}</h3>
                {
                    section.filter(x => x.id === 7).flatMap(x => x.content).map((x, i) => {
                        console.log(x);

                        return (
                            <div key={i} className='flex gap-5'>
                                <h4 className='uppercase'>{x.title}</h4>
                                <div className='flex gap-2'>
                                    <AddRessource title={x.title} content={x.content} url={x.url} action={updateContent.mutate} message={'modifier la ressource'}>
                                        <LuSquarePen onClick={() => setSelected(x.id)} className="size-5 cursor-pointer" />
                                    </AddRessource>
                                    {x.id && <DeleteValidation id={x.id} action={deleteContent} message={'Vous êtes sur le point de supprimer la ressource'} bouton={'Supprimer'} >
                                        <Trash2 className="text-red-400 size-5 cursor-pointer" />
                                    </DeleteValidation>}
                                </div>
                            </div>
                        )
                    })
                }
                <AddRessource title={''} content={''} url={''} action={createContent.mutate} message={'ajouter la ressource'}>
                    <Button className='w-fit text-white'>
                        <LucidePlusCircle />
                        {"Ajouter une ressource"}
                    </Button>
                </AddRessource>

            </div> */}

        </div>
    )
}

export default Config
