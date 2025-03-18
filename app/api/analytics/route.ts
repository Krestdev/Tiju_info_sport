import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS est manquant dans .env");
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

export async function GET(req: Request) {
  const propertyId = process.env.GA_PROPERTY_ID;

  console.log("Récuperation des vues du site...");
  

  // Récupérer les paramètres de l'URL
  const url = new URL(req.url);
  const startDate = url.searchParams.get("startDate") || "7daysAgo"; 
  const endDate = url.searchParams.get("endDate") || "today"; 


  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: "eventCount" }],
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erreur API Google Analytics :", error);
    return NextResponse.json({ error: "Erreur API Google Analytics", details: error }, { status: 500 });
  }
}
