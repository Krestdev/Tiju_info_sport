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

const formSchema = z
    .object({
        nom: z.string().min(4, {
            message: "Name must be at least 4 characters.",
        }),
        lien: z.string(),
        image: z.string().email(),
        date: z.string(),
    });

function AddPubsForm({ addButton }: { addButton: string }) {

    const { addPub } = useStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        addPub({
            id: Date.now(),
            nom: values.nom,
            lien: values.lien,
            image: values.image,
            date: new Date(Date.now()).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }),
        });
        queryClient.invalidateQueries({ queryKey: ["articles"] })
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
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Image"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Image" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <span className="flex items-center gap-3 flex-wrap">
                            <Button type="submit" className="w-fit" onClick={() => { console.log(form.getValues()); console.log(form.formState) }}>
                                {"Ajouter une nouvele Publicité"}
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

export default AddPubsForm;
