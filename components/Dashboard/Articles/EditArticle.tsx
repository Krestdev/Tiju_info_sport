import { Button } from "@/components/ui/button";
import {
    Dialog,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Abonnement } from "@/data/temps";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GrFormClose } from "react-icons/gr";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import LexicalEditor from "./LexicalEditor";
import { LuEye, LuPlus, LuUpload } from "react-icons/lu";
import DatePubli from "./DatePubli";
import { AxiosResponse } from "axios";
import axiosConfig from "@/api/api";
import { Checkbox } from "@/components/ui/checkbox";
import AppLexical from "./LexicalEditor";
import { usePublishedArticles } from "@/hooks/usePublishedData";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formSchema = z.object({
    type: z.string(),
    title: z.string().min(2, {
        message: "Le titre doit contenir plus de 2 caractères.",
    }).max(254, {
        message: "Le titre doit contenir moins de 255 caractères"
    }),
    extrait: z.string().min(2, {
        message: "Le sommaire doit contenir au moins 2 caractères.",
    }).max(299, {
        message: "Le sommaire doit contenir moins de 300 caractères"
    }),
    description: z.string().min(2, {
        message: "La description doit contenir au moins 2 caractères.",
    }),
    media: z.any(),
    headline: z.boolean(),
});


type Props = {
    children: ReactNode;
    donnee: Article;
    nom: string | undefined
};

