'use client'
import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useStore from '@/context/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    email: z.string().email(),
    name: z.string().min(4,{message: "Votre nom doit contenir au moins 4 caractères"}),
    pseudo: z.string().min(4, {
        message: "Votre Pseudonyme doit avoir au moins 4 caractères"
      }),
    country: z.string(),
    city: z.string(),
    sex: z.string(),
    phone: z.string(),
  })

function UpdateUser() {
    const { activeUser } = useStore();
    const axiosClient = axiosConfig();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            email: activeUser?.email,
            name: activeUser?.name,
            pseudo: activeUser?.name,
            country: activeUser?.country,
            city: activeUser?.town,
            sex: activeUser?.sex,
            phone: activeUser?.phone
        }
    });
    
    const patchUser = useMutation({
        mutationKey: ["update-user"],
        mutationFn: (data:z.infer<typeof formSchema>)=>{
            return axiosClient.post<User>(`users/${activeUser?.id}`)
        }
    });
    const onSubmit=(data:z.infer<typeof formSchema>)=>{
      patchUser.mutate(data);
    }
  return (
    <div className='flex flex-col gap-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-10'>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
            <FormField control={form.control} name="email" render={({field})=>(
              <FormItem>
                <FormLabel>{"Adresse mail"}</FormLabel>
                <FormControl>
                  <Input {...field} disabled/>
                </FormControl>
              </FormItem>
            )}/>
            <FormField control={form.control} name="pseudo" render={({field})=>(
              <FormItem>
                <FormLabel>{"Pseudonyme"}</FormLabel>
                <FormControl>
                  <Input {...field} disabled/>
                </FormControl>
              </FormItem>
            )}/>
            <div id='password' className="space-y-2">
              <FormLabel>{"Mot de passe"}</FormLabel>
              <div className='flex h-10 w-full rounded-none border border-input bg-transparent px-3 py-1 text-base justify-between items-center gap-3 shadow-sm transition-colors'>
                <span>{"•••••••••••"}</span>
                <Link href={"#"} className='text-primary hover:text-primary-hover'>{"Modifier"}</Link> {/**Add the logic for edit password here, and it should be a modal maybe */}
              </div>
            </div>
            <div id='password' className="space-y-2">
              <FormLabel>{"Photo"}</FormLabel>
              <div className='flex h-10 w-full rounded-none border border-input bg-transparent px-3 text-base justify-between items-center gap-3 shadow-sm transition-colors'>
                <span className='inline-flex gap-2 items-center'>{"Télécharger une photo"}</span>
              </div>
            </div>
          </div>
        </form>
      </Form>
        <p>{"Pour bientôt, pas d'inquiétude !"}</p>
        <Link href={"/"}><Button>{"Retour vers l'accueil"}<ArrowRight/></Button></Link>
    </div>
  )
}

export default UpdateUser