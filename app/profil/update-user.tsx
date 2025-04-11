'use client'
import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import useStore from '@/context/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
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
    })
  return (
    <div className='flex flex-col gap-4'>
        <p>{"Pour bientôt, pas d'inquiétude !"}</p>
        <Link href={"/"}><Button>{"Retour vers l'accueil"}<ArrowRight/></Button></Link>
    </div>
  )
}

export default UpdateUser