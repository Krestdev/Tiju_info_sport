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

interface Props {
    setActive: (value: React.SetStateAction<number>) => void
    setEmail: React.Dispatch<React.SetStateAction<string>>
}

const Email = ({ setActive, setEmail }: Props) => {

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
                setActive(1)
                setEmail(values.email)
            } else {
                setMessage("L'adresse email saisie n'existe")
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    }
    return (
        <div className='flex flex-col gap-2 items-center py-10'>
            <p>{"Nous allons vous envoyer un code a 6 chiffres par email"}</p>
            <h3>{"Entrez votre email et cliquez sur Envoyer le code"}</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className='flex items-center justify-center gap-2'>
                                <FormLabel>{"Email: "}</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Entrez votre adresse email" {...field} className="max-w-sm w-full rounded-none" />
                                        <p className='text-red-500'>{message}</p>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='max-w-[360px] w-full'>{"Envoyer le code"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default Email
