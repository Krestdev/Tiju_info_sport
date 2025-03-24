"use client"

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Menu, Search, User } from 'lucide-react'
import useStore from '@/context/store'
import { useRouter } from 'next/navigation'
import MenuBar from './menuBar'
import { Article, Categorie } from '@/data/temps'
import { useQuery } from '@tanstack/react-query'
import { Input } from './ui/input'
import { IoIosMail } from "react-icons/io";
import { MenuComp } from './menu'


const Navbar = () => {

    const router = useRouter()
    const { currentUser, dataArticles, logout, setSearch, settings } = useStore()
    const [article, setArticle] = useState<Categorie[]>()
    const [showSearch, SetShowSearch] = useState(false);
    const [searchEntry, setSearchEntry] = useState("");


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
        router.push("/user/logIn")
    }
    const handleLogout = () => {
        logout();
        router.push("/user/logIn");
    };
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    const filterData = useMemo(() => {
        if (articleData.isSuccess) {
            if (searchEntry === "") return articleData.data.flatMap(x => x.donnees);
            return articleData.data.flatMap(x => x.donnees).filter((el) =>
                Object.values(el).some((value) =>
                    String(value)
                        .toLocaleLowerCase()
                        .includes(searchEntry.toLocaleLowerCase())
                )
            );
        }
        //to do: complete this code
    }, [searchEntry, articleData.data]);

    useEffect(() => {
        setSearch(filterData)
    }, [searchEntry, articleData.data])


    return (
        <div className='containerBloc px-7 md:w-full w-screen flex items-center justify-center fixed md:static z-50'> 
        <div className='absolute w-full h-[80px] bg-blue-100/80 blur-sm md:bg-transparent z-20'></div>
            <div className='w-screen md:w-full h-[50px] flex flex-row items-center justify-between -top-[1782px] -left-[482px] z-30'>
                <MenuBar article={article} currentUser={currentUser} />
                <div className='flex flex-row items-center gap-5'>
                    <Link href={"/"} className='flex flex-row items-center gap-4 text-[#182067]'>
                        <img src={settings.logo} alt="Logo" className='size-[50px]' />
                        <p className='uppercase font-semibold font-oswald text-[18px] leading-[26.68px] hidden md:flex'>{settings.compagnyName}</p>
                    </Link>
                    {/* <div className='hidden md:flex md:flex-row items-center gap-3'>
                        <MenuComp />
                        <Link href={"/user/all-articles"}><Button onClick={() => SetShowSearch(!showSearch)} variant={'ghost'}><Search className='size-[60px]' /></Button></Link>
                    </div> */}
                </div>
                {
                    showSearch && <Input
                        type="search"
                        onChange={handleInputChange}
                        value={searchEntry}
                        placeholder="Rechercher un article"
                        className="max-w-[350px] w-full pr-3"
                    />
                }
                <div className='flex flex-row items-center gap-5'>
                    <div className='flex items-center gap-3'>
                        {
                            currentUser ?
                                <div className='flex flex-row items-center gap-4'>
                                    <Link href={'/user/profil'} className='hidden md:flex flex-row items-center gap-2'>
                                        <img src={currentUser?.photo ? currentUser?.photo : '/images/no-user.jpg'} alt="" className='size-7 object-cover rounded-full' />
                                    </Link>
                                    {
                                        currentUser.abonnement && currentUser.abonnement?.coutMois > 0 ?
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
                                    }
                                </ div> :
                                <>
                                    <Button variant={'ghost'} onClick={handleLogin}>
                                        <div className='hidden md:flex border-black border rounded-full'>
                                            <User />
                                        </div> {"SE CONNECTER"}
                                    </Button>
                                    <Link href={'/user/subscribe'} className='hover:underline'>
                                        <div className='px-3 py-2 bg-[#0128AE] hover:bg-[#3456c4] text-white'>
                                            {"S'ABONNER"}
                                        </div>
                                    </Link>
                                </>
                        }
                        {/* <Link href={"/user/contact"} className='flex flex-row items-center gap-0 hover:bg-blue-100 px-2'><IoIosMail className='size-10' /> <h3>{"Contacter"}</h3></Link> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
