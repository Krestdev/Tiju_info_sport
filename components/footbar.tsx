import { Facebook, Twitter } from 'lucide-react'
import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { Button } from './ui/button';
import Link from 'next/link';

const Footbar = () => {
    return (
        <div className='w-full flex flex-col items-center justify-center gap-8 border-t border-[#0128AE]'>
            <div className='max-w-[1280px] w-full flex flex-col md:flex-row items-start md:items-center justify-between px-5 py-3 gap-3'>
                <img src="/logo.png" alt="logo" className='h-[80px] w-[80.88] object-cover' />
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-[#0128AE]'>
                    <p className='text-[16px]'>{"Suivez l'activité sur nos réseaux"}</p>
                    <div className='flex flex-row gap-6 '>
                        <Link href={'https://www.facebook.com/profile.php?id=100064177984379'} target='_blank'>
                        <Button variant={'ghost'} className='p-2 border border-[#0128AE] rounded-full w-fit h-fit'>
                            <FaFacebookF />
                        </Button>
                        </Link>
                        <Button variant={'ghost'} className='p-2 border border-[#0128AE] rounded-full w-fit h-fit'>
                            <FaTwitter />
                        </Button>
                    </div>
                </div>
            </div>
            <div className='w-full flex items-center justify-center bg-[#F5F5F5]'>
                <div className='max-w-[1280px] w-full flex flex-col md:flex-row gap-8 px-5 py-20'>
                    <div className='flex flex-col max-w-[280px] w-full gap-4'>
                        <h3>{"Football"}</h3>
                        <div className='flex flex-col gap-2'>
                            <p>{"Championnat du cameroun"}</p>
                            <p>{"Qualification can 2025"}</p>
                            <p>{"Champions League Africain"}</p>
                            <p>{"Coupe du monde 2026"}</p>
                            <p>{"Coupe du cameroun"}</p>
                            <p>{"Coupe d'Afrique des Nations"}</p>
                            <p>{"Ligue 1"}</p>
                        </div>
                    </div>
                    <div className='flex flex-col max-w-[280px] w-full gap-6'>
                        <div className='flex flex-col gap-4'>
                            <h3>{"Basketball"}</h3>
                            <div className='flex flex-col gap-2'>
                                <p>{"Classement BAL"}</p>
                                <p>{"Championnat d'Afrique"}</p>
                                <p>{"NBA"}</p>
                                <p>{"Eurolique"}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <h3>{"Combat"}</h3>
                            <div className='flex flex-col gap-2'>
                                <p>{"MMA"}</p>
                                <p>{"PLF"}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex flex-col max-w-[280px] w-full gap-6'>
                        <div className='flex flex-col gap-4'>
                            <h3>{"Rugby"}</h3>
                            <div className='flex flex-col gap-2'>
                                <p>{"Coupe d'Afrique"}</p>
                                <p>{"Qualification Coupe du Monde"}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <h3>{"Tenis"}</h3>
                            <div className='flex flex-col gap-2'>
                                <p>{"Classement ATP"}</p>
                                <p>{"Classement WTA"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footbar
