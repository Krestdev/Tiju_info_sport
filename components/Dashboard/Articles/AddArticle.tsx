"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useStore from '@/context/store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from '@/components/ui/input';
import LexicalEditor from './LexicalEditor';
import { Textarea } from '@/components/ui/textarea';
import { LuEye, LuPlus } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import { BiShow } from 'react-icons/bi';
import { GrFormClose } from 'react-icons/gr';
import { Categories } from '@/data/temps';
import DatePubli from './DatePubli';
import AddCategory from '../Categories/AddCategory';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const imageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const videoMimeTypes = ["video/mp4", "video/webm", "video/ogg"];

const formSchema = z.object({
    // nom: z.string().min(4, {
    //     message: "Name must be at least 4 characters.",
    // }),
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
        ).optional(),
    // ajouteLe: z.string(),
    // abonArticle: z.string(),

});


const AddArticle = () => {

    const { addCategory, currentAdmin, dataArticles, dataCategorie } = useStore();
    const queryClient = useQueryClient();
    const [article, setArticle] = useState<string[]>()
    const [entry, setEntry] = useState<string>("")
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [show, setShow] = useState(false);
    const [photo, setPhoto] = useState<string>();
    const [cate, setCate] = useState<Categories[]>()
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles
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
        if (articleData.isSuccess) {
            setArticle([...new Set(articleData.data.flatMap(x => x.donnees).flatMap(x => x.type))])
        }
    }, [articleData.data])



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // nom: "",
            type: "",
            titre: "",
            extrait: "",
            description: "",
            media: "",
            // abonArticle: ""
        },
    });

    const handleOpen = () => {
        if (formSchema.safeParse(form.getValues()).success) {
            setDialogOpen(true);
        } else {
            toast.error("Veuillez remplir correctement le formulaire.");
        }
    };


    function onSubmit(values: z.infer<typeof formSchema>) {
        addCategory({
            nom: cateData.data!.find(x => x.nom === values.type)!.parent!.nom,
            donnees: [
                {
                    id: Date.now(),
                    type: values.type,
                    titre: values.titre,
                    extrait: values.extrait,
                    description: values.description,
                    ajouteLe: new Date(Date.now()).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
                    media: values.media,
                    user: currentAdmin!,
                    abonArticle: {
                        id: 4,
                        nom: "Bouquet normal",
                        coutMois: 0,
                        coutAn: 0,
                    },
                    commentaire: [],
                    like: [],
                    statut: "brouillon",
                    auteur: currentAdmin!,
                    couverture: values.couverture
                }
            ]
        });
        queryClient.invalidateQueries({ queryKey: ["pubs"] })
        toast.success("Ajouté avec succès");
        form.reset();
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEntry(event.target.value); // Mettre à jour l'entrée en fonction de la saisie
    }

    // Filtrer les catégories en fonction de la saisie
    const filteredCategories = (cate || []).filter((x) =>
        x.nom.toLowerCase().includes(entry.toLowerCase())
    );


    return (
        <Form {...form}>
            <form
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
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <LexicalEditor value={field.value} onChange={field.onChange} />
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
                                                            {"Sélectionner une Catégorie"}
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent className='border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2'>
                                            <div>
                                                <Input
                                                    type="search"
                                                    onChange={handleInputChange}
                                                    value={entry}
                                                    placeholder="Rechercher une catégorie"
                                                    className="h-10 w-full"
                                                    onKeyDown={(e) => e.stopPropagation()} // Empêche la fermeture lors de la saisie
                                                />
                                                {filteredCategories.length > 0 ? (
                                                    filteredCategories.map((x, i) => (
                                                        <SelectItem key={i} value={x.nom}>
                                                            {x.nom}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <p className="p-2 text-gray-500">Aucune catégorie trouvée</p>
                                                )}
                                                <AddCategory>
                                                    <Button className="rounded-none w-full">{"Ajouter une catégorie"}</Button>
                                                </AddCategory>
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
                    <Button
                        variant="outline"
                        className="max-w-[384px] w-full font-normal rounded-none"
                        type="button"
                        onClick={() => form.handleSubmit(onSubmit)()}>
                        {"Enregistrer"}
                    </Button>

                    {/* <DatePubli donnee={form.getValues()} >
                        <Button
                            type="submit"
                            className="max-w-[384px] w-full rounded-none font-normal"
                            onClick={() => form.setValue("action", "publish")}
                        >
                            {"Publier"}
                        </Button>
                    </DatePubli> */}
                    <DatePubli donnee={form.getValues()} isOpen={dialogOpen} onOpenChange={setDialogOpen} />
                    <Button
                        type="submit"
                        className="max-w-[384px] w-full rounded-none font-normal"
                        onClick={(e) => {
                            e.preventDefault();
                            handleOpen();
                        }}
                    >
                        {"Publier"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default AddArticle
