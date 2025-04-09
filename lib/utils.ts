
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
      article.comments.some(comment => comment.author.id === userId)
    );
    const bHasInteraction = b.articles.some(article =>
      article.likes ||
      article.comments.some(comment => comment.author.id === userId)
    );

    if (aHasInteraction && !bHasInteraction) return -1; // Catégorie avec interaction en premier
    if (!aHasInteraction && bHasInteraction) return 1;

    return 0; // Sinon, conserver l'ordre initial
  });

  // Étape 2 : Trier les articles à l'intérieur de chaque catégorie
  return sortedCategories.map(categorie => {
    const sortedDonnees = categorie.articles.sort((a, b) => {

      const aUserLiked = a.likes.length
      const bUserLiked = b.likes.length
      const aUserCommented = a.comments.some(comment => comment.author.id === userId) ? 1 : 0;
      const bUserCommented = b.comments.some(comment => comment.author.id === userId) ? 1 : 0;

      if ((aUserLiked || aUserCommented) !== (bUserLiked || bUserCommented)) {
        return (bUserLiked + bUserCommented) - (aUserLiked + aUserCommented);
      }

      const aPopularity = a.likes.length + a.comments.length;
      const bPopularity = b.likes.length + b.comments.length;

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

export function defineTitle(title:string) {
  return `${title} - Tyjuinfosport`
}

export function sortArticles(articles:Article[]){
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime(); // Convert to timestamp
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA; // Newest first (descending)
  })
}

//Display article date
export function articleDate(value: string): string {
  const date = new Date(value);
  const today = new Date();
  
  // Vérifier si la date est invalide
  if (isNaN(date.getTime())) {
    return "Date inconnue";
  }

  // Calculer les différences de temps
  const diffInMilliseconds = today.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Formater les options de date
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long' 
  };

  // Ajouter l'année si différente de l'année en cours
  if (date.getFullYear() !== today.getFullYear()) {
    options.year = 'numeric';
  }

  // Déterminer le format approprié
  if (diffInDays === 0) {
    // Aujourd'hui
    if (diffInHours < 1) {
      if (diffInMinutes < 1) {
        return "Publié à l'instant";
      }
      return `Publié il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }
    return `Publié il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else if (diffInDays === 1) {
    return "Publié hier";
  } else if (diffInDays < 7) {
    return `Publié il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  } else {
    // Format de date classique
    return `Publié le ${date.toLocaleDateString('fr-FR', options)}`;
  }
}


//Slug generator
export function slugify(text: string): string {
  return text
    .toLowerCase() // Tout en minuscule
    .normalize("NFD") // Sépare les lettres accentuées
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, "") // Supprime les caractères spéciaux sauf espaces et tirets
    .trim() // Supprime les espaces au début/fin
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/-+/g, "-"); // Évite les tirets doubles
}

//Return the first word in a string
export function getFirstWord(name: string): string {
  if (!name) return '';
  
  // Gestion des espaces multiples, tabulations, etc.
  const firstWord = name.trim().split(/\s+/)[0];
  
  // Optionnel : supprime la ponctuation attachée au mot
  return firstWord.replace(/[.,;!?]+$/, '');
}