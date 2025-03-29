
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useStore from "@/context/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { abonnement, Abonnement, Users } from "@/data/temps";
import axiosConfig from "@/api/api";
import { useRouter } from "next/router";

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


type Props = {
    children: ReactNode;
    selectedUser: User;
};

function EditUser({ children, selectedUser }: Props) {
    const { editUser, dataSubscription, token } = useStore();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [abon, setAbon] = useState<Abonnement[]>()

    const queryClient = useQueryClient();
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
    });
    const router = useRouter();


    const signUp = useMutation({
        mutationKey: ["regiuserster"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            try {
                return axiosClient.post("/users", {
                    email: data.email,
                    name: data.nom,
                    password: data.password,
                    nick_name: "",
                    phone: "",
                    sex: "",
                    town: "",
                    country: "",
                    photo: "",
                    role: "user"
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


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: selectedUser.name,
            email: selectedUser.email,
            password: selectedUser.password,
            role: selectedUser.role,
        },
    });



    //Submit function
    function onSubmit(values: z.infer<typeof formSchema>) {
        editUser({
            id: selectedUser.id,
            nom: values.nom,
            email: values.email,
            password: values.password,
            role: values.role,
            createdAt: selectedUser.created_at,
        });
        console.log(values);
        queryClient.invalidateQueries({ queryKey: ["user"] });
        setDialogOpen(false);
        toast.success("Modifié avec succès");
        form.reset();
    }

    const role = ["admin", "user"]

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Modifier un Utilisateur"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier un utilisateur"}
                    </DialogDescription>
                </DialogHeader>
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
                                        <Input type='password' {...field} placeholder='********' className='h-[60px] max-w-[384px]' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
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
                        />
                        <Button onClick={() => console.log(form.getValues())} type="submit" className='rounded-none max-w-[384px] font-ubuntu w-fit'>{"Créer un utilisateur"}</Button>

                    </form>

                </Form>
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
}

export default EditUser;
