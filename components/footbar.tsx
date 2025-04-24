"use client"

import useStore from '@/context/store';
import { usePublishedArticles } from '@/hooks/usePublishedData';
import Link from 'next/link';
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from './ui/button';
import Logo from './logo';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosConfig from '@/api/api';
import React from 'react';


const Footbar = () => {
    const {categories, isSuccess} = usePublishedArticles();
    const pathname = usePathname();
    const path = pathname.split("/");
    const isDashboard = path.includes("dashboard");
    const axiosClient = axiosConfig();
    const params = useQuery({
        queryKey: ["settings"],
        queryFn: ()=>{
            return axiosClient.get<ConfigProps[]>("param/show");
        }
    });

    const sections = useQuery({
            queryKey: ["sections"],
            queryFn: () => {
                return axiosClient.get<{ title: string, id: number, content: Ressource[] }[]>(
                    `/footer/show`
                );
            },
        });

    if(isDashboard){
        return null;
    }

    return (
        isSuccess && categories.length > 0 &&
        <section className="border-t border-gray-200 divide-y divide-gray-200">
            <div className='containerBloc py-3 flex flex-wrap justify-between items-center gap-4'>
                <Logo logoSize="size-[50px]" textClass="text-3xl" />
                <span className='inline-flex gap-3 items-center'>
                    <a href='https://www.facebook.com'><Button size={"icon"} variant={"outline"}><FaFacebook size={20}/></Button></a>
                    <a href='https://www.twitter.com'><Button size={"icon"} variant={"outline"}><FaXTwitter size={20} /></Button></a>
                </span>
            </div>
                <div className='w-full'>
                    <div className='containerBloc flex flex-wrap gap-7 pt-6 sm:pt-8 pb-8 sm:pb-10 lg:pb-14'>
                        <div className='max-w-80 w-full flex flex-col gap-4 text-sm font-mono uppercase'>
                            <span className='text-category'>{"catégories"}</span>
                            <ul role="list" className='flex flex-col gap-3'>
                                {categories.filter(x=>x.footershow === true).map((item, i)=>(
                                    <li className='font-medium' key={i}><Link href={`/${item.slug}`}>{item.title}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className='max-w-80 w-full flex flex-col gap-4 text-sm font-mono uppercase'>
                            <span className='text-category'>{"sports"}</span>
                            <ul role="list" className='flex flex-col gap-3'>
                                {categories.filter(x=>x.parent === null).map((item, i)=>(
                                    <li className='font-medium' key={i}><Link href={`/${item.slug}`}>{item.title}</Link></li>
                                ))}
                            </ul>
                        </div>
                        {sections.isSuccess && 
                        sections.data.data.filter(x=>x.content.length > 0).map((el)=>(
                            <div key={el.id} className='max-w-80 w-full flex flex-col gap-4 text-sm font-mono uppercase'>
                                <span className='text-category'>{el.title}</span>
                                <ul role="list" className='flex flex-col gap-3'>
                                    {el.content.map((item, i)=>(
                                        <li key={i} className='font-medium'><Link href={item.url}>{item.title}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        ))
                        }
                        {/* <div className='max-w-80 w-full flex flex-col gap-4 text-sm font-mono uppercase'>
                            <span className='text-category'>{"ressources"}</span>
                            <ul role="list" className='flex flex-col gap-3'>
                                <li className='font-medium'><Link href={"#"}>{"politique de confidentialité"}</Link></li>
                                <li className='font-medium'><Link href={"#"}>{"aide"}</Link></li>
                                <li className='font-medium'><Link href={"#"}>{"termes & conditions"}</Link></li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            {
                params.isSuccess && params.data.data.length > 0 &&
                <div className='w-full'>
                    <div className='containerBloc flex flex-wrap justify-between gap-4 items-center pt-3 pb-5'>
                        <span className='text-sm text-paragraph'>{`© 2025 ${params.data.data[0].company}. Tous droits réservés.`}</span>
                        <span className='text-sm text-paragraph'>{"Propulsé par"} <a href="https://www.krestdev.com" target="_blank" className='text-primary'>{"krestdev"}</a></span>
                    </div>
                </div>
            }
        </section>
    )
}

export default Footbar
