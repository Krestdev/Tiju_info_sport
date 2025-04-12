'use client'
import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useStore from '@/context/store'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import EditPassword from './edit-password'
import { Label } from '@/components/ui/label'
import EditPhoto from './edit-photo'

interface Props {
  user: User;
}

const formSchema = z.object({
    name: z.string().min(4,{message: "Votre nom doit contenir au moins 4 caractères"}),
    country: z.string().optional(),
    town: z.string().optional(),
    sex: z.string().optional(),
    phone: z.string().optional(),
  })

function UpdateUser({user}:Props) {
    const axiosClient = axiosConfig();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name: user.name,
            country: user.country==="default" ? undefined : user.country,
            town: user.town==="default" ? undefined : user.town,
            sex: user.sex==="default" ? undefined : user.sex,
            phone: user.phone==="default" || user.phone==="null" ? undefined : user.phone,
        }
    });
    
    const patchUser = useMutation({
        mutationKey: ["update-user", "user-profile"],
        mutationFn: (data:z.infer<typeof formSchema>)=>{
            return axiosClient.patch<User>(`users/${user.id}`,
              {
                name: data.name,
                country:data.country ?? "default",
                town:data.town ?? "default",
                sex:data.sex ?? "default",
                phone: data.phone?? "default"

              }
            )
        },
        onSuccess: ()=>{
          toast({
            variant: "success",
            title: "Profil mis à jour avec succès !",
            description: "Vos informations ont été mises à jour avec succès. Vous pouvez les consulter sur votre profil."
          })
        },
        onError: (error)=>{
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Nous avons rencontré une erreur dans l'exécution de votre requête."
          })
        }
    });
    const onSubmit=(data:z.infer<typeof formSchema>)=>{
      patchUser.mutate(data);
    }
  return (
    <div className='flex flex-col gap-4'>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              <div id='email' className="flex flex-col gap-2">
                <Label htmlFor='email'>{"Adresse mail"}</Label>
                  <Input name="email" value={user.email} disabled/>
              </div>
              <div id='pseudo' className="flex flex-col gap-2">
                <Label htmlFor='pseudo'>{"Pseudonyme"}</Label>
                  <Input name="pseudo" value={user.nick_name ?? user.name ?? ""} disabled/>
              </div>
            {/**Edit password logic imported here ! */}
            <EditPassword/>
            <EditPhoto/>
          </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5'>
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
                      <SelectItem value='tchad'>{"Tchad"}</SelectItem>
                      <SelectItem value='cote-d-ivoire'>{"Côte d'Ivoire"}</SelectItem>
                      <SelectItem value='senegal'>{"Sénégal"}</SelectItem>
                      <SelectItem value='france'>{"France"}</SelectItem>
                      <SelectItem value='gabon'>{"Gabon"}</SelectItem>
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
              <Button type="submit" isLoading={patchUser.isPending} disabled={patchUser.isPending}>{"Enregistrer"}</Button>
            </span>
        </form>
      </Form>
    </div>
  )
}

export default UpdateUser