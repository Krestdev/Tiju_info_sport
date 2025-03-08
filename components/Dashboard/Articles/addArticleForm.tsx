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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Abonnement } from "@/data/temps";
import { IoMdClose } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { BiShow } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";

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
            (files) =>
                Array.isArray(files) && files.length > 0 && files.every(file => file instanceof File),
            { message: "Veuillez sélectionner au moins une image et assurez-vous que chaque image est un fichier valide." }
        ),
    abonArticle: z.string(),
});


function AddArticleForm({ addButton }: { addButton: string }) {

    const { addCategory, currentAdmin, dataSubscription } = useStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [subs, setSubs] = useState<Abonnement[]>();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [show, setShow] = useState(false);
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

    const subsData = useQuery({
        queryKey: ["abonnement"],
        queryFn: async () => dataSubscription
    })

    useEffect(() => {
        if (subsData.isSuccess) {
            setSubs(subsData.data)
        }
    }, [subsData.data])

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
                    media: values.media,
                    user: currentAdmin!,
                    abonArticle: subs?.find(x => x.nom === values.abonArticle)!,
                    commentaire: [],
                    like: [],
                    statut: "",
                    auteur: currentAdmin,
                    couverture: ""
                }
            ]
        });

        queryClient.invalidateQueries({ queryKey: ["pubs"] })
        setDialogOpen(false);
        toast.success("Ajouté avec succès");
        form.reset();
    }

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
                                                {subs?.map((ab, index) => (
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
                                    <FormLabel>{"Sélectionner toutes les images"}</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-4 items-center">
                                                {selectedFiles.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedFiles([]); 
                                                            field.onChange([]);
                                                        }}
                                                        className="mt-2 p-2 w-fit bg-red-500 text-white rounded-full hover:bg-red-600"
                                                    >
                                                        <IoMdClose />
                                                    </button>
                                                )}
                                                <Input
                                                    id="fileInput"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.files) {
                                                            const newFiles = Array.from(e.target.files);
                                                            const updatedFiles = [...selectedFiles, ...newFiles];

                                                            setSelectedFiles(updatedFiles);
                                                            field.onChange(updatedFiles);
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="fileInput"
                                                    className="cursor-pointer flex items-center gap-2 border p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                                >
                                                    <IoMdAdd />
                                                </label>
                                                {selectedFiles.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShow(true)}
                                                    >
                                                        <BiShow className="size-7" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {show &&
                                                    selectedFiles.map((file, index) => (
                                                        <div key={index} className="relative">
                                                            <img src={URL.createObjectURL(file)} alt="" className="size-10 object-cover rounded" />
                                                            <button
                                                                type="button"
                                                                className="absolute h-4 -top-1 -right-1 bg-gray-400 w-fit rounded-full p-0"
                                                                onClick={() => {
                                                                    const newFiles = selectedFiles.filter((_, i) => i !== index);
                                                                    setSelectedFiles(newFiles);
                                                                    field.onChange(newFiles);
                                                                }}
                                                            >
                                                                <GrFormClose />
                                                            </button>
                                                        </div>
                                                    ))}
                                            </div>

                                        </div>
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
                                    {"Annuler"}
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
