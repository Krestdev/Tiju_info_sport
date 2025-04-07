"use client"

import { Facebook, Twitter } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from './ui/button';
import Link from 'next/link';
import useStore from '@/context/store';
import { useQuery } from '@tanstack/react-query';
import axiosConfig from '@/api/api';
import { AxiosResponse } from 'axios';


const Footbar = () => {

    const { dataArticles, settings } = useStore()
    const [categorie, setCategorie] = useState<Category[]>()
    const axiosClient = axiosConfig();

    const articleData = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Category[]>>(
                `/category`
            );
        },
    });

    useEffect(() => {
        if (articleData.isSuccess) {
            setCategorie(articleData.data.data)
        }
    }, [articleData.data])

    function filterCategoriesWithChildren(categories: Category[]): Category[] {
        // Filtrer les catégories parent (qui ont parent === null)
        const parentCategories = categories.filter(category => category.parent === null);

        // Filtrer les catégories parent ayant au moins un enfant avec des articles
        return parentCategories.filter(parent =>
            categories.some(child =>
                child.parent === parent.id && Array.isArray(child.articles) && child.articles.length > 0
            )
        );
    }

    return (
        categorie && categorie.length > 0 ?
        <div className='w-full flex flex-col items-center justify-center gap-8'>
            <div className='max-w-[1280px] w-full flex flex-col md:flex-row items-start md:items-center justify-between px-5 py-3 gap-3 border-b border-[#E4E4E4]'>
                <Link href={"/"} className='flex flex-row items-center gap-4 text-[#182067]'>
                    <img src={settings.logo} alt="Logo" className='size-[50px]' />
                    <p className='font-semibold font-oswald text-[16px] leading-[26.68px] flex uppercase'>{settings.compagnyName}</p>
                </Link>
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-black'>
                    <div className='flex flex-row gap-6 '>
                        <Link href={'https://www.facebook.com/profile.php?id=100064177984379'} target='_blank'>
                            <Button variant={"outline"} size={"icon"}>
                                <FaFacebook size={20} />
                            </Button>
                        </Link>
                        <Link href={'https://www.facebook.com/profile.php?id=100064177984379'} target='_blank'>
                            <Button variant={"outline"} size={"icon"}>
                                <FaXTwitter size={20} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='w-full flex items-center justify-center'>
                <div className='max-w-[1280px] w-full flex flex-col md:flex-row gap-7 px-5 py-8'>
                    <div className='max-w-[320px] flex flex-col w-full gap-4'>
                        <h4 className='uppercase text-[#A1A1A1]'>{"Catégories"}</h4>
                        <div className='flex flex-col gap-3'>
                            {
                                filterCategoriesWithChildren(categorie)?.slice(0, 6).map((x, i) => (
                                    <Link href={`/user/category/${x.title}`} key={i} className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{x.title}</Link>
                                ))
                            }
                        </div>
                    </div>
                    {categorie && <div className='max-w-[320px] flex flex-col w-full gap-4'>
                        <h4 className='uppercase text-[#A1A1A1]'>{categorie[0].title}</h4>
                        <div className='flex flex-col gap-2'>
                            {
                                [...new Set(categorie.filter(x => x.parent === categorie[0].id).flatMap(x => x.articles).map(x => x.type))].map((x, i) => (
                                    <Link href={`/user/${categorie[0].title}/${x}`} key={i} className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{x}</Link>
                                ))
                            }
                        </div>
                    </div>}
                    <div className='max-w-[320px] flex flex-col w-full gap-4'>
                        <h4 className='uppercase text-[#A1A1A1]'>{"Ressources"}</h4>
                        <div className='flex flex-col gap-3'>
                            <p className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{"Politique de confidentialité"}</p>
                            <p className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{"Aide"}</p>
                            <p className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{"Réclamation"}</p>
                            <p className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{"Nous Contacter"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>:
        ""
    )
}

export default Footbar
