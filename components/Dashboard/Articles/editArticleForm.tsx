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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Abonnement, Article } from "@/data/temps";
import FullScreen from "../FullScreen";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GrFormClose } from "react-icons/gr";
import { IoMdAdd, IoMdClose } from "react-icons/io";

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
            (file) => !file || file instanceof File,
            { message: "Image must be a file." }
        ),
    abonArticle: z.string(),
});


type Props = {
    children: ReactNode;
    donnee: Article;
    nom: string | undefined
};

function EditArticleForm({ children, donnee, nom }: Props) {

    const { dataSubscription } = useStore()
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [images, setImages] = useState<string[] | undefined>(donnee.media);
    const [abon, setAbon] = useState<Abonnement[]>();
    const queryClient = useQueryClient();

    const subsData = useQuery({
        queryKey: ["abonnement"],
        queryFn: async () => dataSubscription
    })

    useEffect(()=>{
        if (subsData.isSuccess) {
            setAbon(subsData.data)
        }
    }, [subsData.data])

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: nom,
            type: donnee.type,
            titre: donnee.titre,
            extrait: donnee.extrait,
            description: donnee.description,
            media: donnee.media,
            abonArticle: donnee.abonArticle.nom
        },
    });

    //Submit function
    function onSubmit(values: z.infer<typeof formSchema>) {
        // editPub({
        //     nom: values.nom,
        //     lien: values.lien,
        //     image: new File([""], "/images/pub.jpg", { type: "image/jpeg" }),
        // });
        console.log(values);
        queryClient.invalidateQueries({ queryKey: ["client"] });
        setDialogOpen(false);
        toast.success("Modifié avec succès");
        form.reset();
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="!max-w-2xl !w-full">
                <DialogHeader>
                    <DialogTitle>{"Modifier une Publicité"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier une Publicité"}
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
                                        <Input {...field} value={nom} disabled placeholder="ex. Football" />
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


                        <div className="flex flex-row items-center gap-2">
                            <FormField
                                control={form.control}
                                name="media"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Image"}</FormLabel>
                                        <FormControl>
                                            <div>
                                                <div className="flex flex-row gap-2 flex-wrap">
                                                    {
                                                        images?.map((x, index) => (
                                                            <div key={index} className="relative">
                                                                <FullScreen image={x}>
                                                                    <img src={x} alt="" className="size-14 object-cover cursor-pointer" />
                                                                </FullScreen>
                                                                <button
                                                                    type="button"
                                                                    className="absolute h-4 -top-1 -right-1 bg-gray-400 w-fit rounded-full p-0"
                                                                    onClick={() => {
                                                                        const newFiles = images.filter((_, i) => i !== index);
                                                                        setImages(newFiles);
                                                                        field.onChange(newFiles);
                                                                    }}
                                                                >
                                                                    <GrFormClose />
                                                                </button>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <div className="flex flex-row gap-4 items-center justify-center mt-2">
                                                    {images?.length ? images?.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImages([]);
                                                                field.onChange([]);
                                                            }}
                                                            className="mt-2 p-2 w-fit bg-red-500 text-white rounded-full hover:bg-red-600"
                                                        >
                                                            <IoMdClose />
                                                        </button>
                                                    ) : ""}
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                field.onChange(e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    {/* <Input
                                                        id="fileInput"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            if (e.target.files) {
                                                                const newFiles = Array.from(e.target.files);
                                                                // const updatedFiles = [...images, ...newFiles];

                                                                // setImages(updatedFiles);
                                                                // field.onChange(updatedFiles);
                                                            }
                                                        }}
                                                    /> */}
                                                    <label
                                                        htmlFor="fileInput"
                                                        className="cursor-pointer flex items-center gap-2 border p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                                    >
                                                        <IoMdAdd />
                                                    </label>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <span className="flex items-center gap-3 flex-wrap">
                            <Button onClick={() => console.log(form.getValues())} type="submit" className="w-fit">
                                {"Publier"}
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

export default EditArticleForm;
