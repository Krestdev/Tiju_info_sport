'use client'
import { usePublishedArticles } from '@/hooks/usePublishedData';
import { cn } from '@/lib/utils';
import React from 'react'
interface Props {
    title:string;
    className?:string
}

function CategoryBadge({title, className}:Props) {
  const {categories} = usePublishedArticles();
  const currentCategory = categories.find(x=>x.title===title);
  return (
    <span className={cn("w-fit font-mono uppercase text-[14px] leading-[130%] font-medium text-white px-3 py-2",className)} style={{backgroundColor: currentCategory?.color || "#01AE35"}}>
        {title}
    </span>
  )
}

export default CategoryBadge