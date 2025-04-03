import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";
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
