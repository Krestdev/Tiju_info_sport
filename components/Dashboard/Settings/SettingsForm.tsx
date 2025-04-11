"use client"

import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useStore from '@/context/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const formSchema = z
    .object({
        company: z.string().min(4, {
            message: "Name must be at least 4 characters.",
        }),
        logo: z.any(),
        description: z.string().optional(),
        phone: z.string().optional(),
        whatsapp: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        x: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
    });


const SettingsForm = () => {

    const { token } = useStore()
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Accept": "*/*",
        "x-api-key": "abc123",
        'Content-Type': 'multipart/form-data'
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
            return axiosClient.get<any, AxiosResponse<{ data: Settings }[]>>(
                `/param/show
    `
            );
        },
    });

    const setting: { data: Settings }[] = getSetting.isSuccess ? getSetting.data.data : [];
    const section: { title: string, id: number, content: Ressource[] }[] = sections.isSuccess ? sections.data.data : [];

    const { settings, editSettings } = useStore()
    const [photo, setPhoto] = useState<string>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const createSettings = useMutation({
        mutationKey: ["settings"],
        mutationFn: (data: Settings) => {
            return axiosClient.post("/param/create",
                {
                    company: data.company,
                    logo: data.logo,
                    description: data.description,
                    phone: data.phone,
                    whatsapp: data.phone,
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
        },
    })

    const updateSettings = useMutation({
        mutationKey: ["settings"],
        mutationFn: (data: Settings) => {
            return axiosClient.patch("/param/update",
                {
                    compagnyName: data.company,
                    logo: data.logo,
                    description: data.description,
                    phone: data.phone,
                    whatsapp: data.phone,
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
            toast.success("Paramètres enregistrés avec succès");
        },
    })

    console.log(setting);

    useEffect(() => {
        if (setting[0]?.data) {
            form.reset({
                company: setting[0]?.data?.company ?? "",
                logo: setting[0]?.data?.logo ?? "",
                description: setting[0]?.data?.description ?? "",
                phone: setting[0]?.data?.phone ?? "",
                whatsapp: setting[0]?.data?.whatsapp ?? "",
                facebook: setting[0]?.data?.facebook ?? "",
                instagram: setting[0]?.data?.instagram ?? "",
                x: setting[0]?.data?.x ?? "",
                email: setting[0]?.data?.email ?? "",
                address: setting[0]?.data?.address ?? "",
            });
        }
    }, [getSetting.isSuccess])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company: setting[0]?.data?.company ?? settings.compagnyName,
            logo: setting[0]?.data?.logo ?? settings.logo,
            description: setting[0]?.data?.description ?? settings.description,
            phone: setting[0]?.data?.phone ?? settings.phone,
            whatsapp: setting[0]?.data?.whatsapp ?? settings.whatsapp,
            facebook: setting[0]?.data?.facebook ?? settings.facebook,
            instagram: setting[0]?.data?.instagram ?? settings.instagram,
            x: setting[0]?.data?.x ?? settings.x,
            email: setting[0]?.data?.email ?? settings.email,
            address: setting[0]?.data?.address ?? settings.address,
        }
    })




    function onSubmit(values: z.infer<typeof formSchema>) {
        setting ?
            updateSettings.mutate(values)
            :
            createSettings.mutate(values)

    }

    return (
        <Form {...form}>
            <div className='flex flex-col gap-5 px-7 py-10'>
                <h1 className='uppercase text-[40px]'>{"Paramètre du site"}</h1>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-5 pt-5'>
                        <h3 className='uppercase text-[28px]'>{"Informations"}</h3>
                        <FormField
                            control={form.control}
                            name='company'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Titre du site"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='max-w-[384px] text-[24px]' placeholder='Titre du site' />
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
                                        <Input
                                            type="file"
                                            className="max-w-[384px] w-full"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        setPhoto(reader.result as string);
                                                        field.onChange(reader.result);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
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
                                        <Input {...field} placeholder='Description du site' className='max-w-[384px]' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex flex-col gap-5 pt-5'>
                        <h3 className='uppercase text-[28px]'>{"Contact et Réseaux sociaux"}</h3>
                        <FormField
                            control={form.control}
                            name='phone'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Description du site"}</FormLabel>
                                    <FormControl>
                                        <div className="relative max-w-[384px]">
                                            <span className="absolute flex items-center text-[16px] px-2 gap-2 top-1/2 transform -translate-y-1/2 h-full bg-[#0128AE] text-white">
                                                +237
                                            </span>
                                            <Input
                                                type="tel"
                                                {...field}
                                                placeholder="6..."
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
                            name='whatsapp'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Whatsapp"}</FormLabel>
                                    <FormControl>
                                        <div className="relative max-w-[384px]">
                                            <span className="absolute flex items-center text-[16px] px-2 gap-2 top-1/2 transform -translate-y-1/2 h-full bg-[#0128AE] text-white">
                                                +237
                                            </span>
                                            <Input
                                                type="tel"
                                                {...field}
                                                placeholder="6..."
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
                                    <FormLabel>{"Email"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='exemple@exemple.com' className='max-w-[384px]' />
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
                                    <FormLabel>{"Adreese"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Denver, Bonamoussadi, Douala-Cameroun' className='max-w-[384px]' />
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
                                        <Input {...field} placeholder='https://facebook.com/profil' className='max-w-[384px]' />
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
                                        <Input {...field} placeholder='https://instagram.com/profil' className='max-w-[384px]' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /><FormField
                            control={form.control}
                            name='x'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"x"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='https://x.com/profil' className='max-w-[384px]' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex flex-col gap-5 pt-5'>
                        <h3 className='uppercase text-[28px]'>{"Pied de page"}</h3>
                        {section.length > 0 && <div className='flex flex-col gap-5 px-2 py-3 w-[384px] border border-[#A1A1A1]'>
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
                    <Button variant={"outline"} onClick={() => router.push("/dashboard/settings/footerConfig")} type="button" className='rounded-none max-w-[384px] font-ubuntu w-fit'>{"Configurer le pied de page"}</Button>
                    <Button onClick={() => console.log(form.getValues())} type="submit" className='rounded-none max-w-[384px] font-ubuntu w-fit'>{"Enregistrer les modifications"}</Button>
                </form>
            </div>
            <ToastContainer />
        </Form>
    )
}

export default SettingsForm
