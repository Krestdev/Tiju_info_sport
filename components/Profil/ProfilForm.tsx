
import React, { useEffect, useState } from 'react';
import Similaire from '../DetailArticle/Similaire';
import PubsComp from '../PubsComp';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import useStore from '@/context/store';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BiRadioCircleMarked } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import FullScreen from '../Dashboard/FullScreen';
import UnePubs from '../Accueil/UnePubs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosConfig from '@/api/api';

const formSchema1 = z.object({
    email: z.string(),
    // pseudo: z.string(),
    password: z
        .string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
        .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
        .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." }),
    photo: z.any(),
});

const formSchema = z.object({
    name: z.string().min(4, { message: "Le nom doit contenir au moins 4 caractères." }),
    sex: z.string(),
    town: z.string(),
    country: z.string(),
    phone: z
        .string()
        .regex(/^\d{9}$/, { message: "Le numéro de téléphone doit contenir exactement 9 chiffres." }),
});


const combinedSchema = z.intersection(formSchema, formSchema1);

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
interface Props {
    pub: Advertisement[] | undefined;
    une: Category[] | null
}

const ProfilForm = ({ pub, une }: Props) => {
    const { currentUser, settings, logout } = useStore();
    const queryClient = useQueryClient();
    const [photo, setPhoto] = useState(currentUser?.image || settings.noPhoto)
    const [fichier, setFichier] = useState(null)
    const sexe = ["Homme", "Femme"]
    const router = useRouter();
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
    });

    const axiosClient1 = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Accept": "*/*",
        "x-api-key": "abc123",
        'Content-Type': 'multipart/form-data'
    });

    const [tail, setTail] = useState("max-h-[379px]")


    const handleVoirtout = () => {
        setTail("");
    }

    const form1 = useForm<z.infer<typeof formSchema1>>({
        resolver: zodResolver(formSchema1),
        defaultValues: {
            photo: currentUser?.image || null,
            password: currentUser?.password || '',
            email: currentUser?.email,
            // pseudo: currentUser?.pseudo,

        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: currentUser?.name,
            sex: currentUser?.sex,
            town: currentUser?.town,
            country: currentUser?.country,
            phone: currentUser?.phone
        }
    })


    const updateImage = useMutation({
        mutationKey: ["user"],
        mutationFn: ({ data, id }: { data: any, id: number }) => {
            return axiosClient1.post(`/image/${currentUser && currentUser.image}`,
                {
                    file: data,
                    article_id: id
                }
            )
        },
        onSuccess(data) {

        },
    })

    const addImage = useMutation({
        mutationKey: ["user"],
        mutationFn: ({ data, id }: { data: any, id: number }) => {
            return axiosClient1.post("/image",
                {
                    file: data,
                    user_id: id
                }
            )
        },
    })


    const editUser = useMutation({
            mutationKey: ["user"],
            mutationFn: ({ data, dataI }: { data: z.infer<typeof combinedSchema>, dataI: any },) => {
                const idU = currentUser && String(currentUser.id)
                return axiosClient.patch(`/articles/${dataI.id}`, 
                    {
                        user_id: currentUser && currentUser.id,
                        email: data.email,
                        name: data.name,
                        password: data.password,
                        nick_name: "default",
                        phone: data.phone,
                        sex: data.sex,
                        town: data.town,
                        country: data.country,
                        photo: data.photo,
                        role: "user"
                    }
                );
            },
        });

    const onSubmit = (data: z.infer<typeof combinedSchema>) => {
        console.log(data);
        setFichier(data.photo)
        currentUser && currentUser.image ?
            // updateImage.mutate({ data: fichier, id: currentUser.id })
            console.log("Hello world")
            :
            currentUser && addImage.mutate({ data: fichier, id: currentUser.id })
    };

    return (
        <div className="max-w-[1280px] w-full px-10 flex flex-col md:flex-row gap-7">
            <div className="px-7 md:px-0 flex flex-col gap-5">
                <div className="flex flex-col gap-8">
                    <h1 className='uppercase'>{"Mon Compte"}</h1>
                    <Form {...form1}>
                        <form
                            // onSubmit={form1.handleSubmit(onSubmit1)}
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
                            {/* <FormField
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
                            /> */}

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
                                                    type="text"
                                                    className="w-full max-w-lg rounded-none pr-20"
                                                    placeholder="Votre mot de passe"
                                                    hidden={false}
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
                        <h3 className='uppercase'>{"Informations personnelles"}</h3>
                        <Form {...form}>
                            <form
                                // onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-[836px]">
                                    <FormField
                                        control={form.control}
                                        name="name"
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
                                        name="country"
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
                                        name="sex"
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
                                        name="town"
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
                                {/* <Button type='submit' className='w-full max-w-[398px] h-[40px] rounded-none'>{"Enregistrer"}</Button> */}
                            </form>
                        </Form>
                    </div>

                    <Button
                        type="button"
                        className='w-full max-w-[398px] h-[40px] rounded-none'
                        onClick={() => {
                            form1.handleSubmit((data1) => {
                                form.handleSubmit((data2) => {
                                    onSubmit({ ...data1, ...data2 });
                                })();
                            })();
                        }}
                    >
                        Enregistrer
                    </Button>
                    {currentUser && <Button variant={'destructive'} onClick={logout} className='flex w-fit'> {"Se déconnecter"}</Button>}

                    <div className='flex flex-col gap-4'>
                        <h3 className='uppercase'>{"Mon abonnement"}</h3>
                        {/* {
                            currentUser?.abonnement === undefined ?
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
                        } */}
                    </div>
                </div>
            </div>
            <div className="md:max-w-[360px] w-full gap-7">
                <div className={`${tail} md:max-h-full h-full overflow-hidden px-7 md:px-0`}>
                    <UnePubs titre={'A la une'} couleur={'bg-[#B3261E]'} article={une?.slice(0, 2).flatMap(cat => cat.articles.slice(0, 1))} pubs={pub} affPub={false} />
                    <UnePubs titre={"Aujourd'hui"} couleur={'bg-[#01AE35]'} article={une?.slice().flatMap(cat => cat.articles.slice()).slice(0, 2)} pubs={pub?.slice().reverse()} affPub={true} />
                </div>
                {tail === "max-h-[379px]" && <Button variant={"outline"} className='rounded-none mx-7 flex md:hidden' onClick={() => handleVoirtout()}>{"Voir Plus"}</Button>}
                <div className='flex md:hidden px-7 mt-7'>{pub && <PubsComp pub={pub} taille={'h-[300px]'} clip={'clip-custom'} />}</div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ProfilForm;
