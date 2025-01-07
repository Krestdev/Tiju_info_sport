import { Categorie } from "@/data/temps";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getUserFavoriteCategories = (
  categories: Categorie[] | [],
  userId: number
): Categorie[] | [] => {
  const userFavoriteCategories = categories?.filter(categorie =>
      categorie.donnees.some(article =>
          article.like.some(user => user.id === userId)
      )
  );

  const sortedCategories = userFavoriteCategories?.sort((a, b) => {
      const totalLikesA = a.donnees.reduce((sum, article) => sum + article.like.length, 0);
      const totalLikesB = b.donnees.reduce((sum, article) => sum + article.like.length, 0);
      return totalLikesB - totalLikesA;
  });

  return sortedCategories;
};
