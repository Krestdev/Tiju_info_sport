import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// ... tes imports (assure-toi d'avoir runtime = 'nodejs' si besoin comme vu avant)

// Force Node.js runtime pour éviter l'erreur DNS
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORIES_A_EXCLURE = [
  'Connexion', 'Profil', 'Unknown', 'Politique-de-confidentialite', 
  'Termes-et-conditions', 'Wp-admin', 'Wp-login', '404'
];

const clientAnalytics = new BetaAnalyticsDataClient({ 
    // Utilise de préférence les variables d'env ici comme conseillé précédemment
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }
});

function formaterDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Fonction utilitaire pour mettre la 1ère lettre en majuscule
const capitaliser = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idPropriete = process.env.GA_PROPERTY_ID;
  const dateDebut = url.searchParams.get("startDate");
  const dateFin = url.searchParams.get("endDate");

  if (!idPropriete || !dateDebut || !dateFin) {
    return NextResponse.json({ erreur: "Paramètres manquants" }, { status: 400 });
  }

  try {
    const [reponse] = await clientAnalytics.runReport({
      property: `properties/${idPropriete}`,
      dimensions: [
        { name: "pagePath" } // On se concentre sur l'URL maintenant
      ],
      metrics: [{ name: "screenPageViews" }], // 'screenPageViews' est souvent plus précis que 'eventCount' pour les pages vues
      dateRanges: [{
        startDate: formaterDate(new Date(dateDebut)),
        endDate: formaterDate(new Date(dateFin))
      }],
    });

    const vuesParCategorie: Record<string, number> = {};

    if (reponse?.rows) {
      reponse.rows.forEach((ligne) => {
        const path = ligne.dimensionValues?.[0]?.value || "";
        const vues = Number(ligne.metricValues?.[0]?.value || 0);

        // LOGIQUE : On nettoie le path pour trouver la catégorie
        // Ex: "/actu/mon-article" devient ["", "actu", "mon-article"]
        const segments = path.split('/').filter(p => p.length > 0);

        // Si c'est la home page "/", segments est vide
        if (segments.length === 0) return;

        // On prend le premier dossier comme catégorie (ex: "actu")
        let categorieBrute = segments[0].toLowerCase();
        
        // Nettoyage optionnel (enlever query params s'il y en a)
        categorieBrute = categorieBrute.split('?')[0];

        // On capitalise pour l'affichage : "actu" -> "Actu"
        const categorieTitre = capitaliser(categorieBrute);

        // Exclusion des pages techniques ou indésirables
        if (!CATEGORIES_A_EXCLURE.includes(categorieTitre) && categorieTitre.length > 2) {
             vuesParCategorie[categorieTitre] = (vuesParCategorie[categorieTitre] || 0) + vues;
        }
      });
    }

    // Transformation en tableau pour ton graph
    const categories = Object.entries(vuesParCategorie)
      .map(([title, vues]) => ({ title, vues }))
      .sort((a, b) => b.vues - a.vues); // Tri par popularité

    return NextResponse.json({ categories });

  } catch (erreur) {
    // 💡 REGARDE CE QUE CELA AFFICHE DANS LA CONSOLE SERVEUR
    console.error("❌ Erreur API Google Analytics DÉTAILLÉE :", erreur); 
    
    // Pour ne pas renvoyer de "details: {}", nous allons formater l'erreur
    const message = (erreur as Error)?.message || JSON.stringify(erreur);

    return NextResponse.json(
      { erreur: "Erreur lors de la récupération des données Analytics", details: message },
      { status: 500 }
    );
  }
}