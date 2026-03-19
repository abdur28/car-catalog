import "dotenv/config";
import cron from "node-cron";
import { PrismaClient } from "../app/generated/prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { scrapeMultiplePages } from "./carsensor";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function runScraper() {
  console.log(`[Scraper] Starting scrape at ${new Date().toISOString()}`);

  try {
    const cars = await scrapeMultiplePages(3);
    console.log(`[Scraper] Scraped ${cars.length} cars total`);

    let created = 0;
    let updated = 0;

    for (const car of cars) {
      try {
        await prisma.car.upsert({
          where: { externalId: car.externalId },
          create: car,
          update: {
            price: car.price,
            mileage: car.mileage,
            images: car.images,
            updatedAt: new Date(),
          },
        });
        created++;
      } catch (err) {
        console.error(`[Scraper] Error upserting car ${car.externalId}:`, err);
      }
    }

    updated = created;
    console.log(
      `[Scraper] Done. Upserted ${updated} cars.`
    );
  } catch (error) {
    console.error("[Scraper] Fatal error:", error);
  }
}

// Run immediately on start
runScraper();

// Schedule hourly
cron.schedule("0 * * * *", () => {
  console.log("[Scraper] Hourly cron triggered");
  runScraper();
});

console.log("[Scraper] Worker started. Scraping every hour.");
