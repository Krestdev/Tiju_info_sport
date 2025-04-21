import Link from 'next/link';
import React from 'react'
import CategoryBadge from './categoryBadge';
import { cn, slugify } from '@/lib/utils';

interface PreviewProps extends Article {
    version?: "default" | "text-only" | "main";
    className?:string
}

function ArticlePreview({version = "default", id, type, title, images, className, slug, imageurl}: PreviewProps) {
    if(version === "text-only") {
  return (
    <Link href={`/${slugify(type)}/${slug}`} className='py-4 flex flex-col gap-2 font-oswald font-medium'>
        <span className='article-category text-[14px]'>{type}</span>
        <h4 className='line-clamp-3'>{title}</h4>
    </Link>
  )
}
    if(version === "default"){
    return (
        <Link key={id} className="flex flex-col gap-5" href={`/${slugify(type)}/${slug}`}>
            <img src={imageurl ? `${process.env.NEXT_PUBLIC_API?.substring(0, process.env.NEXT_PUBLIC_API?.length-4)}${imageurl.substring(1)}` : images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${images[0].id}`: "/images/no-image.jpg"} alt={title} className="w-full h-auto aspect-video rounded-md object-cover"/>
            <div className="flex flex-col">
                <span className="article-category">{type}</span>
                    <h3 className='line-clamp-3'>{title}</h3>
            </div>
        </Link>
    )
}
    if(version==="main"){
        return (
            <Link href={`/${slugify(type)}/${slug}`} className={cn('w-full min-h-[calc(100vw*9/16)] lg:min-h-[auto] lg:aspect-video rounded-none lg:rounded-md flex flex-col justify-end relative overflow-hidden', className)}>
                <div className='px-5 py-7 flex flex-col gap-2 z-10'>
                    <CategoryBadge title={type}/> {/**TODO: Add the color here */}
                    <h1 className="text-white line-clamp-3">{title}</h1>
                </div>
                <div className='bg-gradient-to-t from-black/70 to-transparent absolute top-0 left-0 w-full h-full z-[2]'/>
                <img src={imageurl ? `${process.env.NEXT_PUBLIC_API?.substring(0, process.env.NEXT_PUBLIC_API?.length-4)}${imageurl.substring(1)}` : images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${images[0].id}`: "/images/no-image.jpg"} alt={title} className="absolute top-0 left-0 w-full h-full object-cover" />
            </Link>
        )
    }
}

export default ArticlePreview