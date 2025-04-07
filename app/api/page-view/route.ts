import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { credentialsPath } from "../keysConfig";

// const credentialsPath = {
//   "type": process.env.TYPE,
//   "project_id": process.env.PROJECT_ID,
//   "private_key_id": process.env.PRIVATE_KEY_ID,
//   "private_key": process.env.PRIVATE_KEY,
//   "client_email": process.env.CLIENT_EMAIL,
//   "client_id": process.env.CLIENT_ID,
//   "auth_uri": process.env.AUTH_URI,
//   "token_uri": process.env.TOKEN_URI,
//   "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
//   "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
//   "universe_domain": process.env.UNIVERSE_DOMAIN,
// };

if (!credentialsPath) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS est invalide ou manquant dans .env");
}
const credentials = credentialsPath;


const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

function getFormattedDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!propertyId) {
    return NextResponse.json({ error: "GA_PROPERTY_ID est manquant dans .env" }, { status: 500 });
  }

  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "Les paramètres startDate et endDate sont requis" }, { status: 400 });
  }

  try {
    console.log("📡 Récupération des données Google Analytics pour /category...");

    // Si les dates ne sont pas au bon format, retourner une erreur
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Les dates spécifiées sont invalides" }, { status: 400 });
    }

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "eventCount" }],
      dateRanges: [{ startDate: getFormattedDate(start), endDate: getFormattedDate(end) }],
    });

    const categoriesiews: Record<string, number> = {};

    if (response?.rows) {
      response.rows.forEach((row) => {
        const title = row.dimensionValues?.[1]?.value || "Unknown";
        const vues = Number(row.metricValues?.[0]?.value || 0);

        if (title.includes("category ")) {
          categoriesiews[title] = (categoriesiews[title] || 0) + vues;
        }
      });
    }

    const categories = Object.entries(categoriesiews).map(([title, vues]) => ({ title, vues }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.log("❌ Erreur API Google Analytics :", error);
    return NextResponse.json({ error: "Erreur API Google Analytics", details: error }, { status: 500 });
  }
}
