"use client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TbUserPlus } from "react-icons/tb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Abonnement } from "@/data/temps";
import { LuUserRoundPlus } from "react-icons/lu";

const formSchema = z
    .object({
        nom: z.string().min(4, {
            message: "Name must be at least 4 characters.",
        }),
        pseudo: z.string(),
        email: z.string().email(),
        password: z
            .string()
            .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
            .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
            .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." }),
        phone: z.string().regex(/^\d{9}$/, "Phone number mist have a least 9 digit"),
        role: z.string({ message: "You must select a country" }),
        abonnement: z.string(),
    });

function AddUserForm({ addButton }: { addButton: string }) {

    const { registerUser, dataSubscription } = useStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [abon, setAbon] = useState<Abonnement[]>()

    const queryClient = useQueryClient();
    const abonData = useQuery({
        queryKey: ["abonnement"],
        queryFn: async () => dataSubscription
    })

    useEffect(() => {
        if (abonData.isSuccess) {
            setAbon(abonData.data)
        }
    }, [abonData.data])

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            pseudo: "",
            email: "",
            password: "",
            phone: "",
            role: "",
            abonnement: "Bouquet normal"
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        registerUser({
            id: Date.now(),
            nom: values.nom,
            email: values.email,
            phone: values.phone,
            role: values.role,
            createdAt: new Date(Date.now()).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }),
            password: values.password,
            pseudo: values.pseudo,
            abonnement: abon?.find(x => x.nom === values.abonnement),
            statut: ""
        });
        queryClient.invalidateQueries({ queryKey: ["articles"] })
        setDialogOpen(false);
        toast.success("Ajouté avec succès");
        form.reset();
    }

    const role = ["admin", "user"]

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-none font-ubuntu font-normal">
                    <LuUserRoundPlus />
                    {addButton}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Ajouter un nouvel utilisateur"}</DialogTitle>
                    <DialogDescription>
                        {"remplir ce formulaire pour ajouter un nouvel utilisateur"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Nom"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Nom" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pseudo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Pseudonyme"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Pseudonyme" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Email"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="email@exemple.com" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Mot de passe"}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Numero de Telephone"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Numero de Telephone" />
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Déffinissez un role" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                        <FormField
                            control={form.control}
                            name="abonnement"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Abonnement"}</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Déffinissez un abonnement" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {abon?.map((ab, index) => (
                                                    <SelectItem key={index} value={ab.nom}>
                                                        {ab.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <span className="flex items-center gap-3 flex-wrap">
                            <Button type="submit" className="w-fit">
                                {"Ajouter un nouvel utilisateur"}
                            </Button>
                            <DialogClose asChild>
                                <Button variant={"outline"} onClick={() => form.reset()}>
                                    {"Close"}
                                </Button>
                            </DialogClose>
                        </span>
                    </form>
                </Form>
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
}

export default AddUserForm;
