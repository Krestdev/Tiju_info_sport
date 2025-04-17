import { usePublishedArticles } from '@/hooks/usePublishedData';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    items: z.array(z.number()),
});

const formSchema1 = z.object({
    items: z.array(z.number()),
});

const Config = () => {

    const { mainCategories, childCategories } = usePublishedArticles()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            items: [],
        },
    })

    const form1 = useForm<z.infer<typeof formSchema1>>({
        resolver: zodResolver(formSchema1),
        defaultValues: {
            items: [],
        },
    })

    return (
        <div>

        </div>
    )
}

export default Config
