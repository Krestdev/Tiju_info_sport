import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath || !fs.existsSync(credentialsPath)) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS est invalide ou manquant dans .env");
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

function groupByInterval(articleStats: Record<string, Record<string, number>>, interval: string | null) {
  const groupedStats: Record<string, Record<string, number>> = {};

  switch (interval) {
    case "semaine":
      return Object.fromEntries(
        Object.entries(articleStats)
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      );

    case "mois":
      Object.keys(articleStats).forEach((date) => {
        const dt = new Date(date);
        const year = dt.getFullYear();

        const startDate = new Date(dt);
        startDate.setDate(dt.getDate() - dt.getDay() + 1); // Lundi de la semaine
        const startDay = startDate.getDate().toString().padStart(2, '0');
        const startMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // Dimanche de la semaine
        const endDay = endDate.getDate().toString().padStart(2, '0');
        const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');

        const key = `Sem ${startMonth}/${startDay} - ${endMonth}/${endDay}`;
        if (!groupedStats[key]) groupedStats[key] = {};
        Object.entries(articleStats[date]).forEach(([article, vues]) => {
          groupedStats[key][article] = (groupedStats[key][article] || 0) + vues;
        });
      });
      return Object.fromEntries(
        Object.entries(groupedStats)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-4)
        // Garde uniquement les 4 dernières semaines
      );

    case "annee":
      Object.keys(articleStats).forEach((date) => {
        const year = new Date(date).getFullYear();
        const month = new Date(date).getMonth() + 1; // Mois en format numérique (1-12)
        const key = `${year}-${month.toString().padStart(2, '0')}`; // Format YYYY-MM pour un tri correct
        if (!groupedStats[key]) groupedStats[key] = {};
        Object.entries(articleStats[date]).forEach(([article, vues]) => {
          groupedStats[key][article] = (groupedStats[key][article] || 0) + vues;
        });
      });
      return Object.fromEntries(
        Object.entries(groupedStats).sort((a, b) => a[0].localeCompare(b[0]))
      );

    default:
      return articleStats;
  }
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const interval = searchParams.get("interval");
  const startDateParam = searchParams.get("startDate");
  const propertyId = process.env.GA_PROPERTY_ID;
  const fromDateParam = searchParams.get("from");
  const toDateParam = searchParams.get("to");

  if (!propertyId) {
    return NextResponse.json({ error: "GA_PROPERTY_ID est manquant dans .env" }, { status: 500 });
  }

  try {
    console.log(`📡 Récupération des données pour l'intervalle : ${interval}...`);

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
      dimensions: [{ name: "date" }, { name: "pageTitle" }, { name: "pagePath" }],
      metrics: [{ name: "eventCount" }],
      dateRanges: [{ startDate, endDate }],
    });

    const articleStats: Record<string, Record<string, number>> = {};
    const dateList = generateMissingDates(startDate, endDate);

    dateList.forEach((date) => {
      articleStats[date] = {};
    });

    if (response?.rows) {
      response.rows.forEach((row) => {
        const dateValue = row.dimensionValues?.[0]?.value || "00000000";
        const formattedDate = `${dateValue.slice(0, 4)}-${dateValue.slice(4, 6)}-${dateValue.slice(6, 8)}`;
        const title = row.dimensionValues?.[1]?.value || "Titre inconnu";
        const pagePath = row.dimensionValues?.[2]?.value || "";
        const vues = Number(row.metricValues?.[0]?.value || 0);

        if (!pagePath.startsWith("/detail-article")) {
          return;
        }

        if (!title.trim()) {
          console.warn(`⚠️ Article sans titre détecté : ${pagePath}, Ignoré.`);
          return;
        }

        articleStats[formattedDate][title] = (articleStats[formattedDate][title] || 0) + vues;
      });
    }

    Object.keys(articleStats).forEach((date) => {
      if (Object.keys(articleStats[date]).length === 0) {
        articleStats[date]["Aucun article"] = 0;
      }
    });

    const groupedStats = groupByInterval(articleStats, interval);

    return NextResponse.json({ articleStats: groupedStats });
  } catch (error) {
    console.error("❌ Erreur API Google Analytics :", error);
    return NextResponse.json({ error: "Erreur API Google Analytics", details: error }, { status: 500 });
  }
}