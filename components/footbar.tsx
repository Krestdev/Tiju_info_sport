"use client"

import { Facebook, Twitter } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from './ui/button';
import Link from 'next/link';
import { Categorie } from '@/data/temps';
import useStore from '@/context/store';
import { useQuery } from '@tanstack/react-query';


const Footbar = () => {

    const {dataArticles} = useStore()
    const [categorie, setCategorie] = useState<Categorie[]>()

    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles
    })

    useEffect(()=>{
        if (articleData.isSuccess) {
            setCategorie(articleData.data)
        }
    }, [articleData.data])

    return (
        <div className='w-full flex flex-col items-center justify-center gap-8'>
            <div className='max-w-[1280px] w-full flex flex-col md:flex-row items-start md:items-center justify-between px-5 py-3 gap-3 border-b border-[#E4E4E4]'>
                <Link href={"/"} className='flex flex-row items-center gap-4 text-[#182067]'>
                    <img src="/logo.png" alt="logo" className='h-[70px] w-[70px] object-cover' />
                    <p className='font-semibold font-oswald text-[32px] leading-[47.42px]'>{"TYJU INFO SPORTS"}</p>
                </Link>
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-black'>
                    <div className='flex flex-row gap-6 '>
                        <Link href={'https://www.facebook.com/profile.php?id=100064177984379'} target='_blank'>
                            <Button variant={'ghost'} className='p-2 border border-black rounded-none'>
                                <FaFacebook className='size-5' />
                            </Button>
                        </Link>
                        <Link href={'https://www.facebook.com/profile.php?id=100064177984379'} target='_blank'>
                            <Button variant={'ghost'} className='p-2 border border-black rounded-none'>
                                <FaXTwitter className='size-5' />
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
                                categorie?.slice(0, 6).map((x, i) => (
                                    <Link href={`/user/category/${x.nom}`} key={i} className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{x.nom}</Link>
                                ))
                            }
                        </div>
                    </div>
                    {categorie && <div className='max-w-[320px] flex flex-col w-full gap-4'>
                        <h4 className='uppercase text-[#A1A1A1]'>{categorie[0].nom}</h4>
                        <div className='flex flex-col gap-2'>
                            {
                                [...new Set(categorie[0].donnees?.map(x => x.type))].map((x, i) => (
                                    <Link href={`/user/detail-article/`} key={i} className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{x}</Link>
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
        </div>
    )
}

export default Footbar
