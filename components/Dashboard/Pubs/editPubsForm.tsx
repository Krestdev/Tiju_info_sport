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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pubs } from "@/data/temps";
import FullScreen from "../FullScreen";
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
        ),
    dateFin: z.string()
});


type Props = {
    children: ReactNode;
    selectedPubs: Advertisement;
};

function EditPubsForm({ children, selectedPubs }: Props) {
    const { editPub, token } = useStore();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const queryClient = useQueryClient();
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: selectedPubs.title,
            lien: selectedPubs.url,
            image: selectedPubs.image,
            // type: selectedPubs.type,
            dateFin: new Date(365 - Number(selectedPubs.createdAt)).toString()
        },
    });

    const editAdvertisement = useMutation({
        mutationKey: ["advertisement"],
        mutationFn: ({ data, id }: { data: z.infer<typeof formSchema>, id: string },) => {
            return axiosClient.patch(`/advertisement/${id}`, {
                user_id: "3",
                title: data.nom,
                description: data.type,
                image: data.image,
                url: data.lien
            });
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        editAdvertisement.mutate({ data: data, id: selectedPubs.id.toString() });
    }

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




    //Submit function
    // function onSubmit(values: z.infer<typeof formSchema>) {
    //     editPub({
    //         id: selectedPubs.id,
    //         nom: values.nom,
    //         lien: values.lien,
    //         image: values.image,
    //         type: values.type,
    //         dateDebut: selectedPubs.createdAt,
    //         dateFin: new Date(365 - Number(selectedPubs.createdAt)).toString(),
    //         // statut: selectedPubs.statut
    //     });
    //     queryClient.invalidateQueries({ queryKey: ["client"] });
    //     setDialogOpen(false);
    //     toast.success("Modifié avec succès");
    //     form.reset();
    // }

    const type = ["large", "petit"]


    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Modifier une Publicité"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier une Publicité"}
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
                            name="dateFin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Date de fin"}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} placeholder="Date de fin" />
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
                        <div className="flex flex-row gap-2">
                            <FullScreen image={selectedPubs.image} >
                                <img src={selectedPubs.image} alt="" className="size-16 object-cover cursor-pointer" />
                            </FullScreen>
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
                        </div>
                        <FormField
                            control={form.control}
                            name="lien"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Lien vers la pub..."}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Lien vers la pub..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <span className="flex items-center gap-3 flex-wrap">
                            <Button onClick={() => console.log(form.getValues())} type="submit" className="w-fit">
                                {"Modifier la Pub"}
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

export default EditPubsForm;
