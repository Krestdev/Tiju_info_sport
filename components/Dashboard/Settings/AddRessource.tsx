import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useStore from '@/context/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    title: z.string(),
    content: z.string(),
    url: z.string()
})

interface Props {
    title: string,
    content: string,
    url: string,
    action: (data: Ressource) => void,
    children: React.ReactNode
    message: string,
}

const AddRessource = ({ title, content, url, children, action, message }: Props) => {

    const [dialogO, setDialogO] = React.useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title,
            content: content,
            url: url
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        action(data)
        setDialogO(false)
    }

    return (
        <Dialog open={dialogO} onOpenChange={setDialogO}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md p-6 scrollbar">
                <DialogHeader>
                    <DialogTitle className='capitalize'>{message}</DialogTitle>
                    <DialogDescription>
                        {`Remplissez le formulaire pour ${message}`}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='flex flex-col gap-5' >
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Titre de la ressource"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='max-w-[384px] text-[24px]' placeholder='ex. Politique de confidentialité' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='url'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"lien vers la ressource"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='max-w-[384px] text-[24px]' placeholder='ex. https://exemple-de-chemin' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Contenu de la ressource"}</FormLabel>
                                    <FormControl>
                                        <Textarea rows={10} {...field} className='max-w-[384px] text-[24px]' placeholder='Contenu de la ressource' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-row gap-2'>
                            <Button type='button' onClick={form.handleSubmit(onSubmit)} className='w-fit capitalize'>{message}</Button>
                            <Button type='button' onClick={() => { form.reset(), setDialogO(false) }} className='w-fit' variant={"outline"}>{"Annuler"}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddRessource
