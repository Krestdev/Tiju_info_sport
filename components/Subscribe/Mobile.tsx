import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import useStore from '@/context/store';
import { abonnement, Abonnement } from '@/data/temps';
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
    phone: z
        .string()
        .regex(/^6(5[0-9]|7[0-9]|8[0-9]|9[0-9])\d{6}$/, "Numéro de téléphone invalide")
});

interface Props {
    setActive: React.Dispatch<React.SetStateAction<number>>
    abonId: number
}

const Mobile = ({ abonId, setActive }: Props) => {

    const { dataSubscription, editUser, currentUser } = useStore()
    const [operator, setOperator] = useState<string | null>(null);
    const [subs, setSubs] = useState<Abonnement>()

    const subsData = useQuery({
        queryKey: ["abonnement"],
        queryFn: async () => dataSubscription
    })

    useEffect(() => {
        if (subsData.isSuccess) {
            setSubs(subsData.data?.find(x => x.id === abonId))
        }
    }, [subsData.data])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values, subs);
            editUser({
                ...currentUser,
                abonnement: subs
            });
            setActive(3)
        } catch (error: any) {
            console.error("Une erreur est survenue");
        }
    }

    function detectOperator(number: string) {
        const mtnRegex = /^6(5[0-4]|7\d|8[0-4])\d{6}$/;
        const orangeRegex = /^6(5[5-9]|9\d|8[5-9])\d{6}$/;

        if (mtnRegex.test(number)) {
            return "MTN";
        } else if (orangeRegex.test(number)) {
            return "Orange";
        } else {
            return null;
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = event.target.value;
        form.setValue("phone", number);
        setOperator(detectOperator(number));
    };



    return (
        <div className='containerBloc max-w-lg'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <h3 className='text-[#012BAE]'>{`Offre: ${subs?.nom} ${subs?.cout} FCFA`}</h3>
                                    <h3>{"Entrez votre numéro de téléphone"}</h3>
                                </FormLabel>
                                <FormControl>
                                    <div className='flex flex-row items-center justify-center gap-3'>
                                        <Input
                                            placeholder="Numéro de téléphone"
                                            {...field}
                                            className="w-full rounded-none"
                                            onChange={handleChange}
                                        />
                                        {operator === "MTN" && <img src="/images/MoMo.jpg" className='size-[50px] object-cover' alt="MTN" />}
                                        {operator === "Orange" && <img src="/images/OM.jpg" className='size-[50px] object-cover' alt="Orange" />}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-fit'>{"Payer"}</Button>
                </form>
            </Form>
        </div>
    );
};

export default Mobile;
