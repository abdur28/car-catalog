import axios from "axios";
import * as cheerio from "cheerio";
import {
  translateBrand,
  translateTransmission,
  translateBodyType,
  translateColor,
} from "../lib/translations";

const BASE_URL = "https://www.carsensor.net";
const SEARCH_URL = `${BASE_URL}/usedcar/index.html`;

interface ScrapedCar {
  externalId: string;
  brand: string;
  brandJp: string;
  model: string;
  modelJp: string;
  year: number | null;
  mileage: number | null;
  mileageUnit: string;
  price: number | null;
  priceCurrency: string;
  engineSize: string | null;
  transmission: string | null;
  fuelType: string | null;
  color: string | null;
  bodyType: string | null;
  location: string | null;
  description: string | null;
  url: string | null;
  images: string[];
}

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "ja,en;q=0.9",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

// Helper: extract spec value from the specList by matching the dt label text
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSpec($el: any, $: any, label: string): string {
  let value = "";
  $el.find("dl.specList .specList__detailBox").each((_: number, box: unknown) => {
    const dt = $(box).find("dt").text().trim();
    if (dt.includes(label)) {
      value = $(box).find("dd").text().trim();
    }
  });
  return value;
}

export async function scrapeListPage(
  page: number = 1
): Promise<ScrapedCar[]> {
  const url = page === 1 ? SEARCH_URL : `${BASE_URL}/usedcar/index${page}.html`;

  console.log(`[Scraper] Fetching page ${page}: ${url}`);

  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 30000 });
    const $ = cheerio.load(data);
    const cars: ScrapedCar[] = [];

    $("div.cassetteWrap").each((_index, element) => {
      try {
        const $el = $(element);

        // External ID from cassette div id attribute (e.g. "AU6854621912_cas")
        const cassetteId = $el.find(".cassette").attr("id") || "";
        const externalId = cassetteId.replace("_cas", "") || `cs-${Date.now()}-${_index}`;

        // Detail link
        const linkEl = $el.find('a[href*="/usedcar/detail/"]').first();
        const href = linkEl.attr("href") || "";
        const fullUrl = href ? `${BASE_URL}${href}` : null;

        // Brand — bare <p> right after .cassetteMain__label
        const brandJp = $el
          .find(".cassetteMain__carInfoContainer > .cassetteMain__label")
          .first()
          .next("p")
          .text()
          .trim();
        const brand = translateBrand(brandJp) || brandJp;

        // Model — from title link text, first token before &nbsp;
        const titleRaw = $el.find("h3.cassetteMain__title a").first().text().trim();
        // Title format: "デイズ 660 X 届出済未使用車..." — first word is model
        const titleParts = titleRaw.split(/\s+/);
        const modelJp = titleParts[0] || titleRaw;
        const model = modelJp;
        const description = titleRaw;

        // Specs from specList
        const yearText = getSpec($el, $, "年式");
        const yearMatch = yearText.match(/(\d{4})/);
        const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

        const mileageText = getSpec($el, $, "走行距離");
        // mileageText e.g. "9km" or "3.5万km"
        let mileage: number | null = null;
        const manKmMatch = mileageText.match(/([\d.]+)万/);
        if (manKmMatch) {
          mileage = Math.round(parseFloat(manKmMatch[1]) * 10000);
        } else {
          const kmMatch = mileageText.match(/([\d,]+)\s*km/i);
          if (kmMatch) {
            mileage = parseInt(kmMatch[1].replace(/,/g, ""), 10);
          }
        }

        const engineSize = getSpec($el, $, "排気量") || null;

        const transmissionJp = getSpec($el, $, "ミッション");
        const transmission = transmissionJp ? translateTransmission(transmissionJp) : null;

        // Price — basePrice (body price)
        const mainPrice = $el.find("span.basePrice__mainPriceNum").first().text().trim();
        const subPrice = $el.find("span.basePrice__subPriceNum").first().text().trim();
        let price: number | null = null;
        if (mainPrice) {
          const priceNum = parseFloat(mainPrice + subPrice);
          if (!isNaN(priceNum)) {
            price = Math.round(priceNum * 10000); // 万円 → 円
          }
        }

        // Body type and color from carBodyInfoList
        const bodyItems: string[] = [];
        $el.find(".carBodyInfoList .carBodyInfoList__item").each((_, item) => {
          bodyItems.push($(item).text().trim());
        });
        const bodyTypeJp = bodyItems[0] || "";
        const bodyType = bodyTypeJp ? translateBodyType(bodyTypeJp) : null;
        const colorJp = bodyItems[1]?.replace(/\s+/g, "") || "";
        const color = colorJp ? translateColor(colorJp) : null;

        // Location from cassetteSub
        const locationParts: string[] = [];
        $el.find(".cassetteSub__area p").each((_, p) => {
          locationParts.push($(p).text().trim());
        });
        const location = locationParts.join(" ") || null;

        // Images — extract from script data-original and noscript src
        const images: string[] = [];
        const seen = new Set<string>();

        // Method 1: Extract data-original from script tags (main + sub images)
        $el.find(".cassetteMain__mainImg script, .cassetteMain__subImg script").each(
          (_: number, scriptEl: unknown) => {
            const content = $(scriptEl).html() || "";
            const match = content.match(/data-original="([^"]+)"/);
            if (match?.[1]) {
              let src = match[1];
              if (src.startsWith("//")) src = `https:${src}`;
              if (!seen.has(src) && !src.includes("no_image")) {
                seen.add(src);
                images.push(src);
              }
            }
          }
        );

        // Method 2: Fallback — parse noscript raw HTML for src
        $el.find("noscript").each((_: number, noel: unknown) => {
          const html = $(noel).html() || "";
          const srcMatch = html.match(/src="([^"]*carsensor[^"]+)"/);
          if (srcMatch?.[1]) {
            let src = srcMatch[1];
            if (src.startsWith("//")) src = `https:${src}`;
            if (!seen.has(src) && !src.includes("no_image")) {
              seen.add(src);
              images.push(src);
            }
          }
        });

        // Fuel type isn't directly in the list page specList — leave null
        const fuelType: string | null = null;

        if (brandJp || modelJp) {
          cars.push({
            externalId,
            brand,
            brandJp,
            model,
            modelJp,
            year,
            mileage,
            mileageUnit: "km",
            price,
            priceCurrency: "JPY",
            engineSize,
            transmission,
            fuelType,
            color,
            bodyType,
            location,
            description,
            url: fullUrl,
            images,
          });
        }
      } catch (err) {
        console.error(`[Scraper] Error parsing car element:`, err);
      }
    });

    console.log(`[Scraper] Found ${cars.length} cars on page ${page}`);
    return cars;
  } catch (error) {
    console.error(`[Scraper] Error fetching page ${page}:`, error);
    return [];
  }
}

export async function scrapeMultiplePages(
  maxPages: number = 3
): Promise<ScrapedCar[]> {
  const allCars: ScrapedCar[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const cars = await scrapeListPage(page);
    allCars.push(...cars);

    if (cars.length === 0) break;

    // Polite delay between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return allCars;
}
