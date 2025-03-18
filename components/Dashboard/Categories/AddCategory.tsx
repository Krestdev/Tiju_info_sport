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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const formSchema = z.object({
    nom: z.string().min(3, { message: "Le nom doit avoir au moins 3 caractères" }),
    description: z.string().min(10, { message: "La description doit avoir au moins 10 caractères" }),
    parent: z.string().optional().nullable(),
});

type Props = {
    children: ReactNode;
};

const AddCategory = ({ children }: Props) => {
    const { dataCategorie, addCategorie } = useStore();
    const [parents, setParents] = useState<Categories[]>([]);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const queryClient = useQueryClient();

    // Récupérer les catégories existantes
    const cateData = useQuery({
        queryKey: ["category"],
        queryFn: async () => dataCategorie,
    });

    // Filtrer les catégories parents
    useEffect(() => {
        if (cateData.isSuccess) {
            setParents(cateData.data.filter((x) => !x.parent));
        }
    }, [cateData.data, cateData.isSuccess]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            description: "",
            parent: null,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(dataCategorie.find((cat) => cat.id === Number(values.parent)));

        const cate = {
            id: Date.now(),
            nom: values.nom,
            description: values.description,
        }
        const id = values.parent ? dataCategorie.find((cat) => cat.id === Number(values.parent))?.id : undefined
        addCategorie(cate, id);
        console.log("Catégorie ajoutée:", cate);
        setDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["category"] })
        toast.success("Ajouté avec succès");
        form.reset();
    }

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
                                                        {x.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Bouton Ajouter */}
                        <Button type="submit" className="rounded-none max-w-[384px] w-full">
                            {"Ajouter"}
                        </Button>
                    </form>
                    <ToastContainer />
                </Form>
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
};

export default AddCategory;
