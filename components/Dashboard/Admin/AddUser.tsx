"use client"

import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useStore from '@/context/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod'

const formSchema = z
    .object({
        nom: z.string().min(4, {
            message: "Name must be at least 4 characters.",
        }),
        email: z.string().email(),
        password: z
            .string()
            .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
            .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
            .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." }),
        role: z.string({ message: "You must select a country" }),
    });


const AddUser = () => {



    const { token } = useStore()
    const queryClient = useQueryClient();
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
    });
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            email: "",
            password: "",
            role: "redacteur"
        }
    })

    const createUser = useMutation({
        mutationKey: ["user"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            try {
                return axiosClient.post("/users", {
                    email: data.email,
                    name: data.nom,
                    password: data.password,
                    nick_name: "default",
                    phone: "default",
                    sex: "default",
                    town: "default",
                    country: "default",
                    photo: "default",
                    role: data.role
                });
            } catch (error) {
                throw new Error("Validation échouée : " + error);
            }
        },
        onSuccess: (response) => {
            toast.success("Inscription réussie !");
            // localStorage.setItem("token", response.data.token);
            router.push("/dashboard/admin");
        },
        onError: (error) => {
            toast.error("Erreur lors de l'inscription.");
            console.error(error);
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
            createUser.mutate(data);
    };

    const role = ["super-admin", "admin", "editor"]

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 px-7 py-10'>
                <h1 className='uppercase text-[40px]'>{"Créer un utilisateur"}</h1>
                <FormField
                    control={form.control}
                    name='nom'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Nom de l'utilisauteur"}</FormLabel>
                            <FormControl>
                                <Input {...field} className='h-[60px] max-w-[384px] text-[24px]' placeholder='Entrez le nom' />
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
                                <Input type='email' {...field} placeholder='Adresse mail' className='h-[60px] max-w-[384px]' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Mot de passe"}</FormLabel>
                            <FormControl>
                                <Input type='password' {...field} placeholder='********' className='h-[60px] max-w-[384px] w-full' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Role"}</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2 rounded-none">
                                        <SelectValue placeholder="Déffinissez un role" />
                                    </SelectTrigger>
                                    <SelectContent className="border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2 rounded-none">
                                        {role.map((role, index) => (
                                            <SelectItem key={index} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <Button onClick={() => console.log(form.getValues())} type="submit" className='rounded-none max-w-[384px] font-ubuntu w-fit'>{"Créer un utilisateur"}</Button>

            </form>
            <ToastContainer />
        </Form>
    )
}

export default AddUser
