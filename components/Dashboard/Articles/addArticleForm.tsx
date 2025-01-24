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
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
import { useQueryClient } from "@tanstack/react-query";
import { TbUserPlus } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    nom: z.string().min(4, {
        message: "Name must be at least 4 characters.",
    }),
    type: z.string().min(4, {
        message: "Name must be at least 4 characters.",
    }),
    titre: z.string().min(10, {
        message: "Name must be at least 10 characters.",
    }),
    extrait: z.string().min(10, {
        message: "Name must be at least 10 characters.",
    }),
    description: z.string().min(10, {
        message: "Name must be at least 10 characters.",
    }),
    media: z
        .any()
        .refine(
            (file) => !file || file instanceof File,
            { message: "Image must be a file." }
        ),
    abonArticle: z.string(),
});


function AddArticleForm({ addButton }: { addButton: string }) {

    const { addCategory, currentAdmin } = useStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            type: "",
            titre: "",
            extrait: "",
            description: "",
            media: "",
            abonArticle: ""
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Hello");

        addCategory({
            nom: values.nom,
            donnees: [
                {
                    id: Date.now(),
                    type: values.type,
                    titre: values.titre,
                    extrait: values.extrait,
                    description: values.description,
                    ajouteLe: new Date(Date.now()).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
                    user: currentAdmin!,
                    abonArticle: values.abonArticle,
                    commentaire: [],
                    like: []
                }
            ]
        });

        queryClient.invalidateQueries({ queryKey: ["pubs"] })
        setDialogOpen(false);
        toast.success("Ajouté avec succès");
        form.reset();
    }

    const abon = ["normal", "premium"];

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={"default"}>
                    <TbUserPlus size={20} />
                    {addButton}
                </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-2xl !w-full">
                <DialogHeader>
                    <DialogTitle>{"Ajouter une nouvele Publicité"}</DialogTitle>
                    <DialogDescription>
                        {"remplir ce formulaire pour ajouter une nouvele Publicité"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-10"
                    >
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Catégorie sportive"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="ex. Football" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Sous-Catégorie"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="ex. Football masculin" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="titre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Titre de la publication"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Titre de la publication" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="abonArticle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Type d'abonnement associé"}</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Déffinissez un abonnement" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {abon.map((ab, index) => (
                                                    <SelectItem key={index} value={ab}>
                                                        {ab}
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
                            name="extrait"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Extrait de la description"}</FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} {...field} placeholder="Extrait de la description" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Description"}</FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} {...field} placeholder="Description" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="media"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Image"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    field.onChange(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <span className="flex items-center gap-3 flex-wrap">
                            <Button onClick={() => console.log(form.getValues())} type="submit" className="w-fit">
                                {"Publier"}
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

export default AddArticleForm;
