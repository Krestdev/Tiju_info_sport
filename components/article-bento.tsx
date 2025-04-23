import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { cn, slugify, sortArticles } from '@/lib/utils'
import CategoryBadge from './categoryBadge';

interface ArticleBentoProps {
    data: Category
}

function ArticleBento({ data }:ArticleBentoProps) {
    const articlesSorted = sortArticles(data.articles.filter(x=>x.status==="published"));
  return (
    <div className='mx-auto max-w-7xl px-7 py-10 sm:py-12 lg:py-[60px] flex flex-col gap-6'>
        <div className='flex flex-wrap gap-3 justify-between items-center'>
            <h2 className='uppercase'>{data.title}</h2>
            <Link href={`/${data.slug}`}><Button>{"Tout voir"}</Button></Link>
        </div>
        <div className='grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-2'>
            <Link href={`/${slugify(articlesSorted[0].type)}/${articlesSorted[0].slug}`} className={cn('w-full min-h-[calc(100vw*9/16)] lg:min-h-[auto] lg:aspect-video rounded-md flex flex-col justify-end relative overflow-hidden')}>
                <div className='px-5 py-7 flex flex-col gap-2 z-10'>
                    <CategoryBadge title={articlesSorted[0].type}/> {/**TODO: Add the color here */}
                    <h3 className="text-white line-clamp-3 uppercase">{articlesSorted[0].title}</h3>
                </div>
                <div className='bg-gradient-to-t from-black/70 to-transparent absolute top-0 left-0 w-full h-full z-[2]'/>
                <img src={articlesSorted[0].imageurl ? `${process.env.NEXT_PUBLIC_API?.substring(0, process.env.NEXT_PUBLIC_API?.length-4)}${articlesSorted[0].imageurl.substring(1)}` : articlesSorted[0].images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${articlesSorted[0].images[0].id}`: "/images/no-image.jpg"} alt={articlesSorted[0].title} className="absolute top-0 left-0 w-full h-full object-cover" />
            </Link>
            <div className='flex flex-col gap-5'>
                {articlesSorted.slice(1, 4).map((article, index) => (
                    <Link key={index} href={`/${slugify(article.type)}/${article.slug}`} className="flex flex-col sm:flex-row gap-3 sm:gap-7">
                        <img src={article.imageurl ? `${process.env.NEXT_PUBLIC_API?.substring(0, process.env.NEXT_PUBLIC_API?.length-4)}${article.imageurl.substring(1)}` : article.images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${article.images[0].id}`: "/images/no-image.jpg"} alt={article.title} className="w-full h-auto sm:h-[90px] sm:w-auto aspect-video rounded-sm object-cover"/>
                        <div className="flex flex-col gap-1">
                            <span className="article-category line-clamp-1">{article.type}</span>
                            <h3 className='line-clamp-3 sm:line-clamp-2'>{article.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  )
}

export default ArticleBento