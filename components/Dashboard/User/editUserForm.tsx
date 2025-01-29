
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useStore from "@/context/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { abonnement, Abonnement, Users } from "@/data/temps";

const formSchema = z
    .object({
        nom: z.string().min(4, {
            message: "Le nom doit avoir au moins 4 caractères ",
        }),
        pseudo: z.string(),
        email: z.string().email(),
        phone: z.string().regex(/^\d{9}$/, "Le numero de telephone doit avoir au moins 8 caractères"),
        password: z
            .string()
            .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
            .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
            .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." }),
        role: z.string({ message: "Vous devez selectionner selectionner a role" }),
        abonnement: z.string(),
    });


type Props = {
    children: ReactNode;
    selectedUser: Users;
};

function EditUserForm({ children, selectedUser }: Props) {
    const { editUser, dataSubscription } = useStore();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [abon, setAbon] = useState<Abonnement[]>()

    const queryClient = useQueryClient();
    const abonData = useQuery({
        queryKey : ["abonnement"],
        queryFn: async () => dataSubscription
    })

    useEffect(()=>{
        if (abonData.isSuccess) {
            setAbon(abonData.data)
        }
    }, [abonData.data])

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: selectedUser.nom,
            email: selectedUser.email,
            phone: selectedUser.phone,
            password: selectedUser.password,
            role: selectedUser.role,
            pseudo: selectedUser.pseudo,
            abonnement: selectedUser.abonnement?.nom
        },
    });



    //Submit function
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Hello");

        editUser({
            id: selectedUser.id,
            nom: values.nom,
            email: values.email,
            phone: values.phone,
            password: values.password,
            role: values.role,
            pseudo: values.pseudo,
            abonnement: abon?.find(x => x.nom === values.abonnement),
            createdAt: selectedUser.createdAt,
        });
        console.log(values);
        queryClient.invalidateQueries({ queryKey: ["client"] });
        setDialogOpen(false);
        toast.success("Modifié avec succès");
        form.reset();
    }

    const role = ["admin", "user"]

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Modifier un Utilisateur"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier un utilisateur"}
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
                                        <Input type="password" hidden={false} placeholder="********" {...field} className="w-full" />
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
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {role.map((rol, index) => (
                                                    <SelectItem key={index} value={rol}>
                                                        {rol}
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
                                {"Modify User"}
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

export default EditUserForm;
