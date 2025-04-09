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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LuPlus } from "react-icons/lu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosConfig from "@/api/api";
import { AxiosResponse } from "axios";

const formSchema = z.object({
    nom: z.string().min(1, {
        message: "Vous devez taper au moins 1 caractère",
    }),
    type: z.string(),
    lien: z.string({
        message: "LE lien doit etre une URL",
    }),
    image: z
        .any()
        .refine(
            (file) => !file || file instanceof File,
            { message: "Image must be a file." }
        )
});


function AddPubsForm({ addButton }: { addButton: string }) {

    const { token, currentUser } = useStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [image, setImage] = useState("")
    const [artId, setArtId] = useState("")
    const [articleAjout, setArticleAjout] = useState<Advertisement>()
    const [ads, setAds] = useState<Advertisement | null>(null)
    const [fichier, setFichier] = useState(null)
    const queryClient = useQueryClient();
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Accept": "*/*",
        "x-api-key": "abc123",
        'Content-Type': 'multipart/form-data'
    });

    const axiosClient1 = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            type: "",
            lien: "",
            image: ""
        },
    });


    const addAdvertisement = useMutation({
        mutationKey: ["advertisement"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const idU = currentUser && currentUser.id
            return axiosClient.post("/advertisement",
                {
                    user_id: idU,
                    title: data.nom,
                    description: data.type,
                    image: "default",
                    url: data.lien
                }
            )
        },
        onSuccess(data) {
            setAds(data.data);
            console.log(fichier);
            fichier && addImage.mutate({ data: fichier, id: data.data.id })
        },
    })

    React.useEffect(() => {
        if (addAdvertisement.isSuccess) {
            toast.success("Ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["advertisement"] });
            setImage(addAdvertisement.data.data.id)
            setDialogOpen(prev => !prev);
        } else if (addAdvertisement.isError) {
            toast.error("Erreur lors de la création de l'article");
            console.log(addAdvertisement.error)
        }
    }, [addAdvertisement.isError, addAdvertisement.isSuccess, addAdvertisement.error])

    const addImage = useMutation({
        mutationKey: ["advertisement"],
        mutationFn: ({ data, id }: { data: any, id: number }) => {
            return axiosClient.post("/image",
                {
                    file: data,
                    ads_id: id
                }
            )
        },
        // onSuccess(data) { 
        //    ads &&  editAdvertisement.mutate({ data: ads, id: data.data.id });
        // },
    })

    React.useEffect(() => {
        if (addImage.isSuccess) {
            setImage(addImage.data.data.id)
        } else if (addImage.isError) {
            console.log(addImage.error)
        }
    }, [addImage.isError, addImage.isSuccess, addImage.error, addAdvertisement.data, addAdvertisement.isSuccess])

    const editAdvertisement = useMutation({
        mutationKey: ["advertisement"],
        mutationFn: ({ data, id }: { data: Advertisement, id: string },) => {
            const idU = currentUser && String(currentUser.id)
            return axiosClient1.patch(`/advertisement/${data.id}`, {
                user_id: idU,
                title: data.title,
                description: data.description,
                url: data.url,
                image: `https://tiju.krestdev.com/api/image/${id}`,
            });
        },
    });


    React.useEffect(() => {
        if (editAdvertisement.isSuccess) {
            toast.success("Modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["advertisement"] });
            setDialogOpen(prev => !prev);
            form.reset();
        } else if (editAdvertisement.isError) {
            toast.error("Erreur lors de la modification de la catégorie");
            console.log(editAdvertisement.error)
        }
    }, [editAdvertisement.isError, editAdvertisement.isSuccess, editAdvertisement.error])


    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setFichier(data.image)
        addAdvertisement.mutate(data);
    }

    const type = ["large", "petit"]

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-none font-ubuntu" variant={"default"}>
                    <LuPlus />
                    {addButton}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Ajouter une nouvele Publicité"}</DialogTitle>
                    <DialogDescription>
                        {"remplir ce formulaire pour ajouter une nouvele Publicité"}
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
                                    <FormLabel>{"Titre"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Titre de la publicité" />
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
                                    <FormLabel>{"Type d'image"}</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="rounded-none">
                                                <SelectValue
                                                    placeholder={
                                                        <div>
                                                            {"Type d'image"}
                                                        </div>
                                                    } />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {type.map((x, i) => (
                                                    <SelectItem key={i} value={x}>
                                                        {x}
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
                            name="image"
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

                        <FormField
                            control={form.control}
                            name="lien"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Lien..."}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Lien vers la pub..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <span className="flex items-center gap-3 flex-wrap">
                            <Button type="submit" className="w-fit">
                                {"Ajouter une nouvele Publicité"}
                            </Button>
                            <DialogClose asChild>
                                <Button variant={"outline"} onClick={() => form.reset()}>
                                    {"Fermer"}
                                </Button>
                            </DialogClose>
                        </span>
                    </form>
                </Form>
                <ToastContainer />
            </DialogContent>
        </Dialog>
    );
}

export default AddPubsForm;
