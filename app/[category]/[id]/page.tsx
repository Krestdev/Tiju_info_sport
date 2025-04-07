'use client'
import FeedTemplate from '@/components/feed-template';
import { usePublishedArticles } from '@/hooks/usePublishedData';
import React from 'react';

function ArticlePage({ params }: { params: Promise<{  category: string; id: string; }> }) {
    const {category, id} = React.use(params);
    const {publishedArticles, isLoading, isSuccess} = usePublishedArticles();
    const currentArticle = publishedArticles.find(x=>x.id.toString() === id);
    const currentCategory = publishedArticles.find(x=>x.type.toString() === decodeURIComponent(category));
    console.log(currentArticle);

  return (
    <div className='py-8'>
        <FeedTemplate>
            {isSuccess && currentCategory && currentArticle &&
                <div className='flex flex-col gap-4'>
                    <h1 className='dashboard-heading'>{currentArticle.title}</h1>
                    <img src={currentArticle.images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${currentArticle.images[0].id}`: "/images/no-image.jpg"} alt={currentArticle.title} className="w-full h-auto aspect-video object-cover rounded-md"/>
                </div>
            }
        </FeedTemplate>
    </div>
  )
}

export default ArticlePage;