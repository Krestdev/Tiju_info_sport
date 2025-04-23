"use client"

import axiosConfig from '@/api/api'
import AddImage from '@/components/add-image'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useStore from '@/context/store'
import { toast } from '@/hooks/use-toast'
import { usePublishedArticles } from '@/hooks/usePublishedData'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const formSchema = z
    .object({
        company: z.string().min(4, {
            message: "Le nom de la société doit contenir au moins 4 caractères",
        }),
        logo: z.string({message: "Veuillez importer une image"}),
        description: z.string({message: "Veuillez renseigner une description"}),
        phone: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        x: z.string().optional(),
        email: z.string({message: "Veuillez renseigner une adresse mail"}).email("Adresse mail invalide"),
        address: z.string().optional(),
    });

type SettingItem = {
    data: Settings;
};


const SettingsForm = () => {

    const { token } = useStore()
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Accept": "*/*",
        "x-api-key": "abc123",
        'Content-Type': 'application/json'
    });

    const sections = useQuery({
        queryKey: ["sections"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<{ title: string, id: number, content: Ressource[] }[]>>(
                `/footer/show`
            );
        },
    });

    const getSetting = useQuery({
        queryKey: ["settings"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Settings[]>>(
                `/param/show
    `
            );
        },
    });



    const setting: Settings[] = getSetting.isSuccess ? getSetting.data.data : [];
    const section: { title: string, id: number, content: Ressource[] }[] = sections.isSuccess ? sections.data.data : [];
    const { mainCategories, childCategories } = usePublishedArticles()

    const { settings } = useStore()
    const router = useRouter();
    const queryClient = useQueryClient();


    const updateSettings = useMutation({
        mutationKey: ["settings"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            return axiosClient.patch(`/param/update/${1}`,
                {
                    company: data.company,
                    imageurl: data.logo,
                    description: data.description,
                    phone: data.phone,
                    facebook: data.facebook,
                    instagram: data.instagram,
                    x: data.x,
                    email: data.email,
                    address: data.address
                }
            )
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            toast({
                variant: "success",
                title: "Paramètres enregistrés",
                description: "Vos paramètres ont été enregistrés avec succès !",
            })
        },
    })

    useEffect(() => {
        if (getSetting.isSuccess && setting.length > 0) {
            const firstData = setting[0];
            console.log("firstData", firstData);

            form.reset({
                company: firstData.company ?? settings.compagnyName,
                logo: firstData.imageurl ?? settings.logo,
                description: firstData.description ?? settings.description,
                phone: firstData.phone ?? settings.phone,
                facebook: firstData.facebook ?? settings.facebook,
                instagram: firstData.instagram ?? settings.instagram,
                x: firstData.x ?? settings.x,
                email: firstData.email ?? settings.email,
                address: firstData.address ?? settings.address,
            });
        }
    }, [getSetting.isSuccess, getSetting.data, setting]);


    const firstData = setting[0] ? setting[0] : null;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company: firstData?.company ?? settings.compagnyName,
            logo: firstData?.imageurl ?? settings.logo,
            description: firstData?.description ?? settings.description,
            phone: firstData?.phone ?? settings.phone,
            facebook: firstData?.facebook ?? settings.facebook,
            instagram: firstData?.instagram ?? settings.instagram,
            x: firstData?.x ?? settings.x,
            email: firstData?.email ?? settings.email,
            address: firstData?.address ?? settings.address,
        }
    });





    function onSubmit(values: z.infer<typeof formSchema>) {
            updateSettings.mutate(values)
    }

    return (
        <Form {...form}>
            <div className='flex flex-col gap-5 px-7 pb-10'>
                <h1 className='uppercase text-[40px]'>{"Paramètre du site"}</h1>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                    <div className='grid grid-cols-1 gap-5 max-w-sm'>
                        {/* <h3 className='uppercase text-[28px]'>{"Informations"}</h3> */}
                        <FormField
                            control={form.control}
                            name='company'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Titre du site"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Titre du site' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                            <FormField
                                control={form.control}
                                name="logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Logo du site"}</FormLabel>
                                        <FormControl>
                                            <AddImage image={field.value} onChange={field.onChange}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Description du site"}</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder='Description du site'/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex flex-col gap-5'>
                        <h3 className='uppercase text-[28px]'>{"Contact et Réseaux sociaux"}</h3>
                        <div className="grid grid-cols-1 max-w-sm gap-5 ">
                            <FormField
                                control={form.control}
                                name='phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Téléphone"}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute flex items-center text-base px-2 gap-2 top-1/2 transform -translate-y-1/2 h-full bg-primary text-white">
                                                    +237
                                                </span>
                                                <Input
                                                    type="tel"
                                                    {...field}
                                                    placeholder="694949494"
                                                    className="pl-[60px] w-full rounded-none"
                                                />
                                            </div>

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Adresse mail"}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='exemple@exemple.com' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='address'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Localisation"}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Douala, Cameroun'/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='facebook'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Facebook"}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='https://facebook.com/profil'/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='instagram'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Instagram"}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='https://instagram.com/profil'/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /><FormField
                                control={form.control}
                                name='x'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Twitter (X)"}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='https://x.com/profil'/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-5 max-w-sm pt-5'>
                        <h3 className='uppercase text-[28px]'>{"Pied de page"}</h3>
                        {section.length > 0 && <div className='flex flex-col gap-5 px-2 py-3 w-full border border-[#A1A1A1]'>
                            <h4 className='uppercase text-[#A1A1A1] font-normal'>{"Catégories"}</h4>
                            {
                                mainCategories.filter(x => x.footershow === true).map((x, i) => {
                                    return (
                                        <div key={i}>
                                            <div className='flex flex-col gap-3'>
                                                <h4 className='uppercase'>{x.title}</h4>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <h4 className='uppercase text-[#A1A1A1] font-normal'>{"Sous catégories"}</h4>
                            {
                                childCategories.filter(x => x.footershow === true).map((x, i) => {
                                    return (
                                        <div key={i}>
                                            <div className='flex flex-col gap-3'>
                                                <h4 className='uppercase'>{x.title}</h4>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {
                                section.map((x, k) => {
                                    return (
                                        x.content.length > 0 &&
                                        <div key={k} className='flex flex-col gap-4'>
                                            <h4 className='uppercase text-[#A1A1A1] font-normal'>{x.title}</h4>
                                            <div className='flex flex-col gap-3'>
                                                {
                                                    x.content.map((cont, c) => {
                                                        return (
                                                            <h4 key={c} className='uppercase'>{cont.title}</h4>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>}
                    </div>
                    <Button variant={"outline"} onClick={() => router.push("/dashboard/settings/footerConfig")} type="button" className='rounded-none max-w-sm' family={"sans"}>{"Configurer le pied de page"}</Button>
                    <Button onClick={() => console.log(form.getValues())} type="submit" className='rounded-none max-w-sm' family={"sans"} isLoading={updateSettings.isPending} disabled={updateSettings.isPending}>{"Enregistrer les modifications"}</Button>
                </form>
            </div>
        </Form>
    )
}

export default SettingsForm
