"use client"

import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useStore from '@/context/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const formSchema = z
    .object({
        titre: z.string().min(4, {
            message: "Name must be at least 4 characters.",
        }),
        logo: z.any(),
        // .custom<File>((file) => file instanceof File, {
        //     message: "Veuillez sélectionner un fichier valide.",
        // })
        // .refine((file) => file.size < MAX_FILE_SIZE, {
        //     message: "Le fichier est trop volumineux (max 5MB).",
        // }),
        desciption: z.string(),
        phone: z.string(),
        whatsapp: z.string(),
        facebook: z.string(),
        instagram: z.string(),
        x: z.string(),
    });


const SettingsForm = () => {

    const { token } = useStore()
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Accept": "*/*",
        "x-api-key": "abc123",
        'Content-Type': 'multipart/form-data'
    });

    const contents = useQuery({
        queryKey: ["contents"],
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

    const content: Ressource[] = contents.isSuccess ? contents.data.data : [];
    const section: { title: string, id: number, content: Ressource[] }[] = sections.isSuccess ? sections.data.data : [];

    const { settings, editSettings } = useStore()
    const [photo, setPhoto] = useState<string>();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            titre: settings.compagnyName,
            logo: settings.logo,
            desciption: settings.description,
            phone: settings.phone,
            whatsapp: settings.phone,
            facebook: settings.facebook,
            instagram: settings.instagram,
            x: settings.x
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        editSettings(values);
        toast.success("Paramètres enregistrés avec succès");
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
                            name='titre'
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
                            name='desciption'
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
                        /><FormField
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
                        <div className='flex flex-col gap-5 px-2 py-3 w-[384px] border border-[#A1A1A1]'>
                            {
                                section.map((x, k) => {
                                    return (
                                        x.content.length > 0 &&
                                        <div key={k} className='flex flex-col gap-4'>
                                            <h4 className='uppercase text-[#A1A1A1] font-normal'>{x.title}</h4>
                                            <div className='flex flex-col gap-3'>
                                                {
                                                    x.content.map((cont,c) => {
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
                        </div>
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
