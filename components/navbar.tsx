import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Menu, Search } from 'lucide-react'

const Navbar = () => {
    return (
        <div className='w-full flex items-center justify-center'>
            <div className='max-w-[1280px] px-5 w-full h-[80px] flex flex-row items-center justify-between -top-[1782px] -left-[482px]'>
                <Link href={"/"}><img src="/logo.png" alt="Logo" className='h-[60.66px] w-[60px] ' /></Link>
                <div className='flex flex-row items-center gap-10'>
                    <div className='hidden md:flex md:flex-row items-center'>
                        <Link href={'/category'}><Search /></Link>
                        <Link className='flex h-[40px] px-3 py-2 gap-2' href={""}>LIONS INDOMTABLES</Link>
                        <Link className='flex h-[40px] px-3 py-2 gap-2' href={""}>CHAMPIONS LEAGUE</Link>
                        <Link className='flex h-[40px] px-3 py-2 gap-2' href={""}>EUROPE</Link>
                        <Link className='flex h-[40px] px-3 py-2 gap-2' href={""}>HANDBALL</Link>
                    </div>
                    <Button variant={'ghost'} className='flex flex-row gap-2'>
                        <Menu className='h-6 w-6' />
                        <p>{"MENU"}</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Navbar
