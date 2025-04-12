'use client'
import axiosConfig from '@/api/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import useStore from '@/context/store';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const formSchema = z.object({
    user_id: z.string(),
    file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: "La taille maximale est de 1MB"
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Seuls .jpg, .png et .webp sont acceptés"
    })
})

function EditPhoto() {
    const [open, setOpen] = React.useState<boolean>(false);
    const [preview, setPreview] = React.useState<string | null>(null)
    const { activeUser } = useStore();
    const axiosClient = axiosConfig();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user_id: activeUser?.id.toString(),
            file: undefined
        }
    });

    const updateImage = useMutation({
        mutationKey: ["update-photo", "user-profile"],
        mutationFn: (data: z.infer<typeof formSchema>)=>{
            const formData = new FormData()
            formData.append('user_id', data.user_id)
            formData.append('file', data.file)
            const imageRoute= activeUser?.image?.id ? `image/${activeUser.image.id}` : 'image'
            return axiosClient.post(imageRoute, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                  }
            });
        },
        onSuccess: ()=>{
            setOpen(false);
            toast({
                variant: "success",
                title: "Mise à jour réussie !",
                description: "Votre photo de profil a bien été mise à jour."
            })
        },
        onError: ()=>{
            toast({
                variant: "destructive",
                title:"Erreur",
                description: "Nous avons rencontré un problème lors de la modification de votre photo de profil. Contactez notre support pour plus d'informations."
            })
        }
    });
    const onSubmit=(data:z.infer<typeof formSchema>)=>{
        updateImage.mutate(data);
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
      React.useEffect(()=>{
        if(!open){
            form.reset();
            setPreview(null);
        }
    },[open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <div id='photo' className="flex flex-col gap-2">
              <Label className='w-fit'>{"Photo"}</Label>
              <div className='flex h-10 w-full bg-transparent px-3 border border-input border-dashed text-base justify-between items-center gap-3'> {/**Add the logic for the user photo update here */}
                <span className='inline-flex gap-3 items-center text-sm font-medium text-primary'><img src={activeUser?.image?.id ? `${process.env.NEXT_PUBLIC_API}image/${activeUser.image.id}` : "/images/default-photo.webp"} className='size-8 rounded-full object-cover' />
                {activeUser?.image?.id ? "Modifier" : "Télécharger une photo"}
                </span>
              </div>
            </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='text-2xl uppercase'>{"Modifiez votre photo"}</DialogTitle>
                <DialogDescription>{"Completez le formulaire suivant pour modifier votre photo de profil."}</DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-5'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-5'>
                        <FormField control={form.control} name="file" render={({field})=>(
                            <FormItem>
                                <FormLabel>{"Ajouter une photo"}</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                                </FormControl>
                            </FormItem>
                        )} />
                {preview && (
              <div className="flex justify-center">
                <img 
                  src={preview} 
                  alt="Prévisualisation" 
                  className="h-32 w-32 rounded-full object-cover"
                />
              </div>
            )}
            <div className='flex items-center justify-center gap-3 flex-wrap'>
                <Button type="submit" isLoading={updateImage.isPending} disabled={updateImage.isPending}>{"Enregistrer"}</Button>
            </div>
                    </form>
                </Form>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default EditPhoto