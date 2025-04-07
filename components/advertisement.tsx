import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'

interface Props extends Advertisement{
    variant: "large" | "square";
    className?:string;
}

function Advertisement({variant, className, url, image}:Props) {
    if(variant==="square"){
        return (
            <Link href={url} target="_blank" className={cn(className)}>
                <img src={`${process.env.NEXT_PUBLIC_API}image/${image.id}`} className="max-w-sm w-full h-full object-cover" />
            </Link>
        )
    }
}

export default Advertisement