'use client'
import { usePublishedArticles } from '@/hooks/usePublishedData'
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface BreadcrumbProps{
    category: Category;
}

function CategoryBreadcrumb({category}:BreadcrumbProps) {
    const {categories} = usePublishedArticles();
    const similarCategories = categories.filter(el=>el.id === category.id || el.parent === category.id || el.id === category.parent || el.parent === category.parent && el.parent !== null).filter(a=>a.articles.some(b=>b.status === "published"));
    const pathname = usePathname();
    const path = pathname.split("/");
  return (
    <div className='breadcrumb'>
        {similarCategories.map(x=><BreadcrumbElement key={x.id} href={`/${x.slug}`} title={x.title} isActive={path.includes(x.slug.trim())}/>)}
        {/**Added trim to fix old issues, can be removed if no slug end with a space */}
    </div>
  )
}

export default CategoryBreadcrumb

interface BreadcrumbElementProps{
    href:string;
    title:string;
    isActive:boolean;
}

function BreadcrumbElement({href, title, isActive}:BreadcrumbElementProps){
    return (
        <Link href={href} className={cn("h-10 px-4 inline-flex items-center gap-2 border border-gray-200 uppercase font-mono text-[14px] leading-[130%] tracking-[-2%] shrink-0", isActive && "bg-primary text-primary-foreground")}>
            {title}
        </Link>
    )
}