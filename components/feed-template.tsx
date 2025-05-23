import React from 'react';
import Feed from './feed';
import { cn } from '@/lib/utils';
interface FeedTemplateProps {
    children: React.ReactNode;
    isArticle?:boolean;
}
function FeedTemplate({children, isArticle=false}: FeedTemplateProps) {
  return (
    <main className="containerBloc grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10">
          <div className={cn("flex flex-col gap-10 col-span-1 lg:col-span-2", !isArticle && "order-2 lg:order-1")}>
            {children}
          </div>
          <Feed className={cn(!isArticle && "col-span-1 order-1 lg:order-2")}/>
        </main>
  )
}

export default FeedTemplate