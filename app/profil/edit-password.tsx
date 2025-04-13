'use client'
import axiosConfig from '@/api/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useStore from '@/context/store';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
});

function EditPassword() {
    const [open, setOpen] = React.useState(false);
    const {activeUser} = useStore();
    const axiosClient = axiosConfig();
    //Let's change the open state here
    const toogleDialog = () =>{
        setOpen(!open);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          password: "",
          confirmPassword: ""
        },
      });

      const updatePassword = useMutation({
        mutationKey: ["update-user"],
        mutationFn: (data:z.infer<typeof formSchema>)=>{
            return axiosClient.patch(`users/${activeUser?.id}`, {password:data.password})
        },
        onSuccess: ()=>{
            setOpen(false);
            form.reset();
            toast({
                variant: "success",
                title: "Opération réussie !",
                description: "Votre mot de passe a été mis à jour avec succès"
            });
        },
        onError: (error)=>{
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur a été rencontré lors de la mise à jour de votre mot de passe. Contactez le support pour plus d'informations."
            })
        }
      });

      const onSubmit=(data:z.infer<typeof formSchema>)=>{
        updatePassword.mutate(data);
      }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <div id='password' className="flex flex-col gap-2">
              <Label className='w-fit'>{"Mot de passe"}</Label>
              <div className='flex h-10 w-full border border-input bg-transparent px-3 py-1 text-base justify-between items-center gap-3'>
                <span>{"•••••••••••"}</span>
                <span className='text-primary hover:text-primary-hover' onClick={toogleDialog}>{"Modifier"}</span>
              </div>
            </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='text-2xl uppercase'>{"modifier son mot de passe"}</DialogTitle>
                <DialogDescription>{"Complétez le formulaire pour modifier votre mot de passe"}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='mx-auto w-full max-w-64 space-y-5'>
                    <FormField control={form.control} name="password" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Mot de passe"}</FormLabel>
                            <FormControl>
                                <Input {...field} type="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="confirmPassword" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Confirmer le mot de passe"}</FormLabel>
                            <FormControl>
                                <Input {...field} type="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <Button type="submit" isLoading={updatePassword.isPending} disabled={updatePassword.isPending} className='w-full'>{"Modifier"}</Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default EditPassword