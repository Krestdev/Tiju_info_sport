import ArticlePreview from '@/components/articlePreview';
import FeedTemplate from '@/components/feed-template';
import { fetchCategory } from '@/lib/api';
import { sortArticles } from '@/lib/utils';
import { notFound } from 'next/navigation';

async function Page({ params }: { params: Promise<{ category: string }> }) {
    const {category} = await params;
    const categories = await fetchCategory();
    const currentCategory = categories.find(x=>x.slug.toLocaleLowerCase() === decodeURIComponent(category).toLocaleLowerCase());
    const currentPublishedArticles = sortArticles(categories.filter(y=>y.id === currentCategory?.id || y.parent===currentCategory?.id).filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles).filter(x=>x.status==="published"));
    //const publishedArticles = sortArticles(categories.filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles).filter(x=>x.status==="published"));
    
  return (
    <div className='py-8'>
        {currentCategory ? 
            //publishedArticles.filter(x=>x.type.toLocaleLowerCase()===currentCategory.title.toLocaleLowerCase()).length > 0 ? 
            currentPublishedArticles.length > 0 ?
            <>
            <div className='block lg:hidden mb-10'>
                <ArticlePreview version="main" {...currentPublishedArticles[0]}/>
            </div>
            <FeedTemplate>
                        <div className="hidden lg:block">
                            <ArticlePreview version="main" {...currentPublishedArticles[0]}/>
                        </div>
                {/**Articles map */}
                    {currentPublishedArticles.length > 1 &&
                <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
                    {currentPublishedArticles.slice(0,6).map(article=>(
                        <ArticlePreview key={article.id} {...article} />
                    ))}  
                </div>
                }
            </FeedTemplate> 
            </>
            : "vide"
            : notFound()
         }
    </div>
  )
}
export default Page