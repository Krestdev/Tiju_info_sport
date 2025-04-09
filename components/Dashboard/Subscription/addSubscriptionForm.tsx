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
import { LuPlus } from "react-icons/lu";

const formSchema = z.object({
    nom: z.string().min(4, {
        message: "Le nom doit contenir au moins 4 caractères.",
    }),
    coutMois: z.number({
        required_error: "Le coût doit être un nombre valide.",
        invalid_type_error: "Le coût doit être un nombre valide.",
    }).positive("Le coût doit être un nombre positif."),
    coutAn: z.number({
        required_error: "Le coût doit être un nombre valide.",
        invalid_type_error: "Le coût doit être un nombre valide.",
    }).positive("Le coût doit être un nombre positif."),
});


function AddSubscriptionForm({ addButton }: { addButton: string }) {

    const [dialogOpen, setDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            coutMois: 0,
            coutAn: 0
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // addSubscription({
        //     id: Date.now(),
        //     nom: values.nom,
        //     coutMois: Number(values.coutMois),
        //     coutAn: Number(values.coutAn),
        // });
        // queryClient.invalidateQueries({ queryKey: ["subscription"] })
        // setDialogOpen(false);
        // toast.success("Ajouté avec succès");
        // form.reset();
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-none">
                    <LuPlus size={20} />
                    {addButton}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Ajouter un nouvel abonnement"}</DialogTitle>
                    <DialogDescription>
                        {"remplir ce formulaire pour ajouter un nouvel abonnement"}
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
                                        <Input {...field} placeholder="Nom" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="coutMois"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Prix Mois (en FCFA)"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder="Coût de l'abonnement sur 1 mois FCFA"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="coutAn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Prix An (en FCFA)"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder="Coût de l'abonnement sur 1 an en FCFA"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <span className="flex items-center gap-3 flex-wrap">
                            <Button onClick={() => console.log(form.getValues())} type="submit" className="w-fit">
                                {"Ajouter un nouvel abonnement"}
                            </Button>
                            <DialogClose asChild>
                                <Button className="rounded-none" variant={"outline"} onClick={() => form.reset()}>
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

export default AddSubscriptionForm;
