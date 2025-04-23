'use client'
import axiosConfig from '@/api/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface Props {
    image: string | undefined;
    onChange: (image: string) => void;
    alt?: string;
    idImage: number
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const formSchema = z.object({
    file: z.instanceof(File, { message: "Veuillez importer une image" })
        .refine(file => file.size <= MAX_FILE_SIZE, {
            message: "La taille maximale est de 2MB"
        })
        .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Seuls .jpg, .png et .webp sont acceptés"
        })
})

function AddImageEdit({ image, onChange, alt, idImage }: Props) {
    const [open, setOpen] = React.useState(false);
    const axiosClient = axiosConfig();
    const [preview, setPreview] = React.useState<string | undefined>(image);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const uploadImage = useMutation({
        mutationFn: (data: z.infer<typeof formSchema>) => {
            return axiosClient.post<string>(`image/url`, {
                file: data.file
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        },
        onSuccess: (response) => {
            toast({
                title: "Image enregistrée",
                description: "Votre image a été importée avec succès !"
            });
            onChange(response.data);
            setOpen(false);
        },
        onError: (error) => {
            console.log(error);
            toast({
                variant: "warning",
                title: "Erreur",
                description: "Nous avons rencontré un problème lors de l'enregistrement de votre image"
            })
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        uploadImage.mutate(data);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Prévisualisation
        const reader = new FileReader()
        reader.onload = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Définir la valeur du formulaire
        form.setValue("file", file)
    };

    //Let's make sure the form is clean when we open
    React.useEffect(() => {
        if (!open) {
            form.reset();
            setPreview(undefined);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    image ?
                        <div className='relative max-w-sm'>
                            <img src={`${process.env.NEXT_PUBLIC_API?.substring(0, process.env.NEXT_PUBLIC_API?.length - 4)}${image.substring(1)}`} alt={alt ?? "image"} className='w-full h-[160px] object-cover' />
                            <Button family={"sans"} variant={"ghost"} className='absolute left-1/2 bottom-2 -translate-x-1/2 z-10 bg-white'>{"Remplacer l'image"}</Button>
                        </div>
                        : idImage ?
                            <div className='relative max-w-sm'>
                                <img src={`${process.env.NEXT_PUBLIC_API}image/${idImage}`} alt={alt ?? "image"} className='w-full h-[160px] object-cover' />
                                <Button family={"sans"} variant={"ghost"} className='absolute left-1/2 bottom-2 -translate-x-1/2 z-10 bg-white'>{"Remplacer l'image"}</Button>
                            </div>
                            :
                            <button className='flex flex-col gap-2 items-center justify-center max-w-sm border border-dashed border-primary/20 bg-gray-50 py-10 px-7'>
                                <Upload size={40} className='text-paragraph' />
                                <p>{"Ajouter une image"}</p>
                                <span className='text-sm text-gray-400'>{"Taille maximale 2 Mo"}</span>
                            </button>
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl uppercase">{"Ajouter une photo de couverture"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit(onSubmit)(e)
                    }}
                        className="min-h-40 justify-end flex flex-col gap-3">
                        {preview && (
                            <div className="flex justify-center">
                                <img
                                    src={preview}
                                    alt="Prévisualisation"
                                    className="h-32 w-full object-cover"
                                />
                            </div>
                        )}
                        <FormField control={form.control} name="file" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" family={"sans"} isLoading={uploadImage.isPending} disabled={uploadImage.isPending}>{"Insérer l'image"}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddImageEdit