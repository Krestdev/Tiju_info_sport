import { Categorie, Pubs, Users } from '@/data/temps';
import React, { useState } from 'react';
import Similaire from '../DetailArticle/Similaire';
import PubsComp from '../PubsComp';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import useStore from '@/context/store';
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BiRadioCircleMarked } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import FullScreen from '../Dashboard/FullScreen';

const formSchema1 = z.object({
    email: z.string(),
    pseudo: z.string(),
    password: z
        .string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
        .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
        .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." }),
    photo: z.any(),
});

const formSchema = z.object({
    nom: z.string().min(4, { message: "Le nom doit contenir au moins 4 caractères." }),
    sexe: z.string(),
    ville: z.string(),
    pays: z.string(),
    phone: z
        .string()
        .regex(/^\d{9}$/, { message: "Le numéro de téléphone doit contenir exactement 9 chiffres." }),
});

interface Props {
    currentUser: Users | null;
    category: Categorie[] | undefined;
    pub: Pubs[] | undefined;
}

const ProfilForm = ({ currentUser, category, pub }: Props) => {
    const { settings, editUser, logout } = useStore();
    const queryClient = useQueryClient();
    const [photo, setPhoto] = useState(currentUser?.photo || settings.noPhoto)
    const sexe = ["Homme", "Femme"]
    const router = useRouter();

    const sec1 = category?.flatMap((x) => x.donnees).filter((x) => x)[0];
    const sim1 = category && category[0];

    const form1 = useForm<z.infer<typeof formSchema1>>({
        resolver: zodResolver(formSchema1),
        defaultValues: {
            photo: currentUser?.photo || null,
            password: currentUser?.password || '',
            email: currentUser?.email,
            pseudo: currentUser?.pseudo,
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: currentUser?.nom,
            sexe: currentUser?.sexe,
            ville: currentUser?.ville,
            pays: currentUser?.pays,
            phone: currentUser?.phone
        }
    })

    function onSubmit1(values: z.infer<typeof formSchema1>) {
        editUser({
            ...currentUser,
            photo: values.photo,
            password: values.password,
            email: values.email,
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
    }

    function onSubmit2(values: z.infer<typeof formSchema>) {
        editUser({
            ...currentUser,
            nom: values.nom,
            sexe: values.sexe,
            ville: values.ville,
            pays: values.pays,
            phone: values.phone,
        });
        console.log("Updated");

        queryClient.invalidateQueries({ queryKey: ['users'] });
    }

    const handleLogout = () => {
        logout();
        router.push("/logIn");
    };

    return (
        <div className="max-w-[1280px] w-full flex flex-col md:flex-row gap-7">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-8">
                    <h1>{"Mon Compte"}</h1>
                    <Form {...form1}>
                        <form
                            onSubmit={form1.handleSubmit(onSubmit1)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-[836px]"
                        >
                            {/* Champ email */}
                            <FormField
                                control={form1.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Email"}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="w-full max-w-lg rounded-none"
                                                placeholder="email@exemple.com"
                                                disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Champ photo */}
                            <FormField
                                control={form1.control}
                                name="photo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center gap-3 px-5">
                                                <FullScreen image={photo}>
                                                    <img
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        src={photo}
                                                        alt="Aperçu de la photo"
                                                    />
                                                </FullScreen>
                                                <Input
                                                    type="file"
                                                    className="shadow-none border-0"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = () => {
                                                                setPhoto(reader.result as string);
                                                                field.onChange(reader.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Champ pseudo */}
                            <FormField
                                control={form1.control}
                                name="pseudo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Pseudonyme"}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                className="w-full max-w-lg rounded-none"
                                                placeholder="Votre pseudonyme"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Champ mot de passe */}
                            <FormField
                                control={form1.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{"Mot de passe"}</FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <Input
                                                    type="password"
                                                    className="w-full max-w-lg rounded-none pr-20"
                                                    placeholder="Votre mot de passe"
                                                    {...field}
                                                />
                                                <Button
                                                    type="submit"
                                                    variant="ghost"
                                                    className="absolute right-2 px-4 py-2 text-[#012BAE]"
                                                    onClick={() => {
                                                        console.log(form1.getValues());

                                                    }}
                                                >
                                                    {"Modifier"}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <div className='flex flex-col gap-4'>
                        <h2>{"Informations personnelles"}</h2>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit2)}
                                className="flex flex-col gap-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-[836px]">
                                    <FormField
                                        control={form.control}
                                        name="nom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{"Nom"}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="w-full max-w-lg rounded-none"
                                                        placeholder="Nom"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pays"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{"Pays"}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="w-full max-w-lg rounded-none"
                                                        placeholder="Pays"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sexe"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{"Sexe"}</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Déffinissez un role" />
                                                        </SelectTrigger>
                                                        <SelectContent className='rounded-none'>
                                                            {sexe.map((sexe, index) => (
                                                                <SelectItem key={index} value={sexe}>
                                                                    {sexe}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ville"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{"Ville"}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="w-full max-w-lg rounded-none"
                                                        placeholder="Ville"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{"Phone"}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="w-full max-w-lg rounded-none"
                                                        placeholder="Phone"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button
                                    type='submit' className='max-w-[360px] h-[40px] rounded-none'>{"Enregistrer"}</Button>
                            </form>
                        </Form>
                    </div>

                    <Button variant={'destructive'} onClick={handleLogout} className='flex w-fit'> {"Se déconnecter"}</Button>
                    <div className='flex flex-col gap-4'>
                        <h2>{"Mon abonnement"}</h2>
                        {
                            currentUser?.abonnement?.cout === 0 ?
                                <div className='flex flex-col md:flex-row gap-10'>
                                    <div className='flex flex-row items-center gap-4 px-4 py-2'>
                                        <p className='text-[16px]'>{"Aucun Abonnement actif"}</p>
                                    </div>
                                    <Button className='rounded-none'>{"S'abonner"}</Button>
                                </div> :
                                <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
                                    <div className='flex flex-col md:flex-row items-center'>
                                        <div className='flex flex-row items-center gap-4 px-4 py-2 text-[#012BAE]'>
                                            <BiRadioCircleMarked className='h-10 w-10' />
                                            <div className='flex flex-col'>
                                                <p className='text-[16px]'>{currentUser?.abonnement?.nom}</p>
                                                <p className='text-[#545454] text-[12px]'>{"11 mois restant"}</p>
                                            </div>
                                        </div>
                                        <Button onClick={() => { router.push("/user/subscribe") }} className='rounded-none'>{"Changer d'abonnement"}</Button>
                                    </div>
                                </div>

                        }
                    </div>
                </div>
            </div>
            <div className="max-w-[360px] flex flex-col gap-7 px-7 py-5">
                <Similaire similaire={sec1} sim={sim1} />
                <PubsComp pub={pub} />
            </div>
        </div>
    );
};

export default ProfilForm;
