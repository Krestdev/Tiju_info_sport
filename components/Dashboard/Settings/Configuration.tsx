"use client"

import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { LucidePlusCircle, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuSquarePen } from 'react-icons/lu'
import { z } from 'zod'
import DeleteValidation from '../Articles/DeleteValidation'
import { Button } from '@/components/ui/button'
import AddRessource from './AddRessource'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosConfig from '@/api/api'
import useStore from '@/context/store'
import { AxiosResponse } from 'axios'
import { usePublishedArticles } from '@/hooks/usePublishedData'

const formSchema = z
    .object({
        allCategories: z.boolean(),
        selectedCategories: z.array(z.number()),
    })

const formSchema1 = z
    .object({
        allSubCategories: z.boolean(),
        selectedSubCategories: z.array(z.number()),
    })

const Configuration = () => {


    const { token } = useStore()
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState<number>()
    const cate = usePublishedArticles()

    const contents = useQuery({
        queryKey: ["ressources"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Ressource[]>>(
                `/content/show`
            );
        },
    });


    const sections = useQuery({
        queryKey: ["sections"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<{ title: string, id: number, content: Ressource[] }[]>>(
                `/footer/show`
            );
        },
    });

    const section: { title: string, id: number, content: Ressource[], }[] = sections.isSuccess ? sections.data.data : [];

    const selectC = section.flatMap(x => x.content.filter(x => x.section === 5)).flatMap(x => x.id)
    const select = section.flatMap(x => x.content.filter(x => x.section === 8)).flatMap(x => x.id)

    console.log(select, selectC);
    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            allCategories: false,
            selectedCategories: selectC
        },
    })


    const form1 = useForm<z.infer<typeof formSchema1>>({
        resolver: zodResolver(formSchema1),
        defaultValues: {
            allSubCategories: false,
            selectedSubCategories: select,
        },
    })

    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Accept": "*/*",
        "x-api-key": "abc123",
        'Content-Type': 'multipart/form-data'
    });

    const createRessource = useMutation({
        mutationKey: ["ressources"],
        mutationFn: () => {
            return axiosClient.post("/footer/create",
                {
                    title: "Sous categories"
                }
            )
        },
    })

    const { mutate: deleteRessource } = useMutation({
        mutationFn: async (id: number) => {
            return axiosClient.delete(`/footer/delete/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ressources"] });
        },
    });

    const { mutate: deleteContent } = useMutation({
        mutationFn: async (id: number) => {
            return axiosClient.delete(`/content/delete/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ressources"] });
        },
    });

    const createContent = useMutation({
        mutationKey: ["ressources"],
        mutationFn: (data: Ressource) => {
            return axiosClient.post("/content/create",
                {
                    footer_id: 7,
                    title: data.title,
                    url: data.url,
                    content: data.content
                }
            )
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["ressources"] });
        },
    })

    const createContent1 = useMutation({
        mutationKey: ["ressources"],
        mutationFn: (data: { title: string, url: string }) => {
            return axiosClient.post("/content/create",
                {
                    footer_id: 5,
                    title: data.title,
                    url: data.url,
                }
            )
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["ressources"] });
        },
    })

    const createContent2 = useMutation({
        mutationKey: ["ressources"],
        mutationFn: (data: { title: string, url: string }) => {
            return axiosClient.post("/content/create",
                {
                    footer_id: 8,
                    title: data.title,
                    url: data.url,
                }
            )
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["ressources"] });
        },
    })

    const updateContent = useMutation({
        mutationKey: ["ressources"],
        mutationFn: (data: Ressource) => {
            return axiosClient.patch(`/content/update/${selected}`,
                {
                    footer_id: 7,
                    title: data.title,
                    url: data.url,
                    content: data.content
                }
            )
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["ressources"] });
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        data.selectedCategories.forEach(element => {
            const title = cate.mainCategories.find(x => x.id === element)?.title
            title && createContent1.mutate({
                title: title,
                url: `https://https://www.tyjuinfosport.com/${title}`
            })
        });
    }

    function onSubmit1(data: z.infer<typeof formSchema1>) {
        data.selectedSubCategories.forEach(element => {
            const title = cate.childCategories.find(x => x.id === element)?.title
            title && createContent2.mutate({
                title: title,
                url: `https://https://www.tyjuinfosport.com/${title}`
            })
        });
    }

    const { watch, setValue } = form;
    const { watch: watch1, setValue: setValue1 } = form1;

    const allCategories = watch("allCategories");

    const allSubCategories = watch1("allSubCategories");

    useEffect(() => {
        if (allCategories) {
            setValue("selectedCategories", cate.mainCategories.flatMap(x => x.id));
        } else {
            setValue("selectedCategories", []);
        }
    }, [allCategories, setValue]);

    useEffect(() => {
        if (allSubCategories) {
            setValue1("selectedSubCategories", cate.mainCategories.flatMap(x => x.id));
        } else {
            setValue1("selectedSubCategories", []);
        }
    }, [allSubCategories, setValue1]);

    return (
        <div className='flex flex-col gap-5 px-7 py-10'>
            <h1>{"Configuration du pied de page"}</h1>
            <Form {...form}>
                <form className='flex flex-col gap-5' >
                    <div className='flex flex-col gap-5 pt-5'>
                        <h3 className='uppercase text-[28px]'>{"Catégories"}</h3>
                        <FormField
                            control={form.control}
                            name='allCategories'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center gap-2'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className='!m-0'>Toutes les catégories</FormLabel>
                                </FormItem>
                            )}
                        />

                        {cate.mainCategories.map((cat) => (
                            <FormField
                                key={cat.id}
                                control={form.control}
                                name='selectedCategories'
                                render={({ field }) => {
                                    const isChecked = field.value.includes(cat.id);
                                    console.log(field.value);

                                    return (
                                        <FormItem className='flex flex-row items-center gap-2'>
                                            <FormControl>
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            field.onChange([...field.value, cat.id]);
                                                        } else {
                                                            field.onChange(field.value.filter((c) => c !== cat.id));
                                                            setValue("allCategories", false);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className='!m-0'>{cat.title}</FormLabel>
                                        </FormItem>
                                    );
                                }}
                            />
                        ))}
                    </div>
                    <Button type='button' className='w-fit' onClick={form.handleSubmit(onSubmit)}>{"Sauvegarder"}</Button>
                </form>
            </Form>
            <Form {...form1}>
                <form className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-5 pt-5'>
                        <h3 className='uppercase text-[28px]'>{"Sous-catégories"}</h3>
                        <FormField
                            control={form1.control}
                            name='allSubCategories'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center gap-2'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className='!m-0'>Toutes les catégories</FormLabel>
                                </FormItem>
                            )}
                        />

                        {cate.childCategories.map((cat) => (
                            <FormField
                                key={cat.id}
                                control={form1.control}
                                name='selectedSubCategories'
                                render={({ field }) => {
                                    const isChecked = field.value.includes(cat.id);
                                    return (
                                        <FormItem className='flex flex-row items-center gap-2'>
                                            <FormControl>
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            field.onChange([...field.value, cat.id]);
                                                        } else {
                                                            field.onChange(field.value.filter((c) => c !== cat.id));
                                                            setValue("allCategories", false);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className='!m-0'>{cat.title}</FormLabel>
                                        </FormItem>
                                    );
                                }}
                            />
                        ))}
                    </div>
                    <Button type='button' className='w-fit' onClick={form1.handleSubmit(onSubmit1)}>{"Sauvegarder"}</Button>
                </form>
            </Form>


            <div className='flex flex-col gap-5 pt-5'>
                <h3 className='uppercase text-[28px]'>{"Ressources"}</h3>
                {
                    section.filter(x => x.id === 7).flatMap(x => x.content).map((x, i) => {
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

                {/* <Button type='button' onClick={() => createRessource.mutate()}>{"Creer"}</Button> */}
                {/* <Button type='button' onClick={() => deleteRessource(6)}>{"Supprimer"}</Button> */}

            </div>

        </div>
    )
}

export default Configuration
