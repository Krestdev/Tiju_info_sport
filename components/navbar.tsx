"use client"

import axiosConfig from '@/api/api'
import useStore from '@/context/store'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MenuComp } from './menu'
import MenuBar from './menuBar'
import { Button } from './ui/button'


const Navbar = () => {

    const { currentUser, settings, } = useStore()
    const [article, setArticle] = useState<Category[]>()

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
            setArticle(articleData.data.data.filter(x => x.articles.length > 0))
        }
    }, [articleData.data])




    return (
        <div className='sticky top-0 z-20 bg-white'>
            <div className='containerBloc h-[60px] grid grid-cols-2 sm:grid-cols-3 gap-2'>
                {/* Menu bar goes here */}
                <span className='inline-flex items-center justify-start gap-2'>
                    <MenuBar article={article} />
                    <Link href={"/"} className='flex sm:hidden flex-row items-center gap-4 text-[#182067]'>
                        <img src={settings.logo} alt="Logo" className='size-[40px]' />
                    </Link>
                </span>
                {/* Logo and Name */}
                <span className='hidden sm:flex flex-row items-center justify-center gap-5'>
                    <Link href={"/"} className='flex flex-row items-center gap-4 text-[#182067]'>
                        <img src={settings.logo} alt="Logo" className='size-[40px]' />
                        <span className='uppercase font-semibold font-oswald text-lg'>{settings.compagnyName}</span>
                    </Link>
                </span>
                {/* Right side content */}
                <div className='flex flex-row items-center justify-end gap-5'>
                    <div className='flex items-center gap-3'>
                        {
                            currentUser ?
                                <div className='flex flex-row items-center gap-4'>
                                    <Link href={'/user/profil'}>
                                    <Button variant={"outline"}>
                                        <User/>
                                        {currentUser?.nom ?? "Profil"}
                                    </Button>
                                    </Link>
                                    {/* {
                                        currentUser && currentUser.abonnement && currentUser.abonnement?.coutMois > 0 ?
                                            <Link href={'/user/subscribe'} className='hover:underline'>
                                                <div className='px-3 py-2 bg-[#0128AE] hover:bg-[#3456c4] text-white'>
                                                    {"Changer d'offre"}
                                                </div>
                                            </Link>
                                            :
                                            <Link href={'/user/subscribe'} className='hover:underline'>
                                                <div className='px-3 py-2 bg-[#0128AE] hover:bg-[#3456c4] text-white'>
                                                    {"S'ABONNER"}
                                                </div>
                                            </Link>
                                    } */}
                                </ div> :
                                <span className='w-full inline-flex gap-2 items-center'>
                                    <Link href={"/user/logIn"}>
                                        <Button variant={'ghost'}>
                                            <div className='flex border-black border rounded-full'>
                                                <User />
                                            </div> 
                                            {"se connecter"}
                                        </Button>
                                    </Link>
                                    {/* <Link href={'/user/subscribe'} className='hover:underline '>
                                        <div className='px-3 py-2 bg-[#0128AE] hover:bg-[#3456c4] text-white'>
                                            {"S'ABONNER"}
                                        </div>
                                    </Link> */}
                                </span>
                        }
                    </div>
                </div>
            </div>
            {/* Categories are displayed here */}
            <MenuComp/>
        </div>
    )
}

export default Navbar
