"use client"

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { usePublishedArticles } from '@/hooks/usePublishedData';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddRessource from './AddRessource';
import { LuSquarePen } from 'react-icons/lu';
import DeleteValidation from '../Articles/DeleteValidation';
import { LucidePlusCircle, Save, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosConfig from '@/api/api';
import useStore from '@/context/store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosResponse } from 'axios';
import CheckboxList from './CheckboxList';
import { slugify } from '@/lib/utils';

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
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState<number>()

    console.log(mainCategories, childCategories);

    const sections = useQuery({
        queryKey: ["sections"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<{ title: string, id: number, content: Ressource[], catid: number }[]>>(
                `/footer/show`
            );
        },
    });
    const section: { title: string, id: number, content: Ressource[], catid: number }[] = sections.isSuccess ? sections.data.data : [];

    const createSection = useMutation({
        mutationKey: ["Section"],
        mutationFn: () => {
            return axiosClient.post("/footer/create",
                {
                    title: "Ressources",
                }
            )
        },
    })

    const createContent = useMutation({
        mutationKey: ["ressources"],
        mutationFn: (data: Ressource) => {
            return axiosClient.post("/content/create",
                {
                    footer_id: 4,
                    title: data.title,
                    url: slugify(data.title),
                    content: data.content
                }
            )
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["sections"] });
        },
    })

    const updateContent = useMutation({
        mutationKey: ["ressources"],
        mutationFn: (data: Ressource) => {
            return axiosClient.patch(`/content/update/${selected}`,
                {
                    footer_id: 4,
                    title: data.title,
                    url: data.url,
                    content: data.content,
                    catid: 0,
                }
            )
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["sections"] });
        },
        onError() {
            toast.error("Échec de la modification de la ressource");
        }
    })

    const { mutate: deleteContent } = useMutation({
        mutationFn: async (id: number) => {
            return axiosClient.delete(`/content/delete/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sections"] });
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            items: mainCategories.filter(x => x.footershow === true).flatMap(x => x.id)
        },
    })

    const form1 = useForm<z.infer<typeof formSchema1>>({
        resolver: zodResolver(formSchema1),
        defaultValues: {
            items: childCategories.filter(x => x.footershow === true).flatMap(x => x.id),
        },
    })

    const editCategory = useMutation({
        mutationKey: ["category"],
        mutationFn: async (id: string) => {
            const idU = String(currentUser.id);
            const cat = mainCategories.find(x => x.id === Number(id));
            if (!cat) throw new Error("Catégorie introuvable");

            const response = await axiosClient.patch(`/category/${id}`, {
                user_id: idU,
                ...cat,
                footershow: !cat.footershow
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
            toast.error("Échec de la modification");
            console.error(error);
        }
    });

    const editCategory1 = useMutation({
        mutationKey: ["category"],
        mutationFn: async (id: string) => {
            const idU = String(currentUser.id);
            const cat = childCategories.find(x => x.id === Number(id))
            if (!cat) throw new Error("Catégorie introuvable");

            const response = await axiosClient.patch(`/category/${id}`, {
                user_id: idU,
                ...cat,
                footershow: !cat.footershow
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
            toast.error("Échec de la modification");
            console.error(error);
        }
    });

    function onSubmit(data: z.infer<typeof formSchema1>) {
        data.items.forEach(element => {
            editCategory.mutate(element.toString())
        });
    }

    function onSubmit1(data: z.infer<typeof formSchema1>) {
        data.items.forEach(element => {
            editCategory1.mutate(element.toString())
        });
    }

    const updateVisibility = async (categoryId: number, shouldShow: boolean) => {
        try {
            await editCategory.mutateAsync(categoryId.toString());
            return true;
        } catch (error) {
            console.error("Failed to update visibility", error);
            return false;
        }
    };

    const updateVisibility1 = async (categoryId: number, shouldShow: boolean) => {
        try {
            await editCategory1.mutateAsync(categoryId.toString());
            return true;
        } catch (error) {
            console.error("Failed to update visibility", error);
            return false;
        }
    };

    return (
        <div className='flex flex-col gap-5 px-7 pb-10'>
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
                                        <CheckboxList
                                            items={mainCategories}
                                            onItemChange={updateVisibility} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type='button'
                        className='max-w-sm'
                        disabled={editCategory.isPending}
                        isLoading={editCategory.isPending}
                        onClick={form.handleSubmit(onSubmit)}
                        family={"sans"}
                        variant={"outline"}
                    >
                        {"Sauvegarder"}<Save/>
                    </Button>
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
                                    <CheckboxList
                                            items={childCategories}
                                            onItemChange={updateVisibility1} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type='button'
                        className='max-w-sm'
                        disabled={editCategory1.isPending}
                        isLoading={editCategory1.isPending}
                        onClick={form1.handleSubmit(onSubmit1)}
                        family={"sans"}
                        variant={"outline"}
                    >
                        {"Sauvegarder"}<Save/>
                    </Button>
                </form>
            </Form>

            <div className='flex flex-col gap-5 pt-5'>
                <h3 className='uppercase text-[28px]'>{"Ressources"}</h3>
                {
                    section.filter(x => x.id === 4).flatMap(x => x.content).map((x, i) => {
                        return (
                            <div key={i} className='flex gap-5'>
                                <h4 className='uppercase'>{x.title}</h4>
                                <div className='flex gap-2'>
                                    <AddRessource title={x.title} content={x.content} url={x.url} action={updateContent.mutate} message={'Modifier la ressource'}>
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
                <AddRessource title={''} content={'vide'} url={''} action={createContent.mutate} message={'Ajouter la ressource'}>
                    <Button className='max-w-sm' family={"sans"}>
                        {"Ajouter une ressource"}
                        <LucidePlusCircle />
                    </Button>
                </AddRessource>

                {/* <Button className='w-fit' onClick={() => createSection.mutate()}>Section</Button> */}

            </div>
            <ToastContainer />
        </div>
    )
}

export default Config
