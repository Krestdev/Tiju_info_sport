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
    cout: z.number({
        required_error: "Le coût doit être un nombre valide.",
        invalid_type_error: "Le coût doit être un nombre valide.",
    }).positive("Le coût doit être un nombre positif."),
    validite: z.number({
        required_error: "La validité doit être un nombre valide.",
        invalid_type_error: "La validité doit être un nombre valide.",
    }).int("La validité doit être un nombre entier.").positive("La validité doit être un nombre positif."),
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
            cout: selectedPubs.cout,
            validite: selectedPubs.validite,
        },
    });



    //Submit function
    function onSubmit(values: z.infer<typeof formSchema>) {
        editSubscription({
            nom: values.nom,
            cout: values.cout,
            validite: values.validite
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
                    <DialogTitle>{"Modifier l'abonnement"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier l'abonnement"}
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
                            name="cout"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Coût (en FCFA)"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder="Coût de l'abonnement en FCFA"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="validite"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Validité (en Mois)"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder="Validité de l'abonnement en FCFA"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <span className="flex items-center gap-3 flex-wrap">
                            <Button onClick={() => console.log(form.getValues())} type="submit" className="w-fit">
                                {"Modifier l'abonnement"}
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

export default EditSubscriptionForm;
