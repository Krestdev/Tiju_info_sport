'use client'
import { useAds } from "@/hooks/useAds";
import { usePublishedArticles } from "@/hooks/usePublishedData";
import Advertisement from "./advertisement";
import ArticlePreview from "./articlePreview";
import { Skeleton } from "./ui/skeleton";

interface feedProps {
  className?: string;
}

function Feed({ className }: feedProps) {
  const { isLoading, isSuccess, weeklyArticles, headline } =
    usePublishedArticles();
  const ads = useAds();
  //console.log(weeklyArticles)

  if (isSuccess) {
    return (
      <div className={`flex flex-col gap-7 ${className}`}>
        {headline.length > 0 && (
          <div className="flex flex-col order-1">
            <div className="border-b">
              <h3 className="w-fit uppercase font-oswald text-xl text-white py-2 px-4 bg-red-700">
                {"à la une"}
              </h3>
            </div>
            <div className="grid divide-y">
                {headline.slice(0, 4).map((article) => (
                <ArticlePreview
                    key={article.id}
                    version="text-only"
                    {...article}
                />
                ))}
            </div>
          </div>
        )}
        {weeklyArticles.length > 0 && (
          <div className="flex flex-col order-3 lg:order-2">
            <div className="border-b">
              <h3 className="w-fit uppercase font-oswald text-xl text-white py-2 px-4 bg-green-500">
                {"cette semaine"}
              </h3>
            </div>
            <div className="grid divide-y">
                {weeklyArticles.slice(0, 4).map((article) => (
                <ArticlePreview
                    key={article.id}
                    version="text-only"
                    {...article}
                />
                ))}
            </div>
          </div>
        )}
        { ads.randomSquare && <Advertisement variant="square" className="order-2 lg:order-3" {...ads.randomSquare}/>}
      </div>
    );
  }
  if (isLoading) {
    <div className={`flex flex-col gap-7 ${className}`}>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex flex-col">
          <Skeleton className="w-full h-10" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 py-4">
              <Skeleton className="w-14 h-5" />
              <Skeleton className="w-full h-11" />
            </div>
          ))}
        </div>
      ))}
    </div>;
  }
}

export default Feed;
