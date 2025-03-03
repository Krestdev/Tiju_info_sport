"use client"

import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useStore from '@/context/store';
import { useQuery } from '@tanstack/react-query';
import { Users } from '@/data/temps';


const formSchema = z.object({
    email: z.string().email(),
});

const Email = () => {

    const { dataUsers } = useStore()
    const [users, setUsers] = useState<Users[]>()
    const [message, setMessage] = useState("")

    const userData = useQuery({
        queryKey: ["users"],
        queryFn: async () => dataUsers
    })

    useEffect(() => {
        if (userData.isSuccess) {
            setUsers(userData.data)
        }
    }, [userData.data])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (users?.some(x => x.email === values.email)) {
                console.log(values);
                
            } else {
                setMessage("L'adresse email saisie n'existe")
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    }
    return (
        <div className='flex flex-col items-center gap-10 px-7 py-20'>
            <h1 className='uppercase text-[40px] leading-[52px] !font-medium'>{"Récuperation de compte"}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className='flex flex-col items-center gap-2'>
                                        <Input placeholder="Adresse mail" {...field} className="w-[384px] rounded-none" />
                                        <p className='text-red-500'>{message}</p>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-[384px] rounded-none'>{"Envoyer"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default Email
