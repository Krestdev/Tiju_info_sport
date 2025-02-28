import useStore from '@/context/store'
import React from 'react'
import { LuLogOut, LuMenu } from 'react-icons/lu'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '../ui/button';

export function NavAdmin() {
    const { currentAdmin, logoutAdmin, setIsFull } = useStore()

    const handleLogout = () => {
        logoutAdmin()
        toast.success("Deconnecté avec succès");
    }

    return (
        <div className='w-full flex flex-row justify-between px-7 py-2 '>
            <Button variant={"ghost"} onClick={setIsFull} className='flex flex-row items-center gap-2 px-3 py-2 max-h-10 h-full'>
                <LuMenu />
                <p className='uppercase font-oswald font-medium text-[14px] leading-[18.2px]'>{"Menu"}</p>
            </Button>
            <div className='max-h-[40px] h-full flex flex-row items-center justify-center'>
                <div className='flex px-3 gap-2'>
                    <p className='capitalize font-bold text-[16px] leading-[20.2px]'>{currentAdmin?.nom}</p>
                </div>
                <Button variant={"ghost"} className='py-1 px-2' onClick={() => handleLogout()}>
                    <LuLogOut />
                </Button>
            </div>
        </div>
    )
}

