import { cn } from '@/lib/utils';
import React from 'react'
interface Props {
    title:string;
    color?:string;
    className?:string
}

function CategoryBadge({title, color, className}:Props) {
  return (
    <span className={cn("w-fit font-oswald uppercase text-[14px] leading-[130%] font-medium text-white px-3 py-2",className, color ? `bg-[${color}]` : "bg-orange-700")}>
        {title}
    </span>
  )
}

export default CategoryBadge