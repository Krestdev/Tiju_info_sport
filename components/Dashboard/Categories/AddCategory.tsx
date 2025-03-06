"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useStore from '@/context/store'
import { Categories } from '@/data/temps'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { ControllerFieldState, ControllerRenderProps, FieldValues, useForm, UseFormStateReturn } from 'react-hook-form'
import { string, z } from 'zod'

const formSchema = z.object({
    nom: z.string().min(3, { message: "Le nom doit avoir au moins 3 caractères" }),
    description: z.string().min(10, { message: "La description doit avoir au moins 10 caractères" }),
    parent: z.string().optional()
})
const AddCategory = () => {

    const { dataCategorie, addCategory } = useStore();
    const [parent, setParent] = useState<Categories[]>();

    const cateData = useQuery({
        queryKey: ["category"],
        queryFn: async () => dataCategorie
    });

    useEffect(() => {
        if (cateData.isSuccess) {
            setParent(cateData.data.filter(x => !x.parent))
        }
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            description: ""
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);

        if (values.parent === undefined) {
            addCategory({
                nom: values.nom,
                donnees: []
            });   
        }else{
             
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 px-7 py-10'>
                <h1 className='uppercase text-[40px]'>{"Ajouter une catégorie"}</h1>
                <FormField
                    control={form.control}
                    name='nom'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} className='h-[60px] max-w-[384px] text-[24px]' placeholder='Titre de la catégorie' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Description de la catégorie"}</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='Entrez une description' className='h-[60px] max-w-[384px]' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="parent"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Catégorie parent"}</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                                    value={field.value ?? "none"}
                                >
                                    <SelectTrigger className="border border-[#A1A1A1] max-w-[384px] w-full h-[40px] flex items-center p-2 rounded-none">
                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent className="border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2">
                                        <SelectItem value="none">{"Sélectionner une catégorie"}</SelectItem>
                                        {parent?.map((x, i) => (
                                            <SelectItem key={i} value={x.nom}>
                                                {x.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button onClick={() => console.log(form.getValues())}  type="submit" className='rounded-none max-w-[384px] w-full'>{"Ajouter"}</Button>

            </form>

        </Form>
    )
}

export default AddCategory
