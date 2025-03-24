import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Abonnement, Article, Categories } from "@/data/temps";
import FullScreen from "../FullScreen";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GrFormClose } from "react-icons/gr";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { LuEye, LuPlus } from "react-icons/lu";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formSchema = z.object({
    nom: z.string().min(3, { message: "Le nom doit avoir au moins 3 caractères" }),
    description: z.string().min(10, { message: "La description doit avoir au moins 10 caractères" }),
    parent: z.string().optional()
})


type Props = {
    children: ReactNode;
    donnee: Category;
    nom: string | undefined
};

function EditCategorie({ children, donnee, nom }: Props) {

    const { dataSubscription, dataCategorie, editCategorie } = useStore()
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [cate, setCate] = useState<Categories[]>()
    const queryClient = useQueryClient();
    const [parent, setParent] = useState<Categories[]>();


    const subsData = useQuery({
        queryKey: ["abonnement"],
        queryFn: async () => dataSubscription
    })

    const cateData = useQuery({
        queryKey: ["category"],
        queryFn: async () => dataCategorie
    })


    useEffect(() => {
        if (cateData.isSuccess) {
            setCate(cateData.data.filter(x => x.parent))
        }
    }, [cateData.data])

    useEffect(() => {
        if (cateData.isSuccess) {
            setParent(cateData.data.filter(x => !x.parent))
        }
    }, [cateData.data])

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: donnee.title,
            description: donnee.description,
            // parent: String(donnee.parent?.id)
        }
    })

    // console.log((donnee));


    //Submit function
    function onSubmit(values: z.infer<typeof formSchema>) {
        const update = {
            nom: values.nom,
            description: values.description
        };
        const idP = values.parent ? dataCategorie.find((cat) => cat.id === Number(values.parent))?.id : undefined;

        console.log(idP);

        editCategorie(donnee.id, update, idP);
        queryClient.invalidateQueries({ queryKey: ["category"] });
        setDialogOpen(false);
        toast.success("Modifié avec succès");
        form.reset();
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md p-6 scrollbar">
                <DialogHeader>
                    <DialogTitle>{"Modifier une Catégorie"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier une Catégorie"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 px-7 py-10'>
                        <h1 className='uppercase text-[28px]'>{"Modifier une catégorie"}</h1>
                        <FormField
                            control={form.control}
                            name='nom'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} className='h-[60px] max-w-[384px] text-[24px]' placeholder='Titre de la catégorie' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Description de la catégorie"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Entrez une description' className='h-[60px] max-w-[384px]' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="parent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Catégorie parent"}</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                                            value={field.value ?? "none"}
                                        >
                                            <SelectTrigger className="border border-[#A1A1A1] max-w-[384px] w-full h-[40px] flex items-center p-2 rounded-none">
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2">
                                                <SelectItem value="none">{"Sélectionner une catégorie"}</SelectItem>
                                                {parent?.map((x, i) => (
                                                    <SelectItem key={i} value={String(x.id)}>
                                                        {x.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button onClick={() => console.log(form.getValues())} type="submit" className='rounded-none max-w-[384px] w-full'>{"Modifier"}</Button>
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-none max-w-[384px] w-full">
                                Annuler
                            </Button>
                        </DialogClose>
                    </form>

                </Form>
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
}

export default EditCategorie;
