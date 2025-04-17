'use client'
import axiosConfig from '@/api/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import useStore from '@/context/store'
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
    id:number; //Article Id
}

const formSchema = z.object({
    message:z.string({message: "Le commentaire ne peut être vide"})
});

function AddComment({id}:Props) {
    const axiosClient = axiosConfig();
    const { activeUser } = useStore();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    function isLoggedIn(){
        if(!activeUser){
            router.push("/connexion");
            toast({
                variant: "warning",
                title: "Connexion requise !",
                description: "Veuillez vous connecter pour commenter un article."
            })
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const postComment = useMutation({
        mutationKey: ["comment"],
        mutationFn: (data:z.infer<typeof formSchema>)=>{
            return axiosClient.post(`comments/${id}`, {
                "user_id": activeUser?.id,
                "message": data.message
            });
        },
        onSuccess: ()=>{
            setOpen(false);
            router.refresh();
            toast({
                title:"Commentaire ajouté !"
            });
        },
        onError: ()=>{
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue pendant l'envoi de votre requête."
            })
        }
    })

    const onSubmit=(data:z.infer<typeof formSchema>)=>{
        postComment.mutate(data);
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button onClick={isLoggedIn} variant={"outline"}>{"commenter"}</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='text-2xl uppercase'>{"Ajouter un commentaire"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                    <FormField control={form.control} name="message" render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <Textarea {...field} placeholder='Votre commentaire...' maxLength={250}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button type="submit" isLoading={postComment.isPending} disabled={postComment.isPending}>{"Envoyer"}</Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default AddComment