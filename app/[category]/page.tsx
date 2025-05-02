import ArticleBento from '@/components/article-bento';
import ArticlePreview from '@/components/articlePreview';
import CategoryBreadcrumb from '@/components/breadcrumb-category';
import FeedTemplate from '@/components/feed-template';
import { fetchCategory, fetchPages } from '@/lib/api';
import { sortArticles } from '@/lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ category: string; }> }): Promise<Metadata> {
    const {category} = await params;
    const categories = await fetchCategory();
    const pages = await fetchPages();
    const currentPage = pages.find(x=>x.title.toLocaleLowerCase() === "ressources")?.content.find(y=>y.url === decodeURIComponent(category));
    const currentCategory = categories.find(x=>x.slug.toLocaleLowerCase()===decodeURIComponent(category).toLocaleLowerCase());
    if(!!currentPage){
        return {
            title: currentPage.title,
        };
    }
    if(currentCategory){
        return {
          title: currentCategory.title,
          description: currentCategory.description,
        };
    } else {
        return {
            title: "Page Introuvable", 
        }
    }
  }

async function Page({ params }: { params: Promise<{ category: string }> }) {
    const {category} = await params;
    const categories = await fetchCategory();
    const currentCategory = categories.find(x=>x.slug.toLocaleLowerCase() === decodeURIComponent(category).toLocaleLowerCase());
    const currentPublishedArticles = sortArticles(categories.filter(y=>y.id === currentCategory?.id || y.parent===currentCategory?.id).filter(cat => cat.articles.length > 0).flatMap(cat => cat.articles).filter(x=>x.status==="published"));

    const moreCategories = categories.filter(x=>x.id !== currentCategory?.id && x.parent !== currentCategory?.parent && x.parent!==currentCategory?.id && x.articles.filter(y=>y.status==="published").length > 2);
    //console.log(currentCategory);

    const pages = await fetchPages();
    const currentPage = pages.find(x=>x.title.toLocaleLowerCase() === "ressources")?.content.find(y=>y.url === decodeURIComponent(category));
    
  return (
    <div className='py-8'>
        {!!currentPage &&
            <div dangerouslySetInnerHTML={{__html: currentPage.content}} className='containerBloc base-height flex flex-col gap-2'/>
         }
        {!!currentCategory && 
            //publishedArticles.filter(x=>x.type.toLocaleLowerCase()===currentCategory.title.toLocaleLowerCase()).length > 0 ? 
            currentPublishedArticles.length > 0 ?
            <>
            <div className="containerBloc py-3"><CategoryBreadcrumb category={currentCategory}/></div>
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
                    {currentPublishedArticles.slice(1).map(article=>(
                        <ArticlePreview key={article.id} {...article} />
                    ))}  
                </div>
                }
            </FeedTemplate>
            {moreCategories.length > 0 && 
            <div>{moreCategories.sort(() => Math.random() - 0.5).slice(0,3).map(x=><ArticleBento data={x} key={x.id}/>)}</div>}
            </>
            : !!currentCategory && currentPublishedArticles.length === 0 && 
            <FeedTemplate>
                <div className='flex flex-col gap-4 sm:gap-6 base-height'>
                    <img src='/icons/no-results.png' alt='vide' className='mx-auto max-w-40 w-full h-auto opacity-40 mt-6 lg:mt-10' />
                    <p className='text-lg sm:text-xl lg:text-2xl text-center'>{"Aucun article trouvé"}</p>
                </div>
            </FeedTemplate>
         }
         {
            currentPage === undefined && currentCategory === undefined &&
            notFound()
         }
    </div>
  )
}
export default Page