"use client"

import axiosConfig from '@/api/api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useStore from '@/context/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GrFormClose } from 'react-icons/gr';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import { LuEye, LuPlus } from 'react-icons/lu';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import AddCategory from '../Categories/AddCategory';
import LexicalEditor from './LexicalEditor';
import DatePubli from './DatePubli';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const imageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const videoMimeTypes = ["video/mp4", "video/webm", "video/ogg"];

const formSchema = z.object({
    type: z.string(),
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
    media: z
        .any()
        .refine(
            (files) =>
                Array.isArray(files) && files.length > 0 && files.every(file => file instanceof File),
            { message: "Veuillez sélectionner au moins une image et assurez-vous que chaque image est un fichier valide." }
        ).optional(),
    status: z.string(),
});


const AddArticle = () => {

    const { token, currentUser } = useStore();
    const queryClient = useQueryClient();
    const [entry, setEntry] = useState<string>("")
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [show, setShow] = useState(false);
    const [photo, setPhoto] = useState<string>();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [categorie, setCategorie] = useState<Category[]>();
    const [articleAjout, setArticleAjout] = useState<Article>();
    const [fichier, setFichier] = useState(null);
    const [artId, setArtId] = useState(0);
    const [art, setArt] = useState<Article | null>(null)

    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Accept": "*/*",
        "x-api-key": "abc123",
        'Content-Type': 'multipart/form-data'
    });

    const axiosClient1 = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "",
            titre: "",
            extrait: "",
            description: "",
            media: "",
            status: "save"
        },
    });

    const addArticle = useMutation({
        mutationKey: ["articles"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const idU = String(currentUser.id)

            return axiosClient.post("/articles",
                {
                    user_id: idU,
                    category_id: categorie?.find(x => x.title === data.type)?.id,
                    title: data.titre,
                    summary: data.extrait,
                    description: data.description,
                    type: data.type,
                    status: data.status
                }
            )
        },
        onSuccess(data) {
            setArt(data.data);
            fichier && addImage.mutate({ data: fichier[0], id: data.data.id })
        },
    })

    const addArticle1 = useMutation({
        mutationKey: ["articles"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const idU = String(currentUser.id)

            return axiosClient.post("/articles",
                {
                    user_id: idU,
                    category_id: categorie?.find(x => x.title === data.type)?.id,
                    title: data.titre,
                    summary: data.extrait,
                    description: data.description,
                    type: data.type,
                    status: data.status
                }
            )
        },
        onSuccess(data) {
            setArt(data.data);
            fichier && addImage1.mutate({ data: fichier[0], id: data.data.id })
            handleOpen();
        },
    })

    React.useEffect(() => {
        if (addArticle.isSuccess) {
            setDialogOpen(prev => !prev);
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        } else if (addArticle.isError) {
            toast.error("Erreur lors de la création de l'article");
            console.log(addArticle.error)
        }
    }, [addArticle.isError, addArticle.isSuccess, addArticle.error, addArticle.data])

    const { mutate: deleteArticle } = useMutation({
        mutationFn: async (articleId: number) => {
            return axiosClient.delete(`/articles/${articleId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
    });

    const addImage = useMutation({
        mutationKey: ["articles"],
        mutationFn: ({ data, id }: { data: any, id: number }) => {
            setArtId(id)
            return axiosClient.post("/image",
                {
                    file: data,
                    article_id: id
                }
            )
        },
        onError(error: any) {
            console.log(error.status);
            // if (error.status === 500) {
            toast.error("La taille maximale de l'image doit être de 2Mo")
            // }
            deleteArticle(artId)
        },
    })

    const addImage1 = useMutation({
        mutationKey: ["articles"],
        mutationFn: ({ data, id }: { data: any, id: number }) => {
            setArtId(id)
            return axiosClient.post("/image",
                {
                    file: data,
                    article_id: id
                }
            )
        },
        onError(error: any) {
            console.log(error.status);
            // if (error.status === 500) {
            toast.error("La taille maximale de l'image doit être de 2Mo")
            // }
            deleteArticle(artId)
        },
    })

    React.useEffect(() => {
        if (addImage.isSuccess) {
            toast.success("Article ajouté avec succès")
            form.reset();
        }
    }, [addImage.isError, addImage.isSuccess, addImage.error, addArticle.data, addArticle.isSuccess])

    const articleCate = useQuery({
        queryKey: ["categoryv"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Category[]>>(
                `/category`
            );
        },
    });

    useEffect(() => {
        if (articleCate.isSuccess) {
            setCategorie(articleCate.data.data.filter(x => x.parent !== null));
        }
    }, [articleCate.data])

    const editArticle = useMutation({
        mutationKey: ["pictures"],
        mutationFn: ({ data, imageId }: { data: Article, imageId: string },) => {
            const idU = String(currentUser.id)
            return axiosClient1.patch(`/articles/${data.id}`, {
                user_id: idU,
                title: data.title,
                summary: data.summery,
                description: data.description,
                type: data.type,
                images: `https://tiju.krestdev.com/api/image/${imageId}`
            });
        },
        retry: 5,
        retryDelay: 5000
    });

    React.useEffect(() => {
        if (editArticle.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            form.reset();
        } else if (editArticle.isError) {
            console.log(editArticle.error)
        }
    }, [editArticle.isError, editArticle.isSuccess, editArticle.error])


    // Soumission du formulaire

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setFichier(data.media);
        addArticle.mutate(data);
    }

    const onSubmit1 = (data: z.infer<typeof formSchema>) => {
        setFichier(data.media);
        addArticle1.mutate(data);
    }

    const handleOpen = () => {
        if (formSchema.safeParse(form.getValues()).success) {
            setDialogOpen(true);
        } else {
            toast.error("Veuillez remplir correctement le formulaire.");
        }
    };

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEntry(event.target.value);
    }

    // Filtrer les catégories en fonction de la saisie
    const filteredCategories = categorie ? categorie.filter((x) =>
        x.title.toLowerCase().includes(entry.toLowerCase())
    ) : [];


    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-5 px-7 py-10"
            >
                <h1 className='dashboard-heading'>{"Ajouter un article"}</h1>

                <FormField
                    control={form.control}
                    name="titre"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} className='h-[60px] !text-2xl border-[#A1A1A1]' placeholder="Titre de l'article" />
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
                {/* <FormField
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
                /> */}

                <FormField
                    control={form.control}
                    name="media"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Image (max 2Mo)"}</FormLabel>
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
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                                {filteredCategories.length > 0 ? (
                                                    filteredCategories.map((x, i) => (
                                                        <SelectItem key={i} value={x.title}>
                                                            {x.title}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <p className="p-2 text-gray-500">{"Aucune catégorie trouvée"}</p>
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
                        onClick={() => {
                            form.handleSubmit(onSubmit)()
                        }}>
                        {"enregistrer"}
                    </Button>
                    {/* <Button
                        variant="default"
                        className="max-w-[384px] w-full font-normal rounded-none"
                        type="button"
                        onClick={() => {
                            form.handleSubmit(onSubmit)()
                        }}>
                        {"Publier"}
                    </Button> */}
                    <DatePubli artId={artId} isOpen={dialogOpen} onOpenChange={setDialogOpen} />
                    <Button
                        type="submit"
                        className="max-w-[384px] w-full rounded-none font-normal"
                        onClick={(e) => {
                            form.handleSubmit(onSubmit1)()
                            e.preventDefault();
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
