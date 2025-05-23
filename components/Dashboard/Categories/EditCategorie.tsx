import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import useStore from "@/context/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Abonnement, Article, Categories } from "@/data/temps";
import FullScreen from "../FullScreen";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosConfig from "@/api/api";
import { AxiosResponse } from "axios";
import { slugify } from "@/lib/utils";
import { usePublishedArticles } from "@/hooks/usePublishedData";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formSchema = z.object({
    nom: z.string().min(3, { message: "Le nom doit avoir au moins 3 caractères" }),
    description: z.string().min(10, { message: "La description doit avoir au moins 10 caractères" }),
    parent: z.any().optional(),
    color: z.any()
})


type Props = {
    children: ReactNode;
    donnee: Category;
    nom: string | undefined
};

function EditCategorie({ children, donnee }: Props) {

    const { currentUser } = useStore()
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const queryClient = useQueryClient();
    const axiosClient = axiosConfig();


    const articleCate = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Category[]>>(
                `/category`
            );
        },
    });
    // Filtrer les catégories parents
    const { mainCategories } = usePublishedArticles()

    // Filtrer les catégories parents
    const parents = mainCategories


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: donnee.title,
            description: donnee.description,
            parent: donnee.parent ? donnee.parent.toString() : undefined,
            color: donnee.color
        }
    })

    const editCategory = useMutation({
        mutationKey: ["category"],
        mutationFn: ({ data, id }: { data: z.infer<typeof formSchema>, id: string },) => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/category/${id}`, {
                user_id: idU,
                title: data.nom.trim(),
                image: "defaultImage",
                slug: slugify(data.nom.trim()),
                description: data.description.trim(),
                parent: data.parent,
                color: data.color
            });
        },
    });

    //Submit function
    function onSubmit(data: z.infer<typeof formSchema>) {
        editCategory.mutate({ data: data, id: donnee.id.toString() });
    }

    React.useEffect(() => {
        if (editCategory.isSuccess) {
            toast.success("Catégorie modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["category"] });
            setDialogOpen(prev => !prev);
        } else if (editCategory.isError) {
            toast.error("Erreur lors de la modification de la catégorie");
            console.log(editCategory.error)
        }
    }, [editCategory.isError, editCategory.isSuccess, editCategory.error])

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md p-6 scrollbar">
                <DialogHeader>
                    <DialogTitle>{"Modifier une Catégorie"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier une Catégorie"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 px-7 py-10'>
                        <h1 className='uppercase text-[28px]'>{"Modifier une catégorie"}</h1>
                        <FormField
                            control={form.control}
                            name='nom'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} className='h-[60px] max-w-[384px] text-[24px]' placeholder='Titre de la catégorie' />
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
                                    <FormLabel>{"Description de la catégorie"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Entrez une description' className='h-[60px] max-w-[384px]' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="parent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Catégorie parent"}</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                                            value={field.value ?? "none"}
                                        >
                                            <SelectTrigger className="border border-[#A1A1A1] max-w-[384px] w-full h-[40px] flex items-center p-2 rounded-none">
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2">
                                                <SelectItem value="none">{"Sélectionner une catégorie"}</SelectItem>
                                                {parents.map((x, i) => (
                                                    <SelectItem key={i} value={String(x.id)}>
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
                        <Button onClick={() => console.log(form.getValues())} type="submit" className='rounded-none max-w-[384px] w-full'>{"Modifier"}</Button>
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-none max-w-[384px] w-full">
                                Annuler
                            </Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
}

export default EditCategorie;
