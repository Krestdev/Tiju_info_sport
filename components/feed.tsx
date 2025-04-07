import { usePublishedArticles } from "@/hooks/usePublishedData";
import { Skeleton } from "./ui/skeleton";
import ArticlePreview from "./articlePreview";

interface feedProps {
  className?: string;
}

function Feed({ className }: feedProps) {
  const { isLoading, isSuccess, todayArticles, mainArticles } =
    usePublishedArticles();

  if (isSuccess) {
    return (
      <div className={`grid gap-7 ${className}`}>
        {mainArticles.length > 0 && (
          <div className="flex flex-col">
            <div className="border-b">
              <h3 className="w-fit uppercase font-oswald text-xl text-white py-2 px-4 bg-red-700">
                {"à la une"}
              </h3>
            </div>
            <div className="grid divide-y">
                {mainArticles.slice(0, 4).map((article) => (
                <ArticlePreview
                    key={article.id}
                    version="text-only"
                    {...article}
                />
                ))}
            </div>
          </div>
        )}
        {todayArticles.length > 0 && (
          <div className="flex flex-col">
            <div className="border-b">
              <h3 className="w-fit uppercase font-oswald text-xl text-white py-2 px-4 bg-green-500">
                {"aujourd'hui"}
              </h3>
            </div>
            <div className="grid divide-y">
                {todayArticles.slice(0, 4).map((article) => (
                <ArticlePreview
                    key={article.id}
                    version="text-only"
                    {...article}
                />
                ))}
            </div>
          </div>
        )}
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
