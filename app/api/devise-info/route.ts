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

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function generateMissingDates(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

function getDateRange(interval: string, startDateParam: string | null) {
  const today = new Date();
  const endDate = formatDate(today);
  let startDate: string;

  if (startDateParam) {
    startDate = startDateParam;
  } else {
    switch (interval) {
      case "semaine":
        startDate = formatDate(new Date(today.setDate(today.getDate() - 7)));
        break;
      case "mois":
        startDate = formatDate(new Date(today.setDate(today.getDate() - 30)));
        break;
      case "annee":
        startDate = formatDate(new Date(today.setFullYear(today.getFullYear() - 1)));
        break;
      default:
        throw new Error("Intervalle invalide. Utiliser 'semaine', 'mois' ou 'annee'.");
    }
  }

  return { startDate, endDate };
}

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const interval = searchParams.get("interval");
  const startDateParam = searchParams.get("startDate");
  const propertyId = process.env.GA_PROPERTY_ID;
  const fromDateParam = searchParams.get("from");
  const toDateParam = searchParams.get("to");

  console.log("Récupération des données des appareils...");

  if (!propertyId) {
    return NextResponse.json({ error: "GA_PROPERTY_ID est manquant dans .env" }, { status: 500 });
  }

  try {

    let startDate: string;
    let endDate: string;

    if (fromDateParam && toDateParam) {
      startDate = formatDate(new Date(fromDateParam));
      endDate = formatDate(new Date(toDateParam));
    } else if (interval) {
      ({ startDate, endDate } = getDateRange(interval, startDateParam));

    } else {
      return NextResponse.json({ error: "Veuillez fournir soit `interval`, soit `from` et `to`." }, { status: 400 });
    }

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
