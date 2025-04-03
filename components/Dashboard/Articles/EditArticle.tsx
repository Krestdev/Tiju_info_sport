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
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Abonnement } from "@/data/temps";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GrFormClose } from "react-icons/gr";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import LexicalEditor from "./LexicalEditor";
import { LuEye, LuPlus } from "react-icons/lu";
import DatePubli from "./DatePubli";
import Sharing from "./Sharing";
import { AxiosResponse } from "axios";
import axiosConfig from "@/api/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formSchema = z.object({
    // nom: z.string().min(4, {
    //     message: "Name must be at least 4 characters.",
    // }),
    type: z.string(),
    title: z.string().min(4, {
        message: "Name must be at least 10 characters.",
    }),
    extrait: z.string().min(4, {
        message: "Name must be at least 10 characters.",
    }),
    description: z.string().min(4, {
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
});


type Props = {
    children: ReactNode;
    donnee: Article;
    nom: string | undefined
};

function EditArticle({ children, donnee }: Props) {

    const { dataSubscription, token, currentUser } = useStore()
    const [dialogO, setDialogO] = React.useState(false);
    const [abon, setAbon] = useState<Abonnement[]>();
    const [images, setImages] = useState<ImageA[]>(donnee.images);
    const [photo, setPhoto] = useState<ImageA>(donnee.images[0]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [entry, setEntry] = useState<string>("")
    const [show, setShow] = useState(false);
    const [cate, setCate] = useState<Category[]>()
    const [dialogOpen, setDialogOpen] = useState(false)
    const queryClient = useQueryClient();
    const [fichier, setFichier] = useState(null)

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

    const decodeHtml = (html: string) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };


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
            setCate(articleCate.data.data)
        }
    }, [articleCate.data])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEntry(e.target.value)
    }

    const updateImage = useMutation({
        mutationKey: ["articles"],
        mutationFn: ({ data, id }: { data: any, id: number }) => {
            console.log(data);
            
            return axiosClient1.post(`/image/${donnee.images[0].id}`,
                {
                    file: data,
                    article_id: id
                }
            )
        },
        onSuccess(data) {
            editArticle.mutate({
                data: {
                    title: donnee.title,
                    type: donnee.type,
                    extrait: donnee.summery,
                    description: donnee.description,
                }, dataI: data
            })
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
        mutationFn: ({ data, dataI }: { data: z.infer<typeof formSchema>, dataI: any },) => {
            const idU = String(currentUser.id)
            return axiosClient.patch(`/articles/${dataI.id}`, {
                user_id: idU,
                title: data.title,
                summary: data.extrait,
                description: decodeHtml(data.description),
                type: data.type,
            });
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        setFichier(data.media)
        fichier && updateImage.mutate({ data: fichier[0], id: donnee.id });
    }

    React.useEffect(() => {
        if (editArticle.isSuccess) {
            toast.success("Modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            setDialogO(false);
            form.reset();
        } else if (editArticle.isError) {
            toast.error("Erreur lors de la modification de la catégorie");
            console.log(editArticle.error)
        }
    }, [editArticle.isError, editArticle.isSuccess, editArticle.error])

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: donnee.title,
            type: donnee.type,
            extrait: donnee.summery,
            description: donnee.description,
            couverture: donnee.images[0],
            media: donnee.images,
        },
    });

    const handleOpen = () => {
        if (formSchema.safeParse(form.getValues()).success) {
            setDialogOpen(true);
        } else {
            toast.error("Veuillez remplir correctement le formulaire.");
        }
    };

    return (
        <Dialog open={dialogO} onOpenChange={setDialogO}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-[95vh] h-[95vh] max-w-none p-6 scrollbar">
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
                            render={({ field }) => {
                                // console.log(field.value);

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
                        <div className="flex flex-row items-end gap-2">
                            {
                                photo && <img src={`https://tiju.krestdev.com/api/image/${photo.id}`} alt="" className="w-[60px] h-[60px] object-cover" />
                            }
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
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* {
                                images && images.map((x, i) =>
                                    <img key={i} src={x} alt="" className="w-[150px] h-[150px]" />
                                )
                            } */}
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
                                                        {cate?.map((x, i) => (
                                                            <SelectItem key={i} value={x.title}>
                                                                {x.title}
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
                            <Sharing donnee={donnee} isOpen={dialogOpen} onOpenChange={setDialogOpen} />
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
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
}

export default EditArticle;
