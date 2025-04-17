'use client'
import axiosConfig from '@/api/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import useStore from '@/context/store';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
    commentId:number;
    articleId:number;
    children:React.ReactNode;
    message?:string;
}
const formSchema = z.object({
    message:z.string({message: "Le commentaire ne peut être vide"})
});

function RespondOrEditComment({commentId, articleId, children, message}:Props) {
    const { activeUser } = useStore();
    const axiosClient = axiosConfig();
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    
    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                message: message
            }
        });

    const onSubmit = (data:z.infer<typeof formSchema>)=>{
        postComment.mutate(data);
    }
    const postComment = useMutation({
        mutationFn: (data:z.infer<typeof formSchema>)=>{
            if(!message){
                return axiosClient.post(`comments/${articleId}/${commentId}`, {
                    "user_id": activeUser?.id,
                    message: data.message
                })
            } else {
                return axiosClient.patch(`comments/${commentId}`, data);
            }
        },
        onError: ()=>{
            toast({
                variant: "warning",
                title: "Erreur",
                description: "Une erreur a été rencontré lors de l'envoi de votre commentaire."
            })
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["categories"]});
            setOpen(false);
            toast({
                title: !message ? "Commentaire ajouté !" : "Commentaire modifié"
            });
            router.refresh();
        }
    })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='text-2xl uppercase'>
                    {!message ? "Répondre au commentaire" : "Modifier son commentaire"}
                </DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                    <FormField control={form.control} name="message" render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <Textarea {...field} placeholder='Votre commentaire...'/>
                            </FormControl>
                        </FormItem>
                    )} />
                    <Button type="submit" isLoading={postComment.isPending} disabled={postComment.isPending}>{"Envoyer"}</Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default RespondOrEditComment