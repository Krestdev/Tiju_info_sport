'use client'
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { DateRange } from 'react-day-picker';

interface DataProps {
    articles : Article[];
    searchByName: string;
    date: DateRange | undefined;
}

function ArticlesDataTable({ articles, searchByName, date }:DataProps) {

    const filteredArticles = React.useMemo(()=>{
        return articles.filter(x=>x.title.toLowerCase().includes(searchByName.toLowerCase()))
    },[articles, searchByName, date])

    if(articles.length === 0) return <div className='flex flex-col items-center justify-start gap-5 py-3 min-h-[30vh]'>
    <img src='/icons/folder.png' alt='no-result' className='size-20 sm:size-40 lg:size-60 transition-all duration-300 ease-linear opacity-40'/>
    <p className='text-base sm:text-lg md:text-md lg:text-lg xl:text-xl text-center'>{"Aucun article ne figure dans la base de donnée"}</p>
    <Link href={"/dashboard/articles/add-article"}>
        <Button family={"sans"}>{"Créer un article"}<PlusCircle/></Button>
    </Link>
</div>
    if(filteredArticles.length === 0) return <div className='flex flex-col items-center justify-start gap-5 py-3 min-h-[30vh]'>
        <img src='/icons/folder.png' alt='no-result' className='size-20 sm:size-40 lg:size-60 transition-all duration-300 ease-linear opacity-40'/>
        <p className='text-base sm:text-lg md:text-md lg:text-lg xl:text-xl text-center'>{"Aucun résultat ne correspond à votre recherche"}</p>
    </div>
  return (
    <div className='flex flex-col gap-5'>
        s
    </div>
  )
}

export default ArticlesDataTable