import ArticlePreview from '@/components/articlePreview';
import FeedTemplate from '@/components/feed-template';
import ShareArticle from '@/components/shareArticle';
import { Button } from '@/components/ui/button';
import { articleDate, defineTitle, sortArticles } from '@/lib/utils';
import { ThumbsUp } from 'lucide-react';

// lib/metadata.ts
import Comment from '@/components/comment-display';
import { fetchCategory } from '@/lib/api';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{  category: string; slug: string; }> }): Promise<Metadata> {
    const {category, slug} = await params;
    const categories = await fetchCategory();
    const publishedArticles = sortArticles(categories.filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles).filter(x=>x.status==="published"));
    const currentCategory = categories.find(x=>x.slug.toLocaleLowerCase()===decodeURIComponent(category).toLocaleLowerCase());
    const currentArticle = publishedArticles.find(y=>y.slug.toLocaleLowerCase()===decodeURIComponent(slug).toLocaleLowerCase());
    if(currentArticle){
        return {
          title: defineTitle(currentArticle.title),
          description: currentArticle.summery,
          openGraph: {
            images: currentArticle.images.length > 0 
              ? `${process.env.NEXT_PUBLIC_API}image/${currentArticle.images[0].id}`
              : '/images/no-image.jpg'
          }
        };
    } else {
        return {
            title: defineTitle("Article Introuvable"), 
        }
    }
  }

async function ArticlePage({ params }: { params: Promise<{  category: string; slug: string; }> }) {
    const {category, slug} = await params;
    const categories = await fetchCategory();
    const publishedArticles = sortArticles(categories.filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles).filter(x=>x.status==="published"));
    const currentCategory = categories.find(x=>x.slug.toLocaleLowerCase()===decodeURIComponent(category).toLocaleLowerCase());
    const currentArticle = publishedArticles.find(y=>y.slug.toLocaleLowerCase()===decodeURIComponent(slug).toLocaleLowerCase());


  return (
    <div className='py-8'>
        <FeedTemplate isArticle>
            { currentCategory && currentArticle &&
                <div className='flex flex-col gap-4'>
                    <h1>{currentArticle.title}</h1>
                    <p>{currentArticle.summery}</p>
                    <div className='flex flex-col gap-2r'>
                        <span className='font-bold text-gray-900'>{currentArticle.author.name}</span>
                        <p className='text-gray-600'>{currentArticle.publish_on.length > 0 ? articleDate(currentArticle.publish_on) : articleDate(currentArticle.created_at)}</p>
                        {/**Display Update date if the article has been updated */}
                        {currentArticle.updated_at !== currentArticle.created_at && <p className='text-gray-600'>{`Mis à jour le ${new Date(currentArticle.updated_at).toLocaleDateString()}`}</p>}
                    </div>
                    <img src={currentArticle.images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${currentArticle.images[0].id}`: "/images/no-image.jpg"} alt={currentArticle.title} className="w-full h-auto aspect-video object-cover rounded-md"/>
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
                    {/**Comments here */}
                    {currentArticle.comments.length > 0 &&  
                    <div className='flex flex-col'>
                        {currentArticle.comments.map(x=><Comment key={x.id} comment={x}/>)}
                    </div>
                    }
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