'use client'
import ArticlePreview from '@/components/articlePreview';
import FeedTemplate from '@/components/feed-template'
import { usePublishedArticles } from '@/hooks/usePublishedData'
import { Loader } from 'lucide-react';
import React from 'react'

function Page() {
    const { weeklyArticles, isSuccess, isLoading } = usePublishedArticles();
    if(isLoading){
        return (
            <div className='base-height flex items-center justify-center'>
                <Loader className='animate-spin'/>
            </div>
        )
    }
  return (
    <div className='py-6 lg:py-8 xl:py-10 '>
    <FeedTemplate>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8'>
            {weeklyArticles.length > 0 && weeklyArticles.map((article) => (
                <ArticlePreview key={article.id} {...article}/>
            ))}
        </div>
    </FeedTemplate>

    </div>
  )
}

export default Page