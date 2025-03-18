import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";
import { subDays, format } from "date-fns";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS est manquant dans .env");
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

export async function GET(req: Request) {
  const propertyId = process.env.GA_PROPERTY_ID;

  console.log("Récupération des données des appareils...");

  const url = new URL(req.url);
  const value = url.searchParams.get("value");

  let daysAgo;
  switch (value) {
    case "annee":
      daysAgo = 365;
      break;
    case "mois":
      daysAgo = 30;
      break;
    case "semaine":
      daysAgo = 7;
      break;
    default:
      return NextResponse.json(
        { error: "Valeur invalide. Utiliser 'annee', 'mois' ou 'semaine'." },
        { status: 400 }
      );
  }

  const startDate = format(subDays(new Date(), daysAgo), "yyyy-MM-dd");
  const endDate = format(new Date(), "yyyy-MM-dd");

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
    });

    const defaultDeviceData = {
      desktop: 0,
      tablet: 0,
      mobile: 0,
    };

    response.rows?.forEach(row => {
      const device = row.dimensionValues?.[0]?.value || "unknown";
      const users = parseInt(row.metricValues?.[0]?.value || "0", 10);

      if (device in defaultDeviceData) {
        defaultDeviceData[device as keyof typeof defaultDeviceData] = users;
      }
    });

    const deviceData = [
      { device: "desktop", users: defaultDeviceData.desktop },
      { device: "tablet", users: defaultDeviceData.tablet },
      { device: "mobile", users: defaultDeviceData.mobile },
    ];

    console.log(deviceData);
    
    return NextResponse.json(deviceData);
  } catch (error) {
    console.error("Erreur API Google Analytics :", error);
    return NextResponse.json(
      { error: "Erreur API Google Analytics", details: error },
      { status: 500 }
    );
  }
}
