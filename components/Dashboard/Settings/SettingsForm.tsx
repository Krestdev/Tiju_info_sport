"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useStore from '@/context/store'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
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


    const { settings } = useStore()
    const [photo, setPhoto] = useState<string>();

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
        console.log(values);

    }

    const role = ["redacteur", "moderateur"]

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 px-7 py-10'>
                <h1 className='uppercase text-[40px]'>{"Paramètre du site"}</h1>
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
                                    className="max-w-[384px] w-full h-[60px]"
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
                <Button onClick={() => console.log(form.getValues())} type="submit" className='rounded-none max-w-[384px] font-ubuntu w-fit'>{"Enregistrer les modifications"}</Button>
            </form>

        </Form>
    )
}

export default SettingsForm
