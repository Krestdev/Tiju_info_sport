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
import { Abonnement, Article, Categories } from "@/data/temps";
import FullScreen from "../FullScreen";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GrFormClose } from "react-icons/gr";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import LexicalEditor from "./LexicalEditor";
import { LuEye, LuPlus } from "react-icons/lu";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
    couverture: z.any(),
    // .custom<File>((file) => file instanceof File, {
    //     message: "Veuillez sélectionner un fichier valide.",
    // })
    // .refine((file) => file.size < MAX_FILE_SIZE, {
    //     message: "Le fichier est trop volumineux (max 5MB).",
    // }),
    media: z
        .any()
        .refine(
            (files) =>
                Array.isArray(files) && files.length > 0 && files.every(file => file instanceof File),
            { message: "Veuillez sélectionner au moins une image et assurez-vous que chaque image est un fichier valide." }
        ),
    abonArticle: z.string(),

});


type Props = {
    children: ReactNode;
    donnee: Article;
    nom: string | undefined
};

function EditArticle({ children, donnee, nom }: Props) {

    const { dataSubscription, dataCategorie } = useStore()
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [images, setImages] = useState<string[] | undefined>(donnee.media);
    const [abon, setAbon] = useState<Abonnement[]>();
    const [photo, setPhoto] = useState<string>(donnee.couverture);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [entry, setEntry] = useState<string>("")
    const [show, setShow] = useState(false);
    const [cate, setCate] = useState<Categories[]>()
    const queryClient = useQueryClient();

    const subsData = useQuery({
        queryKey: ["abonnement"],
        queryFn: async () => dataSubscription
    })

    const cateData = useQuery({
        queryKey: ["category"],
        queryFn: async () => dataCategorie
    })

    useEffect(() => {
        if (subsData.isSuccess) {
            setAbon(subsData.data)
        }
    }, [subsData.data])

    useEffect(() => {
        if (cateData.isSuccess) {
            setCate(cateData.data.filter(x => x.parent))
        }
    }, [cateData.data])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEntry(e.target.value)
    }

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...donnee,
            abonArticle: donnee.abonArticle.nom,
            type: donnee.type,
        },
    });

    console.log((donnee));


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
            <DialogContent className="w-screen h-screen max-w-none p-6 scrollbar">
                <DialogHeader>
                    <DialogTitle>{"Modifier une Publicité"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier une Publicité"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 px-7 py-10"
                    >
                        <h1 className='uppercase text-[40px]'>{"Ajouter un article"}</h1>

                        <FormField
                            control={form.control}
                            name="titre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} className='h-[60px] border-[#A1A1A1]' placeholder="Titre de l'article" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => {
                                console.log(field.value);
                                
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <LexicalEditor value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }
                            }
                        />
                        <FormField
                            control={form.control}
                            name="extrait"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Extrait de l'article"}</FormLabel>
                                    <FormControl>
                                        <Input className='max-w-[384px] w-full h-[60px]' {...field} placeholder="Résumé de l'article" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="couverture"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Photo de couverture de l'Article"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            className="max-w-[384px] w-full h-[60px]"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        setPhoto(reader.result as string);
                                                        field.onChange(reader.result);
                                                    };
                                                    reader.readAsDataURL(file);
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
                            name="media"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Ajouter des images"}</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col gap-2">
                                            <div className='max-w-[384px] w-full h-[60px] flex gap-4 items-center justify-center'>
                                                {selectedFiles.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedFiles([]);
                                                            field.onChange([]);
                                                        }}
                                                        className="mt-2 p-2 w-fit bg-red-500 text-white rounded-full hover:bg-red-600"
                                                    >
                                                        <IoMdClose />
                                                    </button>
                                                )}
                                                <Input
                                                    id="fileInput"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.files) {
                                                            const newFiles = Array.from(e.target.files);
                                                            const updatedFiles = [...selectedFiles, ...newFiles];

                                                            setSelectedFiles(updatedFiles);
                                                            field.onChange(updatedFiles);
                                                        }
                                                    }}
                                                    className='w-full h-[60px]'
                                                />
                                                <label
                                                    htmlFor="fileInput"
                                                    className="cursor-pointer flex items-center gap-2 border p-2 rounded-full bg-gray-50 text-black"
                                                >
                                                    <IoMdAdd />
                                                </label>
                                                {selectedFiles.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShow(true)}
                                                    >
                                                        <LuEye className="size-7 text-gray-300" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {show &&
                                                    selectedFiles.map((file, index) => (
                                                        <div key={index} className="relative">
                                                            <img src={URL.createObjectURL(file)} alt="" className="size-10 object-cover rounded" />
                                                            <button
                                                                type="button"
                                                                className="absolute h-4 -top-1 -right-1 bg-gray-400 w-fit rounded-full p-0"
                                                                onClick={() => {
                                                                    const newFiles = selectedFiles.filter((_, i) => i !== index);
                                                                    setSelectedFiles(newFiles);
                                                                    field.onChange(newFiles);
                                                                }}
                                                            >
                                                                <GrFormClose />
                                                            </button>
                                                        </div>
                                                    ))}
                                            </div>

                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex flex-col gap-2'>
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Catégorie"}</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className='border border-[#A1A1A1] max-w-[384px] w-full h-[60px] flex items-center p-2 rounded-none'>
                                                    <SelectValue
                                                        placeholder={
                                                            <div>
                                                                <div className='h-10 flex gap-2 px-3 py-2 border border-[#A1A1A1] items-center'>
                                                                    <LuPlus />
                                                                    {"Ajouter une Catégorie"}
                                                                </div>
                                                            </div>
                                                        } />
                                                </SelectTrigger>
                                                <SelectContent className='border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2'>
                                                    <div>
                                                        <Input
                                                            type='search'
                                                            onChange={handleSearch}
                                                            value={entry}
                                                            placeholder='rechercher une catégorie'
                                                            className='h-10 w-full'
                                                        />
                                                        {cate?.map((x, i) => (
                                                            <SelectItem key={i} value={x.nom}>
                                                                {x.nom}
                                                            </SelectItem>
                                                        ))}
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <Button onClick={() => console.log(form.getValues())} variant={"outline"} className='max-w-[384px] w-full font-normal rounded-none'>{"Enregistrer"}</Button>
                            <Button onClick={() => console.log(form.getValues())} className='max-w-[384px] w-full rounded-none font-normal'>{"Publier"}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
}

export default EditArticle;
