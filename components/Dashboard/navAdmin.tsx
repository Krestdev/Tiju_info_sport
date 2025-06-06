import useStore from '@/context/store'
import React from 'react'
import { LuLogOut, LuMenu } from 'react-icons/lu'
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';

export function NavAdmin() {
    const { currentUser, logout, setActiveUser, setIsFull, isFull } = useStore()

    const handleLogout = () => {
        logout();
        setActiveUser();
        toast({
            title: "Vous êtes déconnecté",
            description:"Vous naviguez actuellement en tant qu'invité"
        })
    }

    return (
        <div className='w-full flex flex-row justify-end md:justify-between px-7 py-2 bg-white'>
            <Button variant={"ghost"} onClick={() => setIsFull(!isFull)} className='hidden md:flex flex-row items-center gap-2 px-3 py-2 max-h-10 h-full'>
                <LuMenu />
                <p className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{"Menu"}</p>
            </Button>
            <div className='max-h-[40px] h-full flex flex-row items-center justify-center'>
                <div className='flex px-3 gap-2'>
                    <p className='capitalize font-bold text-[16px] leading-[20.2px]'>{currentUser?.name}</p>
                </div>
                <Button variant={"ghost"} className='py-1 px-2' onClick={() => handleLogout()}>
                    <LuLogOut />
                </Button>
            </div>
        </div>
    )
}

