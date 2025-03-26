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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LuPlus } from "react-icons/lu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosConfig from "@/api/api";

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

    const { addPub, token } = useStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "*/*",
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            lien: "",
        },
    });


    const addAdvertisement = useMutation({
        mutationKey: ["advertisement"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            return axiosClient.post("/advertisement",
                {
                    user_id: "3",
                    title: data.nom,
                    description: data.type,
                    image: data.image,
                    url: data.lien
                }
            )
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        addAdvertisement.mutate(data);
    }

    React.useEffect(() => {
        if (addAdvertisement.isSuccess) {
            toast.success("Ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            setDialogOpen(prev => !prev);
        } else if (addAdvertisement.isError) {
            toast.error("Erreur lors de la création de l'article");
            console.log(addAdvertisement.error)
        }
    }, [addAdvertisement.isError, addAdvertisement.isSuccess, addAdvertisement.error])

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
                                    <FormLabel>Image</FormLabel>
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
                            <Button onClick={() => console.log(form.getValues())} type="submit" className="w-fit">
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
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
}

export default AddPubsForm;