function EditArticle({ children, donnee }: Props) {

    const { token, currentUser } = useStore()
    const [dialogO, setDialogO] = React.useState(false);
    const [photo, setPhoto] = useState<ImageA>(donnee.images[0]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [entry, setEntry] = useState<string>("")
    const [show, setShow] = useState(false);
    const [dialogOpenE, setDialogOpenE] = useState(false)
    const queryClient = useQueryClient();
    const [fich, setFich] = useState<File[] | undefined>()
    const [artMod, setArtMod] = useState<any>()
    // const editorRef = useRef<LexicalEditorRef>(null);

    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });

    const axiosClient1 = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Accept": "*/*",
        "x-api-key": "abc123",
        'Content-Type': 'multipart/form-data'
    });

    const { categories } = usePublishedArticles()

    const filteredCategories = (categories || []).filter((x) =>
        x.title.toLowerCase().includes(entry.toLowerCase())
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEntry(e.target.value)
    }

    const updateImage = useMutation({
        mutationKey: ["pictures"],
        mutationFn: ({ data, id }: { data: any, id: number }) => {
            return axiosClient1.post(`/image/${donnee.images[0].id}`,
                {
                    file: data,
                    article_id: id
                }
            )
        },
        onSuccess() {
            editArticle.mutate()
            queryClient.invalidateQueries({ queryKey: ["pictures"] });
        },
    })

    const updateImage1 = useMutation({
        mutationKey: ["pictures"],
        mutationFn: ({ data, id }: { data: any, id: number }) => {
            return axiosClient1.post(`/image/${donnee.images[0].id}`,
                {
                    file: data,
                    article_id: id
                }
            )
        },
        onSuccess() {
            setDialogOpenE(true)
            queryClient.invalidateQueries({ queryKey: ["pictures"] });
        },
    })

    React.useEffect(() => {
        if (updateImage.isSuccess) {
            console.log(updateImage);
        } else if (updateImage.isError) {
            console.log(updateImage.error)
        }
    }, [updateImage.isError, updateImage.isSuccess, updateImage.error])


    const editArticle = useMutation({
        mutationKey: ["articles"],
        mutationFn: () => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/articles/${donnee.id}`, {
                user_id: idU,
                title: artMod?.title.trim(),
                summary: artMod?.extrait.trim(),
                description: artMod?.description.trim(),
                type: categories.find(x => x.id)?.title,
                headline: artMod?.headline,
                status: "draft",
                catid: artMod?.type
            });
        },
        onSuccess() {
            setDialogOpenE(false)
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
        retry: 5,
        retryDelay: 5000,
    });

    const editArticle1 = useMutation({
        mutationKey: ["articles"],
        mutationFn: () => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/articles/${donnee.id}`, {
                user_id: idU,
                title: artMod?.title.trim(),
                summary: artMod?.summery.trim(),
                description: artMod?.description.trim(),
                type: categories.find(x => x.id)?.title,
                catid: artMod?.type,
                headline: artMod?.headline,
                status: "draft"
            });
        },
        onSuccess() {
            setDialogOpenE(true)
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
        retry: 5,
        retryDelay: 5000,
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        
        setFich(data.media)
        setArtMod(data)
        fich === undefined ? editArticle.mutate() :
            updateImage.mutate({ data: fich[0], id: donnee.id })
    }

    function onSubmit1(data: z.infer<typeof formSchema>) {
        console.log("submit");

        console.log(data);
        
        
        setArtMod(data)
        setFich(data.media)
        fich === undefined ? editArticle1.mutate() :
            updateImage1.mutate({ data: fich[0], id: donnee.id })
    }

    React.useEffect(() => {
        if (editArticle.isSuccess) {
            toast.success("Modifiée avec succès");
            setDialogO(false);
            form.reset();
        } else if (editArticle.isError) {
            toast.error("Erreur lors de la modification de l'article");
            console.log(editArticle.error)
        }
    }, [editArticle.isError, editArticle.isSuccess, editArticle.error])

    React.useEffect(() => {
        if (editArticle1.isSuccess) {
            toast.success("Modifiée avec succès");
            setDialogO(false);
            form.reset();
        } else if (editArticle1.isError) {
            toast.error("Erreur lors de la modification de l'article");
            console.log(editArticle1.error)
        }
    }, [editArticle1.isError, editArticle1.isSuccess, editArticle1.error])

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: donnee.title.trim(),
            type: categories.find((x) => x.id === donnee.catid)?.id.toString(),
            extrait: donnee.summery.trim(),
            description: donnee.description.trim(),
            headline: donnee.headline,
        },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [inputKey, setInputKey] = useState(0);

    return (
        <Dialog open={dialogO} onOpenChange={setDialogO}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-screen md:w-[95vh] h-screen md:h-[95vh] max-w-none p-6 scrollbar">
                <DialogHeader>
                    <DialogTitle>{"Modifier un Article"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour modifier une Publicité"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 px-7 py-10"
                    >
                        <h1 className='uppercase text-[40px]'>{"Modifier un article"}</h1>
                        <FormField
                            control={form.control}
                            name="title"
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
                                    <FormLabel>{"Description"}</FormLabel>
                                    <FormControl>
                                        {/* <AppLexical
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={"Description de l'article"} /> */}
                                        <AppLexical
                                            initialValue={field.value}
                                            onChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        />

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
                        {/* <div className="flex flex-row items-end gap-2">
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
                                                            // setPhoto(reader.result as string);
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
                        </div> */}

                        <div className="flex flex-row items-end gap-2">
                            <FormField
                                control={form.control}
                                name="media"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Ajouter des images"}</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-2">
                                                <div className='relative w-fit h-fit'>
                                                    {
                                                        selectedFiles.length <= 0 ? photo && <img src={`https://tiju.krestdev.com/api/image/${photo.id}`} alt="" className="size-32 object-cover" />
                                                            :
                                                            selectedFiles[0] instanceof File && (
                                                                <img
                                                                    src={URL.createObjectURL(selectedFiles[0])}
                                                                    alt="Aperçu"
                                                                    className="size-32 object-cover rounded"
                                                                />
                                                            )}
                                                    {selectedFiles.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedFiles([]);
                                                                field.onChange([]);
                                                            }}
                                                            className="mt-2 p-2 w-fit bg-red-500 text-white rounded-full hover:bg-red-600 absolute -top-6 -right-5"
                                                        >
                                                            <IoMdClose />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className='max-w-[384px] w-full h-[60px] flex gap-4 items-center justify-center'>
                                                    <div className="relative w-[384px] h-[60px] border flex items-center pl-2">
                                                        {selectedFiles.length <= 0 ?
                                                            <div className='h-10 flex gap-2 px-3 py-2 border border-[#A1A1A1] items-center'>
                                                                <LuUpload />
                                                                {"Selectionner votre image"}
                                                            </div> :
                                                            <p>{selectedFiles[0].name}</p>}
                                                        <Input
                                                            key={inputKey}
                                                            id="fileInput"
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            ref={fileInputRef}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                if (e.target.files) {
                                                                    const newFiles = Array.from(e.target.files);
                                                                    const updatedFiles = [...selectedFiles, ...newFiles];
                                                                    setFich(updatedFiles);
                                                                    setSelectedFiles(updatedFiles);
                                                                    field.onChange(updatedFiles);
                                                                }
                                                            }}
                                                            className='absolute top-0 left-0 cursor-pointer w-full h-[60px] opacity-0'
                                                        />
                                                    </div>
                                                    {/* <label
                                                        htmlFor="fileInput"
                                                        className="cursor-pointer flex items-center gap-2 border p-2 rounded-full bg-gray-50 text-black"
                                                    >
                                                        <IoMdAdd />
                                                    </label> */}
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
                        </div>

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
                                                        {filteredCategories.length > 0 ? (
                                                            filteredCategories.map((x, i) => {
                                                                return (

                                                                    <SelectItem key={i} value={x.id.toString()}>
                                                                        {x.title}
                                                                    </SelectItem>
                                                                )
                                                            })) : (
                                                            <p className="p-2 text-gray-500">{"Aucune catégorie trouvée"}</p>
                                                        )}
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="headline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className='flex items-center gap-2'>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <p>{"Ajouter a la une"}</p>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className='w-full flex flex-col gap-2'>
                            <Button
                                variant="outline"
                                className="max-w-[384px] w-full font-normal rounded-none"
                                type="button"
                                onClick={() => {
                                    form.handleSubmit(onSubmit)()
                                }}
                                isLoading={updateImage.isPending}
                            >
                                {updateImage.isPending ? "Chargement..." : "Enregistrer au brouillon"}
                            </Button>
                            <DatePubli artId={donnee.id} isOpen={dialogOpenE} onOpenChange={setDialogOpenE} article={donnee} formId={`form-article-${donnee.id}`} />
                            <Button
                                type="button"
                                className="max-w-[384px] w-full rounded-none font-normal"
                                onClick={() => {
                                    form.handleSubmit(onSubmit1)()
                                }}
                                isLoading={updateImage1.isPending || editArticle1.isPending}
                            >
                                {updateImage1.isPending || editArticle1.isPending ? "Chargement..." : "Publier"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}

export default EditArticle;
