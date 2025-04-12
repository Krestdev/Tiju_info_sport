'use client'
import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    town: z.string(),
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
            country: activeUser?.country==="default" ? undefined : activeUser?.country,
            town: activeUser?.town==="default" ? undefined : activeUser?.town,
            sex: activeUser?.sex==="default" ? undefined : activeUser?.sex,
            phone: activeUser?.phone==="default" ? undefined : activeUser?.phone,
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
              <div className='flex h-10 w-full border border-input bg-transparent px-3 py-1 text-base justify-between items-center gap-3 shadow-sm transition-colors'>
                <span>{"•••••••••••"}</span>
                <Link href={"#"} className='text-primary hover:text-primary-hover'>{"Modifier"}</Link> {/**Add the logic for edit password here, and it should be a modal maybe */}
              </div>
            </div>
            <div id='photo' className="space-y-2">
              <FormLabel>{"Photo"}</FormLabel>
              <Link href={"#"} className='flex h-10 w-full bg-transparent px-3 text-base justify-between items-center gap-3'> {/**Add the logic for the user photo update here */}
                <span className='inline-flex gap-2 items-center'><img src="/images/default-photo.webp" className='size-10 rounded-full object-cover' />{"Télécharger une photo"}</span>
              </Link>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5'>
            <h2 className='col-span-1 sm:col-span-2 uppercase'>{"Informations personnelles"}</h2>
            <FormField control={form.control} name="name" render={({field})=>(
              <FormItem>
                <FormLabel>{"Nom"}</FormLabel>
                <FormControl>
                  <Input {...field}/>
                </FormControl>
              </FormItem>
            )}/>
            <FormField control={form.control} name="country" render={({field})=>(
              <FormItem>
                <FormLabel>{"Pays"}</FormLabel>
                <FormControl>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pays"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='cameroun'>{"Cameroun"}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}/>
            <FormField control={form.control} name="sex" render={({field})=>(
              <FormItem>
                <FormLabel>{"Sexe"}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='m'>{"Homme"}</SelectItem>
                      <SelectItem value='f'>{"Femme"}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}/>
            <FormField control={form.control} name="town" render={({field})=>(
              <FormItem>
                <FormLabel>{"Ville"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='ex. Douala'/>
                </FormControl>
              </FormItem>
            )}/>
            <FormField control={form.control} name="phone" render={({field})=>(
              <FormItem>
                <FormLabel>{"Téléphone"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Numéro de téléphone'/>
                </FormControl>
              </FormItem>
            )}/>
            <span className='col-span-1 sm:col-span-2'>
              <Button type="submit">{"Enregistrer"}</Button>
            </span>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default UpdateUser