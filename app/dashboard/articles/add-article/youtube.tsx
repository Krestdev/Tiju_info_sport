'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { FaYoutube } from 'react-icons/fa';
import { z } from 'zod';

interface Props {
    addVideo: (url:string)=>void;
}

const formSchema = z.object({
    url: z.string().url("Veuillez entrer une URL valide").regex(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/, "Veuillez entrer une URL valide")
})

function AddYoutubeVideo({addVideo}:Props) {
    const [open, setOpen] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        addVideo(data.url);
        setOpen(false);
    }




  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button size={"icon"} variant={"ghost"} onClick={(e)=>{e.preventDefault(); setOpen(true)}}><FaYoutube/></Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='text-2xl uppercase'>{"Ajouter une video Youtube"}</DialogTitle>
                <DialogDescription>{"Veuillez entrer l'URL de la vidéo à insérer"}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <Input type="text" placeholder='https://www.youtube.com/watch?v=...' {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-full'>{"Ajouter la vidéo"}</Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default AddYoutubeVideo