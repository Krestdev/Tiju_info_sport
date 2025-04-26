import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { credentialsPath } from "../keysConfig";

// Interface pour la réponse de l'API Analytics
interface ReponseAnalytics {
  rows?: {
    dimensionValues?: { value?: string }[];
    metricValues?: { value?: string }[];
  }[];
}

// Interface pour les données de catégorie
interface DonneesCategorie {
  title: string;
  vues: number;
}

// Catégories à exclure des résultats
const CATEGORIES_A_EXCLURE = [
  'Connexion',
  'Profil',
  'Unknown',
  'Politique de confidentialité',
  'Article Introuvable',
  'Catégorie Introuvable',
  'Termes et conditions',
  'Test modification'
];

// Vérification des credentials
if (!credentialsPath) {
  throw new Error("Les identifiants Google Analytics sont invalides ou manquants");
}

const clientAnalytics = new BetaAnalyticsDataClient({ credentials: credentialsPath });

/**
 * Formate une date au format YYYY-MM-DD
 * @param date Date à formater
 * @returns Date formatée en string
 */
function formaterDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Filtre les titles pour ne garder que les catégories valides
 * @param title title à vérifier
 * @returns boolean indiquant si le title est une catégorie valide
 */
function estCategorieValide(title: string): boolean {
  const titleNettoye = title.replace(' - Tyju infosports', '').trim();
  const mots = titleNettoye.split(/\s+/);
  
  return (
    mots.length <= 3 &&
    !titleNettoye.includes(':') &&
    /^[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸ]/.test(titleNettoye) &&
    !CATEGORIES_A_EXCLURE.includes(titleNettoye)
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idPropriete = process.env.GA_PROPERTY_ID;
  
  // Vérification de la propriété GA
  if (!idPropriete) {
    return NextResponse.json(
      { erreur: "L'identifiant de propriété GA est manquant" },
      { status: 500 }
    );
  }

  const dateDebut = url.searchParams.get("startDate");
  const dateFin = url.searchParams.get("endDate");

  // Vérification des paramètres de date
  if (!dateDebut || !dateFin) {
    return NextResponse.json(
      { erreur: "Les paramètres startDate et endDate sont requis" },
      { status: 400 }
    );
  }

  try {
    console.log("📡 Récupération des données Google Analytics...");

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    // Validation des dates
    if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
      return NextResponse.json(
        { erreur: "Les dates spécifiées sont invalides" },
        { status: 400 }
      );
    }

    // Requête à l'API Analytics
    const [reponse] = await clientAnalytics.runReport({
      property: `properties/${idPropriete}`,
      dimensions: [
        { name: "pagePath" },
        { name: "pageTitle" }
      ],
      metrics: [{ name: "eventCount" }],
      dateRanges: [{
        startDate: formaterDate(debut),
        endDate: formaterDate(fin)
      }],
    }) as ReponseAnalytics[];

    const vuesParCategorie: Record<string, number> = {};

    // Traitement des résultats
    if (reponse?.rows) {
      reponse.rows.forEach((ligne) => {
        const title = ligne.dimensionValues?.[1]?.value || "Unknown";
        const vues = Number(ligne.metricValues?.[0]?.value || 0);
        vuesParCategorie[title] = (vuesParCategorie[title] || 0) + vues;
      });
    }

    // Formatage et filtrage des résultats
    const categories = Object.entries(vuesParCategorie)
      .filter(([title]) => title.endsWith(' - Tyju infosports'))
      .map(([title, vues]) => ({
        title: title.replace(' - Tyju infosports', '').trim(),
        vues
      }))
      .filter(({ title }) => estCategorieValide(title));

    return NextResponse.json({ categories });
  } catch (erreur) {
    console.error("❌ Erreur API Google Analytics :", erreur);
    return NextResponse.json(
      { erreur: "Erreur lors de la récupération des données Analytics", details: erreur },
      { status: 500 }
    );
  }
}