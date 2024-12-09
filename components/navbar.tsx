"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Menu, Search } from 'lucide-react'
import useStore from '@/context/store'
import { useRouter } from 'next/navigation'
import MenuBar from './menuBar'
import { Article, Categorie } from '@/data/temps'
import { useQuery } from '@tanstack/react-query'

interface Result {
    id: number;
    type: string;
  }

const Navbar = () => {

    const router = useRouter()
    const { currentUser, dataArticles, logout} = useStore()
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

    return (
        <div className='w-full flex items-center justify-center'>
            <div className='max-w-[1280px] px-5 w-full h-[80px] flex flex-row items-center justify-between -top-[1782px] -left-[482px]'>
                <Link href={"/"}><img src="/logo.png" alt="Logo" className='h-[60.66px] w-[60px] ' /></Link>
                <div className='flex flex-row items-center gap-5'>
                    {
                        currentUser ?
                            <Button variant={'destructive'} onClick={handleLogout} className='hidden md:flex'> {"Se déconnecter"}</Button> :
                            <>
                                <Button variant={'outline'} onClick={handleLogin}>{"Se connecter"}</Button>
                                <Link href={'/signUp'} className='hover:underline'>{"S'inscrire"}</Link>
                            </>
                    }
                    <MenuBar article={article} currentUser={currentUser} />
                </div>
            </div>
        </div>
    )
}

export default Navbar
