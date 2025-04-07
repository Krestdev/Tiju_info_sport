'use client'
import ArticlePreview from '@/components/articlePreview';
import Feed from '@/components/feed';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublishedArticles } from '@/hooks/usePublishedData'
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'

function Page({ params }: { params: { category: string } }) {
    const { isLoading, isSuccess, categories, publishedArticles } = usePublishedArticles();
    React.useEffect(()=>{
        isSuccess && console.log(categories);
    },[isSuccess])
    
  return (
    <main className='py-8'>
        {isSuccess && categories.some(x=>x.title.toLocaleLowerCase() === params.category.toLocaleLowerCase()) && 
            publishedArticles.filter(x=>x.type.toLocaleLowerCase()===params.category.toLocaleLowerCase()).length > 0 ? 
            <div className="containerBloc grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10">
                <div className="flex flex-col gap-10 col-span-1 lg:col-span-2 order-2 lg:order-1">
                    <div className="hidden lg:block">
                        <ArticlePreview version="main" {...publishedArticles.filter(x=>x.type.toLocaleLowerCase()===params.category.toLocaleLowerCase())[0]}/>
                    </div>
              {/**Articles map */}
                  {publishedArticles.filter(x=>x.type.toLocaleLowerCase()===params.category.toLocaleLowerCase()).length > 1 ?
              <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
                  {publishedArticles.filter(x=>x.type.toLocaleLowerCase()===params.category.toLocaleLowerCase()).slice(0,6).map(article=>(
                      <ArticlePreview key={article.id} {...article} />
                  ))}  
              </div>
                  : <div className="w-full min-h-80 flex items-center justify-center"><span className="text-lg sm:text-xl lg:text-2xl">{"Aucun article à afficher"}</span></div>}
              {/* { ads.isLoading && <Skeleton className="w-full h-[200px]" />}
              { ads.isSuccess && ads.data.data.length > 0 &&  <Link href={ads.data.data[randomAd].url}><div className="w-full h-[200px] bg-repeat-x bg-contain" style={{backgroundImage: `url(${process.env.NEXT_PUBLIC_API}image/${ads.data.data[randomAd].image.id})`}} /></Link>} */}
            </div>
            <Feed className="col-span-1 order-1 lg:order-2"/>
          </div> : "Aucun article à afficher"
         }
    </main>
  )
}

export default Page