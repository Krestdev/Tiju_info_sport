'use client'
import ArticlePreview from '@/components/articlePreview';
import FeedTemplate from '@/components/feed-template';
import ShareArticle from '@/components/shareArticle';
import { Button } from '@/components/ui/button';
import { usePublishedArticles } from '@/hooks/usePublishedData';
import { articleDate } from '@/lib/utils';
import { Share2, ThumbsUp } from 'lucide-react';
import React from 'react';

// lib/metadata.ts
import { Metadata } from 'next';

export function generateArticleMetadata(
  article: Article,
  category: { slug: string }
): Metadata {
  const imageUrl = article.images.length > 0 
    ? `${process.env.NEXT_PUBLIC_API}image/${article.images[0].id}`
    : '/images/no-image.jpg';

  return {
    title: `${article.title} | Nom de votre site`,
    description: article.summery,
    openGraph: {
      title: article.title,
      description: article.summery,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_HOST}${category.slug}/${article.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summery,
      images: [imageUrl],
    },
  };
}

function ArticlePage({ params }: { params: Promise<{  category: string; slug: string; }> }) {
    const {category, slug} = React.use(params);
    const {categories, publishedArticles, isLoading, isSuccess} = usePublishedArticles();
    const currentArticle = publishedArticles.find(x=>x.slug.toLocaleLowerCase() === decodeURIComponent(slug).toLocaleLowerCase());
    const currentCategory = categories.find(x=>x.slug.toLocaleLowerCase()===decodeURIComponent(category).toLocaleLowerCase()) //publishedArticles.find(x=>x.type.toString() === decodeURIComponent(category));
    console.log(currentArticle);

  return (
    <div className='py-8'>
        <FeedTemplate>
            {isSuccess && currentCategory && currentArticle &&
                <div className='flex flex-col gap-4'>
                    <h1>{currentArticle.title}</h1>
                    <img src={currentArticle.images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${currentArticle.images[0].id}`: "/images/no-image.jpg"} alt={currentArticle.title} className="w-full h-auto aspect-video object-cover rounded-md"/>
                    <p className='leading-[130%] text-[16px] sm:text-[18px] font-bold text-gray-800'>{currentArticle.summery}</p>
                    <div className='flex flex-col gap-2r'>
                        <span className='font-bold text-gray-900'>{currentArticle.author.name}</span>
                        <p className='text-gray-600'>{currentArticle.publish_on.length > 0 ? articleDate(currentArticle.publish_on) : articleDate(currentArticle.created_at)}</p>
                        {/**Display Update date if the article has been updated */}
                        {currentArticle.updated_at !== currentArticle.created_at && <p className='text-gray-600'>{`Mis à jour le ${new Date(currentArticle.updated_at).toLocaleDateString()}`}</p>}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: currentArticle.description }}/>
                    {/**Share Comment Like */}
                    <div className='flex flex-wrap justify-between gap-4 items-center'>
                        <span className='inline-flex gap-4 items-center'>
                            <ShareArticle articleUrl={`${process.env.NEXT_PUBLIC_HOST}${currentCategory.slug}/${currentArticle.slug}`} article={currentArticle}/>
                            <Button variant={"outline"} size={"icon"}><ThumbsUp/></Button>
                            <Button>{"commenter"}</Button>
                        </span>
                        <span className='leading-[130%] font-semibold text-black text-[16px] md:text-[18px]'>{currentArticle.comments.length>1 ? `${currentArticle.comments.length} Commentaires` : currentArticle.comments.length===1 ? "1 Commentaire" : "Aucun commentaire"}</span>
                    </div>
                    {/**More articles */}
                    { currentCategory.articles.filter(x=>x.status==="published" && x.id !== currentArticle.id).length>0 && (
                        <div className='mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2'>
                            {currentCategory.articles.filter(x=>x.status==="published" && x.id !== currentArticle.id).map(article=><ArticlePreview key={article.id} {...article}/>)}
                        </div>
                    ) }
                </div>
            }
        </FeedTemplate>
    </div>
  )
}

export default ArticlePage;