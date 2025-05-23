"use client";

import { Button } from "@/components/ui/button";
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
import { Categories } from "@/data/temps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import axiosConfig from "@/api/api";
import { AxiosResponse } from "axios";
import { slugify } from "@/lib/utils";
import { usePublishedArticles } from "@/hooks/usePublishedData";

const formSchema = z.object({
    nom: z.string().min(3, { message: "Le nom doit avoir au moins 3 caractères" }),
    description: z.string().min(10, { message: "La description doit avoir au moins 10 caractères" }),
    parent: z.any().optional(),
    color: z.any()
});

type Props = {
    children: ReactNode;
};

const AddCategory = ({ children }: Props) => {
    const { currentUser } = useStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const axiosClient = axiosConfig();
    const queryClient = useQueryClient();

    const addCategory = useMutation({
        mutationKey: ["categories"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const idU = currentUser && String(currentUser.id)
            return axiosClient.post("/category",
                {
                    user_id: idU,
                    title: data.nom.trim(),
                    slug: slugify(data.nom.trim()),
                    image: "image",
                    description: data.description.trim(),
                    color: data.color
                })
        },
    })

    React.useEffect(() => {
        if (addCategory.isSuccess) {
            toast.success("Catégorie ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setDialogOpen(prev => !prev);
        } else if (addCategory.isError) {
            toast.error("Erreur lors de la création de la catégorie");
            console.log(addCategory.error)
        }
    }, [addCategory.isError, addCategory.isSuccess, addCategory.error]);


    const addSubCategory = useMutation({
        mutationKey: ["categories"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const idU = currentUser && String(currentUser.id)
            return axiosClient.post(`/category/sub/${data.parent}`,
                {
                    user_id: idU,
                    title: data.nom.trim(),
                    slug: slugify(data.nom.trim()),
                    image: "image",
                    description: data.description.trim(),
                    color: data.color
                })
        },
    })

    React.useEffect(() => {
        if (addSubCategory.isSuccess) {
            toast.success("Sous catégorie ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setDialogOpen(prev => !prev);
        } else if (addSubCategory.isError) {
            toast.error("Erreur lors de la création de la catégorie");
            console.log(addSubCategory.error)
        }
    }, [addSubCategory.isError, addSubCategory.isSuccess, addSubCategory.error]);
    
    const { mainCategories } = usePublishedArticles()

    // Filtrer les catégories parents
    const parents = mainCategories

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        data.parent ? addSubCategory.mutate(data) : addCategory.mutate(data);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            description: "",
            color: undefined
        },
    });

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md p-6 scrollbar">
                <DialogHeader>
                    <DialogTitle>{"Ajouter une Catégorie"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour ajouter une Catégorie"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 px-7 py-10">
                        <h1 className='uppercase text-[28px]'>{"Ajouter une catégorie"}</h1>

                        {/* Champ Nom */}
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} className="h-[60px] max-w-[384px] text-[24px]" placeholder="Titre de la catégorie" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Champ Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Description de la catégorie"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Entrez une description" className="h-[60px] max-w-[384px]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Sélecteur de Catégorie Parent */}
                        <FormField
                            control={form.control}
                            name="parent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Catégorie parent"}</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                                            value={field.value ?? "none"}
                                        >
                                            <SelectTrigger className="border border-[#A1A1A1] max-w-[384px] w-full h-[40px] flex items-center p-2 rounded-none">
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2">
                                                <SelectItem value="none">{"Aucun parent"}</SelectItem>
                                                {parents.map((x) => (
                                                    <SelectItem key={x.id} value={String(x.id)}>
                                                        {x.title}
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
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Selectionnez une couleur"}</FormLabel>
                                    <FormControl>
                                        <Input type="color" {...field} placeholder="Selectionnez une couleur" className="h-[60px] max-w-[384px]" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="rounded-none max-w-[384px] w-full">
                            {"Ajouter"}
                        </Button>
                    </form>
                </Form>
                <ToastContainer />
            </DialogContent>
        </Dialog>
    );
};

export default AddCategory;
