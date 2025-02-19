import { Categorie } from "@/data/temps";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserFavoriteCategories = (
  categories: Categorie[],
  userId: number
): Categorie[] => {
  // Étape 1 : Trier les catégories selon la présence d'un nouvel article
  const sortedCategories = categories.sort((a, b) => {

    // Vérifier les interactions de l'utilisateur (like ou commentaire)
    const aHasInteraction = a.donnees.some(article =>
      article.like.some(user => user.id === userId) ||
      article.commentaire.some(comment => comment.user?.id === userId)
    );
    const bHasInteraction = b.donnees.some(article =>
      article.like.some(user => user.id === userId) ||
      article.commentaire.some(comment => comment.user?.id === userId)
    );

    if (aHasInteraction && !bHasInteraction) return -1; // Catégorie avec interaction en premier
    if (!aHasInteraction && bHasInteraction) return 1;

    return 0; // Sinon, conserver l'ordre initial
  });

  // Étape 2 : Trier les articles à l'intérieur de chaque catégorie
  return sortedCategories.map(categorie => {
    const sortedDonnees = categorie.donnees.sort((a, b) => {

      const aUserLiked = a.like.some(user => user.id === userId) ? 1 : 0;
      const bUserLiked = b.like.some(user => user.id === userId) ? 1 : 0;
      const aUserCommented = a.commentaire.some(comment => comment.user?.id === userId) ? 1 : 0;
      const bUserCommented = b.commentaire.some(comment => comment.user?.id === userId) ? 1 : 0;

      if ((aUserLiked || aUserCommented) !== (bUserLiked || bUserCommented)) {
        return (bUserLiked + bUserCommented) - (aUserLiked + aUserCommented);
      }

      const aPopularity = a.like.length + a.commentaire.length;
      const bPopularity = b.like.length + b.commentaire.length;

      return bPopularity - aPopularity; // Les articles les plus populaires en premier
    });

    return { ...categorie, donnees: sortedDonnees };
  });
};
