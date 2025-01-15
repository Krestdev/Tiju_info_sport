"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Menu, Search, User } from 'lucide-react'
import useStore from '@/context/store'
import { useRouter } from 'next/navigation'
import MenuBar from './menuBar'
import { Article, Categorie } from '@/data/temps'
import { useQuery } from '@tanstack/react-query'


const Navbar = () => {

    const router = useRouter()
    const { currentUser, dataArticles, logout } = useStore()
    const [article, setArticle] = useState<Categorie[]>()
    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles,
    });
    useEffect(() => {
        if (articleData.isSuccess) {
            setArticle(articleData.data)
        }
    }, [articleData.data])

    const handleLogin = () => {
        router.push("/logIn")
    }
    const handleLogout = () => {
        logout();
        router.push("/logIn");
    };

    const fav = articleData.data?.flatMap(x => x.nom)

    return (
        <div className='w-full flex items-center justify-center'>
            <div className='max-w-[1280px] px-5 w-full h-[80px] flex flex-row items-center justify-between -top-[1782px] -left-[482px]'>
                <div className='flex flex-row items-center gap-5'>
                    <Link href={"/"} className='flex flex-row items-center gap-4 text-[#182067]'>
                        <img src="/logo.png" alt="Logo" className='size-[50px]' />
                        <p className='font-semibold text-[18px] hidden md:flex'>{"TYJU INFO SPORT"}</p>
                    </Link>
                    <div className='hidden md:flex md:flex-row items-center gap-3'>
                        {
                            fav?.slice(0, 3).map(x => (
                                <Link key={x} href={`/user/category/${x}`} className='px-3 py-2 hover:bg-gray-100'><h3 className='font-medium'>{x}</h3></Link>
                            ))
                        }
                        <Button variant={'ghost'}><Search className='size-[60px]' /></Button>
                    </div>
                </div>
                <div className='flex flex-row items-center gap-5'>
                    <div className='hidden md:flex'>
                        {
                            currentUser ?
                                <div className='flex flex-row items-center gap-4'>
                                    <Button variant={'destructive'} onClick={handleLogout} className='hidden md:flex'> {"Se déconnecter"}</Button>
                                    <div className='flex flex-row items-center gap-2'>
                                        <img src={currentUser?.photo ? currentUser?.photo : '/images/no-user.jpg'} alt="" className='size-7 object-cover rounded-full' />
                                        <Link href={'/user/profil'}><h3>Mon Compte</h3></Link>
                                    </div>
                                </ div> :
                                <>
                                    <Button variant={'ghost'} onClick={handleLogin}>
                                        <div className=' border-black border rounded-full'>
                                            <User />
                                        </div> {"SE CONNECTER"}
                                    </Button>
                                    <Link href={'/signUp'} className='hover:underline'>
                                        <div className='px-3 py-2 bg-[#0128AE] hover:bg-[#3456c4] text-white'>
                                            {"S'ABONNER"}
                                        </div>
                                    </Link>
                                </>
                        }
                    </div>
                    <MenuBar article={article} currentUser={currentUser} />
                </div>
            </div>
        </div>
    )
}

export default Navbar
