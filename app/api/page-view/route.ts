import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath || !fs.existsSync(credentialsPath)) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS est invalide ou manquant dans .env");
}
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

function getFormattedDate(monthsAgo: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  return date.toISOString().split("T")[0];
}

export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!propertyId) {
    return NextResponse.json({ error: "GA_PROPERTY_ID est manquant dans .env" }, { status: 500 });
  }

  try {
    console.log("📡 Récupération des données Google Analytics pour /category...");

    const startDate = getFormattedDate(12);
    const endDate = getFormattedDate(0);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "eventCount" }],
      dateRanges: [{ startDate, endDate }],
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