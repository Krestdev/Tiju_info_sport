import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath || !fs.existsSync(credentialsPath)) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS est invalide ou manquant dans .env");
}
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

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

    const categoryViews: Record<string, number> = {};

    if (response?.rows) {
      response.rows.forEach((row) => {
        const title = row.dimensionValues?.[1]?.value || "Unknown";
        const vues = Number(row.metricValues?.[0]?.value || 0);

        if (title.includes("category ")) {
          categoryViews[title] = (categoryViews[title] || 0) + vues;
        }
      });
    }

    const categories = Object.entries(categoryViews).map(([title, vues]) => ({ title, vues }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.log("❌ Erreur API Google Analytics :", error);
    return NextResponse.json({ error: "Erreur API Google Analytics", details: error }, { status: 500 });
  }
}
