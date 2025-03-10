import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";

// Vérifie si la clé API existe
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS est manquant dans .env");
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

// Initialise Google Analytics
const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

export async function GET(req: Request) {
  const propertyId = process.env.GA_PROPERTY_ID;
  
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [{ name: "activeUsers" }],
    });

    console.log("Données reçues :", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Erreur API Google Analytics :", error);
    return NextResponse.json({ error: "Erreur API Google Analytics", details: error }, { status: 500 });
  }
}
