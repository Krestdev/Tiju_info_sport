'use client'
import FeedTemplate from '@/components/feed-template';
import { usePublishedArticles } from '@/hooks/usePublishedData';
import { articleDate } from '@/lib/utils';
import React from 'react';

function ArticlePage({ params }: { params: Promise<{  category: string; slug: string; }> }) {
    const {category, slug} = React.use(params);
    const {publishedArticles, isLoading, isSuccess} = usePublishedArticles();
    const currentArticle = publishedArticles.find(x=>x.title.toLocaleLowerCase() === decodeURIComponent(slug).toLocaleLowerCase());
    const currentCategory = publishedArticles.find(x=>x.type.toString() === decodeURIComponent(category));
    console.log(currentArticle);

  return (
    <div className='py-8'>
        <FeedTemplate>
            {isSuccess && currentCategory && currentArticle &&
                <div className='flex flex-col gap-4'>
                    <h1>{currentArticle.title}</h1>
                    <img src={currentArticle.images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${currentArticle.images[0].id}`: "/images/no-image.jpg"} alt={currentArticle.title} className="w-full h-auto aspect-video object-cover rounded-md"/>
                    <p className='text-base sm:text-lg font-medium text-gray-800'>{currentArticle.summery}</p>
                    <div className='flex flex-col gap-2r'>
                        <span className='font-bold text-gray-900'>{currentArticle.author.name}</span>
                        <p className='text-gray-600'>{articleDate(currentArticle.created_at)}</p>
                        {/**Display Update date if the article has been updated */}
                        {currentArticle.updated_at !== currentArticle.created_at && <p className='text-gray-600'>{`Mis à jour le ${new Date(currentArticle.updated_at).toLocaleDateString()}`}</p>}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: currentArticle.description }}/>
                </div>
            }
        </FeedTemplate>
    </div>
  )
}

export default ArticlePage;