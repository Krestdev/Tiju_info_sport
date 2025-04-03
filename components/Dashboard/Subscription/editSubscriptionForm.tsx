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
import useStore from "@/context/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Abonnement, Pubs } from "@/data/temps";

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


type Props = {
    children: ReactNode;
    selectedPubs: Abonnement;
};

function EditSubscriptionForm({ children, selectedPubs }: Props) {
    const { editSubscription } = useStore();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const queryClient = useQueryClient();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: selectedPubs.nom,
            coutMois: selectedPubs.coutMois,
            coutAn: selectedPubs.coutAn,
        },
    });



    //Submit function
    function onSubmit(values: z.infer<typeof formSchema>) {
        editSubscription({
            nom: values.nom,
            coutMois: values.coutMois,
            coutAn: values.coutAn
        });
        console.log(values);
        queryClient.invalidateQueries({ queryKey: ["client"] });
        setDialogOpen(false);
        toast.success("Modifié avec succès");
        form.reset();
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
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

export default EditSubscriptionForm;
