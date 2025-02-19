
"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const form1Schema = z.object({
    code: z.string()
        .length(6, { message: "Le code doit avoir exactement 6 chiffres." })
        .regex(/^\d{6}$/, { message: "Le code ne doit contenir que des chiffres." }),
});

interface Props {
    setActive: (value: React.SetStateAction<number>) => void
}

const Code = ({ setActive }: Props) => {

    const form1 = useForm<z.infer<typeof form1Schema>>({
        resolver: zodResolver(form1Schema),
        defaultValues: {
            code: "",
        },
    });

    async function onSubmit1(values: z.infer<typeof form1Schema>) {
        try {
            setActive(2)
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    }

    return (
        <div className='pb-10 flex flex-col items-center gap-4'>
            <h3>{"Entrez le code que nous vous avons envoyé par email"}</h3>
            <Form {...form1}>
                <form onSubmit={form1.handleSubmit(onSubmit1)}
                    className="space-y-4 flex flex-col gap-4">
                    <FormField
                        control={form1.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className='flex items-center justify-center gap-2'>
                                <FormLabel>{"Code: "}</FormLabel>
                                <FormControl>
                                    <Input placeholder="Entrez le code" {...field} className="max-w-sm w-full rounded-none" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='max-w-[360px] w-full'>{"Confirmer"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default Code
