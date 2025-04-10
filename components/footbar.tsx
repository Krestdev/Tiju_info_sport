"use client"

import useStore from '@/context/store';
import { usePublishedArticles } from '@/hooks/usePublishedData';
import Link from 'next/link';
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from './ui/button';
import Logo from './logo';


const Footbar = () => {

    const { settings } = useStore()
    const {categories, isSuccess} = usePublishedArticles();

    function filterCategoriesWithChildren(categories: Category[]): Category[] {
        // Filtrer les catégories parent (qui ont parent === null)
        const parentCategories = categories.filter(category => category.parent === null);

        // Filtrer les catégories parent ayant au moins un enfant avec des articles
        return parentCategories.filter(parent =>
            categories.some(child =>
                child.parent === parent.id && Array.isArray(child.articles) && child.articles.length > 0
            )
        );
    }

    return (
        isSuccess && categories.length > 0 ?
        <div className='w-full flex flex-col items-center justify-center gap-8'>
            <div className='max-w-[1280px] w-full flex flex-col md:flex-row items-start md:items-center justify-between px-5 py-3 gap-3 border-b border-[#E4E4E4]'>
                <Logo logoSize={"size[50]px"} textClass='text-3xl'/>
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-black'>
                    <div className='flex flex-row gap-6 '>
                        <Link href={'https://www.facebook.com/profile.php?id=100064177984379'} target='_blank'>
                            <Button variant={"outline"} size={"icon"}>
                                <FaFacebook size={20} />
                            </Button>
                        </Link>
                        <Link href={'https://www.facebook.com/profile.php?id=100064177984379'} target='_blank'>
                            <Button variant={"outline"} size={"icon"}>
                                <FaXTwitter size={20} />
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
                                categories.filter(x=>!x.parent).slice(0, 6).map((x, i) => (
                                    <Link href={`/user/category/${x.title}`} key={i} className='uppercase font-mono font-medium text-[14px] leading-[18.2px]'>{x.title}</Link>
                                ))
                            }
                        </div>
                    </div>
                    <div className='max-w-[320px] flex flex-col w-full gap-4'>
                        <h4 className='uppercase text-[#A1A1A1]'>{categories[0].title}</h4>
                        <div className='flex flex-col gap-2'>
                            {
                                [...new Set(categories.filter(x => x.parent === categories[0].id).flatMap(x => x.articles).map(x => x.type))].map((x, i) => (
                                    <Link href={`/user/${categories[0].title}/${x}`} key={i} className='uppercase font-mono font-medium text-[14px] leading-[18.2px]'>{x}</Link>
                                ))
                            }
                        </div>
                    </div>
                    <div className='max-w-[320px] flex flex-col w-full gap-4'>
                        <h4 className='uppercase text-[#A1A1A1]'>{"Ressources"}</h4>
                        <div className='flex flex-col gap-3 uppercase font-mono font-medium'>
                            <p className='font-medium text-[14px]'>{"Politique de confidentialité"}</p>
                            <p className='font-medium text-[14px]'>{"Aide"}</p>
                            <p className='font-medium text-[14px]'>{"Réclamation"}</p>
                            <p className='font-medium text-[14px]'>{"Nous Contacter"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>:
        ""
    )
}

export default Footbar
