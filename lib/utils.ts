
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserFavoriteCategories = (
  categories: Category[],
  userId: number
): Category[] => {
  // Étape 1 : Trier les catégories selon la présence d'un nouvel article
  const sortedCategories = categories.filter(x => x.articles.length > 0).sort((a, b) => {

    // Vérifier les interactions de l'utilisateur (like ou commentaire)
    const aHasInteraction = a.articles.some(article =>
      article.likes ||
      article.comments.some(comment => comment.user?.id === userId)
    );
    const bHasInteraction = b.articles.some(article =>
      article.likes ||
      article.comments.some(comment => comment.user?.id === userId)
    );

    if (aHasInteraction && !bHasInteraction) return -1; // Catégorie avec interaction en premier
    if (!aHasInteraction && bHasInteraction) return 1;

    return 0; // Sinon, conserver l'ordre initial
  });

  // Étape 2 : Trier les articles à l'intérieur de chaque catégorie
  return sortedCategories.map(categorie => {
    const sortedDonnees = categorie.articles.sort((a, b) => {

      const aUserLiked = a.likes
      const bUserLiked = b.likes
      const aUserCommented = a.comments.some(comment => comment.user?.id === userId) ? 1 : 0;
      const bUserCommented = b.comments.some(comment => comment.user?.id === userId) ? 1 : 0;

      if ((aUserLiked || aUserCommented) !== (bUserLiked || bUserCommented)) {
        return (bUserLiked + bUserCommented) - (aUserLiked + aUserCommented);
      }

      const aPopularity = a.likes + a.comments.length;
      const bPopularity = b.likes + b.comments.length;

      return bPopularity - aPopularity; // Les articles les plus populaires en premier
    });

    return { ...categorie, donnees: sortedDonnees };
  });
};


export const isImage = (media: string | undefined): boolean => {
  if (!media) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
};

export function getDateRange(value: string) {
  const today = new Date();
  let startDate: string;
  let endDate: string = today.toISOString().split("T")[0];

  switch (value) {
    case "semaine":
      startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split("T")[0];
      break;

    case "mois":
      startDate = new Date(today.setDate(today.getDate() - 28)).toISOString().split("T")[0];
      break;

    case "annee":
      startDate = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().split("T")[0];
      break;

    default:
      throw new Error("Valeur non valide. Utiliser 'semaine', 'mois' ou 'annee'.");
  }

  return { startDate, endDate };
}